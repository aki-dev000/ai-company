"""
Playwright ブラウザ操作 + Claude tool_use を組み合わせたエージェント。
ブラウザを実際に操作しながら調査・タスクを実行する。
"""
import asyncio
import base64

from agents.base_agent import AgentDefinition, AgentContext, AgentOutput, BaseAgent
from config import settings
from utils.event_bus import event_bus
from tools.browser_tools import BrowserSession, BROWSER_TOOL_DEFINITIONS
from tools import TOOL_DEFINITIONS  # web_search / fetch_url も使える

ALL_TOOLS = TOOL_DEFINITIONS + BROWSER_TOOL_DEFINITIONS
MAX_ROUNDS = 12


class BrowserUseAgent(BaseAgent):
    """
    Playwright ブラウザを操作できるエージェント。
    スクリーンショットをリアルタイムにフロントエンドへ配信する。
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
            "browser_enabled": True,
        })

        user_message = self._build_user_message(context)
        messages = [{"role": "user", "content": user_message}]

        browser = BrowserSession()
        await browser.start(headless=True)

        final_text = ""
        loop = asyncio.get_event_loop()

        try:
            for _round in range(MAX_ROUNDS):
                def _call_api(msgs):
                    return self.client.messages.create(
                        model=settings.model,
                        system=self.definition.system_prompt,
                        tools=ALL_TOOLS,
                        messages=msgs,
                        max_tokens=settings.max_tokens,
                    )

                response = await asyncio.to_thread(_call_api, messages)

                text_parts = []
                tool_use_blocks = []
                for block in response.content:
                    if block.type == "text":
                        text_parts.append(block.text)
                    elif block.type == "tool_use":
                        tool_use_blocks.append(block)

                if text_parts:
                    chunk = "".join(text_parts)
                    final_text += chunk
                    await event_bus.emit(session_id, {
                        "event": "agent_token",
                        "agent_id": self.definition.id,
                        "token": chunk,
                    })

                if response.stop_reason == "end_turn" or not tool_use_blocks:
                    break

                tool_results = []
                for tool_block in tool_use_blocks:
                    tool_name = tool_block.name
                    tool_input = tool_block.input

                    await event_bus.emit(session_id, {
                        "event": "tool_use",
                        "agent_id": self.definition.id,
                        "tool_name": tool_name,
                        "tool_input": tool_input,
                    })

                    result_text = await self._execute_tool(
                        tool_name, tool_input, browser, session_id
                    )

                    await event_bus.emit(session_id, {
                        "event": "tool_result",
                        "agent_id": self.definition.id,
                        "tool_name": tool_name,
                        "preview": result_text[:200] if isinstance(result_text, str) else "",
                    })

                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": tool_block.id,
                        "content": result_text if isinstance(result_text, str) else str(result_text),
                    })

                messages.append({"role": "assistant", "content": response.content})
                messages.append({"role": "user", "content": tool_results})

        finally:
            await browser.close()

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

    async def _execute_tool(
        self,
        tool_name: str,
        tool_input: dict,
        browser: BrowserSession,
        session_id: str,
    ) -> str:
        # ブラウザツール
        if tool_name == "browser_navigate":
            result = await browser.navigate(tool_input["url"])
            # ナビゲート後にスクリーンショットを配信
            await self._emit_screenshot(browser, session_id)
            return result

        if tool_name == "browser_screenshot":
            b64 = await browser.screenshot_b64()
            await event_bus.emit(session_id, {
                "event": "screenshot",
                "agent_id": self.definition.id,
                "agent_name": self.definition.display_name,
                "screenshot_b64": b64,
            })
            return "スクリーンショットを取得しました"

        if tool_name == "browser_click":
            result = await browser.click(tool_input["selector"])
            await asyncio.sleep(0.5)
            await self._emit_screenshot(browser, session_id)
            return result

        if tool_name == "browser_type":
            return await browser.type_text(tool_input["selector"], tool_input["text"])

        if tool_name == "browser_extract":
            selector = tool_input.get("selector", "body")
            return await browser.extract_text(selector)

        # Webツール（web_search / fetch_url）
        import tools.web_search as ws
        import tools.url_fetch as uf
        if tool_name == "web_search":
            return await asyncio.to_thread(ws.execute, tool_input)
        if tool_name == "fetch_url":
            return await asyncio.to_thread(uf.execute, tool_input)

        return f"未知のツール: {tool_name}"

    async def _emit_screenshot(self, browser: BrowserSession, session_id: str):
        try:
            b64 = await browser.screenshot_b64()
            await event_bus.emit(session_id, {
                "event": "screenshot",
                "agent_id": self.definition.id,
                "agent_name": self.definition.display_name,
                "screenshot_b64": b64,
            })
        except Exception:
            pass
