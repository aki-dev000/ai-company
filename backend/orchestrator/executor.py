import asyncio
from typing import Optional

from agents.base_agent import AgentContext, AgentOutput
from agents.registry import get_agent
from orchestrator.plan_schema import ExecutionPlan, PlanStep
from utils.event_bus import event_bus
from services.notification_manager import notify_completion


def _topological_sort(steps: list[PlanStep]) -> list[PlanStep]:
    step_map = {s.step_id: s for s in steps}
    visited = set()
    result = []

    def visit(step_id: str):
        if step_id in visited:
            return
        visited.add(step_id)
        step = step_map[step_id]
        for dep in step.depends_on:
            if dep in step_map:
                visit(dep)
        result.append(step)

    for step in steps:
        visit(step.step_id)

    return result


def _build_context(directive: str, completed: dict[str, list[AgentOutput]]) -> AgentContext:
    prior_outputs = []
    for step_id, outputs in completed.items():
        for output in outputs:
            # Trim to first 80 lines for token budget management
            lines = output.content.split("\n")
            trimmed = "\n".join(lines[:80])
            prior_outputs.append({
                "agent_id": output.agent_id,
                "agent_name": output.agent_name,
                "content": trimmed,
            })
    return AgentContext(directive=directive, prior_outputs=prior_outputs)


async def execute_plan(session_id: str, plan: ExecutionPlan, auto_mode: bool = False):
    sorted_steps = _topological_sort(plan.steps)
    completed: dict[str, list[AgentOutput]] = {}

    if not sorted_steps:
        await event_bus.emit(session_id, {
            "event": "error",
            "agent_id": "orchestrator",
            "message": "実行計画に有効なステップがありません。エージェント定義の読み込み状況を確認してください。",
        })
        await event_bus.close(session_id)
        raise RuntimeError("No executable plan steps were produced")

    await event_bus.emit(session_id, {
        "event": "plan_ready",
        "steps": [
            {
                "step_id": s.step_id,
                "label": s.label,
                "agents": s.agents,
                "depends_on": s.depends_on,
                "parallel": s.parallel,
            }
            for s in sorted_steps
        ],
    })

    for step in sorted_steps:
        await event_bus.emit(session_id, {
            "event": "step_start",
            "step_id": step.step_id,
            "label": step.label,
            "agents": step.agents,
        })

        context = _build_context(plan.directive, completed)

        async def run_agent(agent_id: str) -> Optional[AgentOutput]:
            agent = get_agent(agent_id)
            if agent is None:
                await event_bus.emit(session_id, {
                    "event": "error",
                    "agent_id": agent_id,
                    "message": f"Agent '{agent_id}' not found in registry",
                })
                return None
            try:
                return await agent.run(session_id, context)
            except Exception as e:
                print(f"[Executor] Agent '{agent_id}' failed: {type(e).__name__}: {e}")
                await event_bus.emit(session_id, {
                    "event": "error",
                    "agent_id": agent_id,
                    "message": str(e),
                })
                return None

        if step.parallel:
            results = await asyncio.gather(*[run_agent(aid) for aid in step.agents])
        else:
            results = []
            for aid in step.agents:
                r = await run_agent(aid)
                results.append(r)

        completed[step.step_id] = [r for r in results if r is not None]

        if not completed[step.step_id]:
            await event_bus.emit(session_id, {
                "event": "error",
                "step_id": step.step_id,
                "label": step.label,
                "message": "このステップのエージェント出力が生成されませんでした。",
            })
            await event_bus.close(session_id)
            raise RuntimeError(f"Step '{step.label}' produced no agent outputs")

        await event_bus.emit(session_id, {
            "event": "step_complete",
            "step_id": step.step_id,
            "label": step.label,
            "documents": [r.document_path for r in completed[step.step_id]],
        })

    all_docs = []
    for outputs in completed.values():
        for o in outputs:
            all_docs.append(o.document_path)

    await event_bus.emit(session_id, {
        "event": "run_complete",
        "session_id": session_id,
        "documents": all_docs,
        "auto_mode": auto_mode,
    })

    # 通知（Notion保存 + Gmail送信）
    await notify_completion(
        session_id=session_id,
        directive=plan.directive,
        documents=all_docs,
        auto_mode=auto_mode,
    )

    await event_bus.close(session_id)
