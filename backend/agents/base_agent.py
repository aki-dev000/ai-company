import asyncio
import json
from dataclasses import dataclass, field
from pathlib import Path

import anthropic

from config import settings, DOCUMENTS_DIR
from utils.event_bus import event_bus


@dataclass
class AgentDefinition:
    id: str
    name: str
    display_name: str
    department: str
    tier: int
    reports_to: str
    direct_reports: list[str]
    responsibilities: list[str]
    system_prompt: str
    input_context: list[str]
    output_document: str
    can_delegate_to: list[str] = field(default_factory=list)
    avatar_color: str = "#6366f1"


@dataclass
class AgentContext:
    directive: str
    prior_outputs: list[dict]  # [{"agent_id": str, "agent_name": str, "content": str}]


@dataclass
class AgentOutput:
    agent_id: str
    agent_name: str
    content: str
    document_path: str


class BaseAgent:
    def __init__(self, definition: AgentDefinition):
        self.definition = definition
        self.client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    def _build_user_message(self, context: AgentContext) -> str:
        parts = [f"# CEO ディレクティブ\n\n{context.directive}"]

        if context.prior_outputs:
            parts.append("\n---\n# 他部署からのインプット\n")
            for output in context.prior_outputs:
                header = f"## {output['agent_name']} からの報告"
                # Trim to first 80 lines to stay within token budget
                lines = output["content"].split("\n")
                trimmed = "\n".join(lines[:80])
                if len(lines) > 80:
                    trimmed += "\n\n*(以下省略)*"
                parts.append(f"{header}\n\n{trimmed}")

        return "\n\n".join(parts)

    def _save_document(self, session_id: str, content: str) -> Path:
        doc_dir = DOCUMENTS_DIR / session_id
        doc_dir.mkdir(parents=True, exist_ok=True)
        doc_path = doc_dir / self.definition.output_document
        doc_path.write_text(content, encoding="utf-8")
        return doc_path

    async def run(self, session_id: str, context: AgentContext) -> AgentOutput:
        await event_bus.emit(session_id, {
            "event": "agent_start",
            "agent_id": self.definition.id,
            "agent_name": self.definition.display_name,
            "department": self.definition.department,
            "avatar_color": self.definition.avatar_color,
        })

        user_message = self._build_user_message(context)
        accumulated = []
        loop = asyncio.get_event_loop()

        def _stream_sync():
            with self.client.messages.stream(
                model=settings.model,
                system=self.definition.system_prompt,
                messages=[{"role": "user", "content": user_message}],
                max_tokens=settings.max_tokens,
            ) as stream:
                for text in stream.text_stream:
                    accumulated.append(text)
                    asyncio.run_coroutine_threadsafe(
                        event_bus.emit(session_id, {
                            "event": "agent_token",
                            "agent_id": self.definition.id,
                            "token": text,
                        }),
                        loop,
                    )

        await asyncio.to_thread(_stream_sync)

        final_content = "".join(accumulated)
        doc_path = self._save_document(session_id, final_content)

        await event_bus.emit(session_id, {
            "event": "agent_done",
            "agent_id": self.definition.id,
            "agent_name": self.definition.display_name,
            "document": self.definition.output_document,
        })

        return AgentOutput(
            agent_id=self.definition.id,
            agent_name=self.definition.display_name,
            content=final_content,
            document_path=str(doc_path),
        )
