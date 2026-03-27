from pathlib import Path
from typing import Optional
import yaml

from agents.base_agent import AgentDefinition, BaseAgent
from config import AGENTS_DIR


_registry: dict[str, BaseAgent] = {}
_definitions: dict[str, AgentDefinition] = {}


def load_agents():
    global _registry, _definitions
    _registry = {}
    _definitions = {}

    for yaml_path in sorted(AGENTS_DIR.glob("*.yaml")):
        with open(yaml_path, encoding="utf-8") as f:
            data = yaml.safe_load(f)

        defn = AgentDefinition(
            id=data["id"],
            name=data["name"],
            display_name=data["display_name"],
            department=data["department"],
            tier=data["tier"],
            reports_to=data.get("reports_to", "ceo"),
            direct_reports=data.get("direct_reports", []),
            responsibilities=data.get("responsibilities", []),
            system_prompt=data["system_prompt"],
            input_context=data.get("input_context", ["directive", "prior_outputs"]),
            output_document=data["output_document"],
            can_delegate_to=data.get("can_delegate_to", []),
            avatar_color=data.get("avatar_color", "#6366f1"),
        )

        _definitions[defn.id] = defn
        _registry[defn.id] = BaseAgent(defn)


def get_agent(agent_id: str) -> Optional[BaseAgent]:
    return _registry.get(agent_id)


def get_definition(agent_id: str) -> Optional[AgentDefinition]:
    return _definitions.get(agent_id)


def get_all_definitions() -> dict[str, AgentDefinition]:
    return _definitions


def get_org_chart() -> list[dict]:
    result = []
    for defn in _definitions.values():
        result.append({
            "id": defn.id,
            "name": defn.name,
            "display_name": defn.display_name,
            "department": defn.department,
            "tier": defn.tier,
            "reports_to": defn.reports_to,
            "direct_reports": defn.direct_reports,
            "responsibilities": defn.responsibilities,
            "avatar_color": defn.avatar_color,
        })
    return sorted(result, key=lambda x: (x["tier"], x["id"]))
