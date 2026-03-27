import json
import anthropic

from agents.registry import get_all_definitions
from config import settings
from orchestrator.plan_schema import ExecutionPlan, PlanStep

# Default fallback plan if LLM planning fails
DEFAULT_STEPS = [
    {"step_id": "s1", "label": "経営陣分析", "agents": ["cto", "cfo", "coo", "cmo"], "depends_on": [], "parallel": True},
    {"step_id": "s2", "label": "製品・開発計画", "agents": ["product_manager", "vp_engineering"], "depends_on": ["s1"], "parallel": True},
    {"step_id": "s3", "label": "営業・HR計画", "agents": ["sales_manager", "hr_manager"], "depends_on": ["s2"], "parallel": True},
]


def _build_planner_prompt(directive: str, agent_ids: list[str], agent_summaries: str) -> str:
    return f"""あなたはソフトウェア会社の実行コーディネーターです。
CEOのディレクティブを受け取り、どのエージェントがどの順序で対応すべきかを決定してください。

# 利用可能なエージェント
{agent_summaries}

# CEOのディレクティブ
{directive}

# タスク
上記のディレクティブに対して最適な実行計画をJSONで出力してください。
以下のルールに従ってください：
1. 必要なエージェントのみ含める（全員参加は不要）
2. 依存関係がないステップは並列実行にする（parallel: true）
3. 前のステップの出力が必要なステップはdepends_onに記載する
4. agent_idは必ず上記のリストから選ぶこと

出力形式（JSONのみ、前後の説明不要）：
{{
  "steps": [
    {{
      "step_id": "s1",
      "label": "ステップの説明",
      "agents": ["agent_id_1", "agent_id_2"],
      "depends_on": [],
      "parallel": true
    }},
    {{
      "step_id": "s2",
      "label": "次のステップ",
      "agents": ["agent_id_3"],
      "depends_on": ["s1"],
      "parallel": false
    }}
  ]
}}"""


def create_plan(directive: str) -> ExecutionPlan:
    definitions = get_all_definitions()
    valid_agent_ids = list(definitions.keys())

    agent_summaries = "\n".join([
        f"- {defn.id}: {defn.display_name} ({defn.department}) - {', '.join(defn.responsibilities[:2])}"
        for defn in definitions.values()
    ])

    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    for attempt in range(3):
        try:
            response = client.messages.create(
                model=settings.model,
                max_tokens=1024,
                messages=[{
                    "role": "user",
                    "content": _build_planner_prompt(directive, valid_agent_ids, agent_summaries)
                }]
            )

            raw = response.content[0].text.strip()
            # Extract JSON if wrapped in code blocks
            if "```" in raw:
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]

            data = json.loads(raw)
            steps = []
            for s in data.get("steps", []):
                # Filter out invalid agent IDs
                valid_agents = [a for a in s.get("agents", []) if a in valid_agent_ids]
                if not valid_agents:
                    continue
                steps.append(PlanStep(
                    step_id=s["step_id"],
                    label=s.get("label", s["step_id"]),
                    agents=valid_agents,
                    depends_on=s.get("depends_on", []),
                    parallel=s.get("parallel", True),
                ))

            if steps:
                return ExecutionPlan(directive=directive, steps=steps)

        except Exception as e:
            if attempt == 2:
                break

    # Fallback: use default plan with only available agents
    steps = []
    for s in DEFAULT_STEPS:
        valid_agents = [a for a in s["agents"] if a in valid_agent_ids]
        if valid_agents:
            steps.append(PlanStep(
                step_id=s["step_id"],
                label=s["label"],
                agents=valid_agents,
                depends_on=s["depends_on"],
                parallel=s["parallel"],
            ))
    return ExecutionPlan(directive=directive, steps=steps)
