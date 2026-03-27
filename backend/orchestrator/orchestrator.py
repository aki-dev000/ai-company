import asyncio

from orchestrator.planner import create_plan
from orchestrator.executor import execute_plan
from utils.event_bus import event_bus


async def run_directive(session_id: str, directive: str):
    await event_bus.emit(session_id, {
        "event": "planning_start",
        "session_id": session_id,
        "directive": directive,
    })

    try:
        plan = await asyncio.to_thread(create_plan, directive)
    except Exception as e:
        await event_bus.emit(session_id, {
            "event": "error",
            "agent_id": "orchestrator",
            "message": f"Planning failed: {e}",
        })
        await event_bus.close(session_id)
        return

    await execute_plan(session_id, plan)
