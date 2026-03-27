"""
Anthropic Computer Use beta API を使ってMacのデスクトップを直接操作するエージェント。

必要な環境:
  - macOS（スクリーンショットに screencapture コマンドを使用）
  - pyautogui（マウス・キーボード操作）
  - Anthropic API キー（claude-opus-4-5 対応）

.env に設定:
  COMPUTER_USE_MODEL=claude-opus-4-5  （またはcomputer-use対応モデル）
"""
import asyncio
import base64
import subprocess
import tempfile
from pathlib import Path

from agents.base_agent import AgentDefinition, AgentContext, AgentOutput, BaseAgent
from config import settings
from utils.event_bus import event_bus

# pyautogui はオプショナル（Macでは pyobjc-core が必要）
_pyautogui_available = False
pyautogui = None

try:
    import pyautogui as _pag
    _pag.FAILSAFE = True  # 左上コーナーに移動で緊急停止
    pyautogui = _pag
    _pyautogui_available = True
except (ImportError, AssertionError):
    pass

# Computer Use ツール定義
COMPUTER_USE_TOOLS = [
    {
        "type": "computer_20241022",
        "name": "computer",
        "display_width_px": 1920,
        "display_height_px": 1080,
    },
    {
        "type": "bash_20241022",
        "name": "bash",
    },
    {
        "type": "text_editor_20241022",
        "name": "str_replace_editor",
    },
]

MAX_ROUNDS = 15


