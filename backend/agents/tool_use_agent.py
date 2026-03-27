import asyncio
import json

import anthropic

from agents.base_agent import AgentDefinition, AgentContext, AgentOutput, BaseAgent
from config import settings, DOCUMENTS_DIR
from utils.event_bus import event_bus
from tools import TOOL_DEFINITIONS
import tools.web_search as web_search_tool
import tools.url_fetch as url_fetch_tool


TOOL_EXECUTORS = {
    "web_search": web_search_tool.execute,
    "fetch_url": url_fetch_tool.execute,
}

MAX_TOOL_ROUNDS = 8  # 無限ループ防止


class ToolUseAgent(BaseAgent):
    """
    Claude の tool_use 機能を使ってウェブ検索・URL取得ができるエージェント。
    ツール呼び出し → 結果フィード → 最終回答 のループを処理する。
    """

    def __init__(self, definition: AgentDefinition):
        super().__init__(definition)

    async def run(self, session_id: str, context: AgentContext) -> AgentOutput:
        await event_bus.emit(session_id, {
            "event": "agent_start",
            "agent_id": self.definition.id,
            "agent_name": self.definition.display_name,
            "department": self.definition.department,
            "avatar_color": self.definition.avatar_color,
            "web_enabled": True,
        })

        user_message = self._build_user_message(context)
        messages = [{"role": "user", "content": user_message}]

        final_text = ""
        loop = asyncio.get_event_loop()

        for _round in range(MAX_TOOL_ROUNDS):
            # Claude に送信（同期をスレッドで実行）
            def _call_api(msgs):
                return self.client.messages.create(
                    model=settings.model,
                    system=self.definition.system_prompt,
                    tools=TOOL_DEFINITIONS,
                    messages=msgs,
                    max_tokens=settings.max_tokens,
                )

            response = await asyncio.to_thread(_call_api, messages)

            # テキストブロックを収集してトークンとして配信
            text_parts = []
            tool_use_blocks = []

            for block in response.content:
                if block.type == "text":
                    text_parts.append(block.text)
                elif block.type == "tool_use":
                    tool_use_blocks.append(block)

            # テキストをトークンとしてストリーム配信
            if text_parts:
                chunk = "".join(text_parts)
                final_text += chunk
                await event_bus.emit(session_id, {
                    "event": "agent_token",
                    "agent_id": self.definition.id,
                    "token": chunk,
                })

            # stop_reason が end_turn ならループ終了
            if response.stop_reason == "end_turn" or not tool_use_blocks:
                break

            # ── ツール呼び出しを処理 ──
            tool_results = []
            for tool_block in tool_use_blocks:
                tool_name = tool_block.name
                tool_input = tool_block.input

                # フロントエンドに「ツール使用中」イベントを配信
                await event_bus.emit(session_id, {
                    "event": "tool_use",
                    "agent_id": self.definition.id,
                    "tool_name": tool_name,
                    "tool_input": tool_input,
                })

                # ツール実行（同期処理をスレッドで実行）
                executor = TOOL_EXECUTORS.get(tool_name)
                if executor:
                    result_text = await asyncio.to_thread(executor, tool_input)
                else:
                    result_text = f"未知のツール: {tool_name}"

                # ツール結果をフロントエンドに配信（先頭200文字のプレビュー）
                await event_bus.emit(session_id, {
                    "event": "tool_result",
                    "agent_id": self.definition.id,
                    "tool_name": tool_name,
                    "preview": result_text[:200],
                })

                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": tool_block.id,
                    "content": result_text,
                })

            # メッセージ履歴にアシスタント応答＋ツール結果を追加
            messages.append({"role": "assistant", "content": response.content})
            messages.append({"role": "user", "content": tool_results})

        # ドキュメント保存
        doc_path = self._save_document(session_id, final_text)

        await event_bus.emit(session_id, {
            "event": "agent_done",
            "agent_id": self.definition.id,
            "agent_name": self.definition.display_name,
            "document": self.definition.output_document,
        })

        return AgentOutput(
            agent_id=self.definition.id,
            agent_name=self.definition.display_name,
            content=final_text,
            document_path=str(doc_path),
        )
