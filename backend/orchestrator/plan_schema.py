from dataclasses import dataclass, field


@dataclass
class PlanStep:
    step_id: str
    label: str
    agents: list[str]
    depends_on: list[str] = field(default_factory=list)
    parallel: bool = True


@dataclass
class ExecutionPlan:
    directive: str
    steps: list[PlanStep]