class ComputerUseAgent(BaseAgent):
    """
    Anthropic の computer-use-2024-10-22 beta を使って
    Mac の実際の画面を操作するエージェント。

    ⚠️  このエージェントはMacのマウス・キーボードを実際に操作します。
        実行中はPCを触らないでください。
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
            "computer_use": True,
        })

        if not _pyautogui_available:
            await event_bus.emit(session_id, {
                "event": "error",
                "agent_id": self.definition.id,
                "message": "pyautogui がインストールされていません。`pip install pyautogui` を実行してください。",
            })
            return AgentOutput(
                agent_id=self.definition.id,
                agent_name=self.definition.display_name,
                content="[Error] pyautogui not available",
                document_path="",
            )

        user_message = self._build_user_message(context)
        messages = [{"role": "user", "content": user_message}]
        final_text = ""

        for _round in range(MAX_ROUNDS):
            def _call_cu_api(msgs):
                return self.client.beta.messages.create(
                    model=settings.computer_use_model,
                    max_tokens=settings.max_tokens,
                    tools=COMPUTER_USE_TOOLS,
                    messages=msgs,
                    betas=["computer-use-2024-10-22"],
                    system=self.definition.system_prompt,
                )

            response = await asyncio.to_thread(_call_cu_api, messages)

            text_parts = []
            tool_use_blocks = []
            for block in response.content:
                if hasattr(block, "text"):
                    text_parts.append(block.text)
                elif hasattr(block, "type") and block.type == "tool_use":
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
                    "tool_name": f"computer:{tool_input.get('action', tool_name)}",
                    "tool_input": tool_input,
                })

                result = await self._execute_computer_action(
                    tool_name, tool_input, session_id
                )

                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": tool_block.id,
                    "content": result,
                })

            messages.append({"role": "assistant", "content": response.content})
            messages.append({"role": "user", "content": tool_results})

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

    async def _execute_computer_action(
        self, tool_name: str, tool_input: dict, session_id: str
    ) -> list:
        """
        Computer Use APIからのツール呼び出しを実際のMac操作に変換する。
        Returns: Anthropic tool_result の content リスト
        """
        if tool_name == "computer":
            action = tool_input.get("action")
            return await asyncio.to_thread(
                self._handle_computer_action, action, tool_input, session_id
            )

        if tool_name == "bash":
            command = tool_input.get("command", "")
            result = await asyncio.to_thread(self._run_bash, command)
            return [{"type": "text", "text": result}]

        if tool_name == "str_replace_editor":
            # テキストエディタ操作（ファイルの読み書き）
            cmd = tool_input.get("command", "view")
            path = tool_input.get("path", "")
            if cmd == "view":
                try:
                    content = Path(path).read_text(encoding="utf-8")
                    return [{"type": "text", "text": content[:5000]}]
                except Exception as e:
                    return [{"type": "text", "text": str(e)}]
            elif cmd == "create":
                file_text = tool_input.get("file_text", "")
                try:
                    Path(path).write_text(file_text, encoding="utf-8")
                    return [{"type": "text", "text": f"ファイルを作成しました: {path}"}]
                except Exception as e:
                    return [{"type": "text", "text": str(e)}]

        return [{"type": "text", "text": f"未知のツール: {tool_name}"}]

    def _handle_computer_action(self, action: str, tool_input: dict, session_id: str) -> list:
        """Mac の screencapture / pyautogui でコンピュータ操作を実行する（同期）。"""
        try:
            if action == "screenshot":
                b64 = self._take_screenshot()
                # スクリーンショットをSSEで配信（同期コンテキストから非同期発行は別途処理）
                return [{
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/png",
                        "data": b64,
                    }
                }]

            if action == "left_click":
                x, y = tool_input["coordinate"]
                pyautogui.click(x, y)
                return [{"type": "text", "text": f"クリック: ({x}, {y})"}]

            if action == "double_click":
                x, y = tool_input["coordinate"]
                pyautogui.doubleClick(x, y)
                return [{"type": "text", "text": f"ダブルクリック: ({x}, {y})"}]

            if action == "right_click":
                x, y = tool_input["coordinate"]
                pyautogui.rightClick(x, y)
                return [{"type": "text", "text": f"右クリック: ({x}, {y})"}]

            if action == "mouse_move":
                x, y = tool_input["coordinate"]
                pyautogui.moveTo(x, y, duration=0.3)
                return [{"type": "text", "text": f"マウス移動: ({x}, {y})"}]

            if action == "type":
                text = tool_input.get("text", "")
                pyautogui.write(text, interval=0.02)
                return [{"type": "text", "text": f"入力: {text[:50]}"}]

            if action == "key":
                key = tool_input.get("text", "")
                # macOS キー変換（ctrl → command）
                key = key.replace("ctrl", "command")
                pyautogui.hotkey(*key.split("+"))
                return [{"type": "text", "text": f"キー操作: {key}"}]

            if action == "scroll":
                x, y = tool_input["coordinate"]
                direction = tool_input.get("direction", "down")
                amount = tool_input.get("amount", 3)
                clicks = amount if direction == "down" else -amount
                pyautogui.scroll(clicks, x=x, y=y)
                return [{"type": "text", "text": f"スクロール: {direction} x{amount}"}]

            if action == "cursor_position":
                x, y = pyautogui.position()
                return [{"type": "text", "text": f"現在のカーソル位置: ({x}, {y})"}]

            if action == "left_click_drag":
                sx, sy = tool_input["start_coordinate"]
                ex, ey = tool_input["coordinate"]
                pyautogui.dragTo(ex, ey, startX=sx, startY=sy, duration=0.5)
                return [{"type": "text", "text": f"ドラッグ: ({sx},{sy}) → ({ex},{ey})"}]

        except Exception as e:
            return [{"type": "text", "text": f"操作エラー: {e}"}]

        return [{"type": "text", "text": f"未定義のアクション: {action}"}]

    def _take_screenshot(self) -> str:
        """macOS の screencapture でスクリーンショットを撮り、base64 で返す。"""
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as f:
            tmp_path = f.name
        subprocess.run(["screencapture", "-x", tmp_path], check=True)
        with open(tmp_path, "rb") as f:
            data = f.read()
        Path(tmp_path).unlink(missing_ok=True)
        return base64.b64encode(data).decode("utf-8")

    def _run_bash(self, command: str) -> str:
        """bashコマンドを実行して出力を返す。"""
        try:
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                timeout=30,
            )
            output = result.stdout + result.stderr
            return output[:3000] or "(no output)"
        except subprocess.TimeoutExpired:
            return "タイムアウト（30秒）"
        except Exception as e:
            return str(e)
