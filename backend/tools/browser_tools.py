"""
Playwright を使ったブラウザ操作ツール。
BrowserUseAgent から使用する。
"""
import asyncio
import base64
from typing import Any

# Playwright はオプショナル依存なので遅延インポート
_playwright_available = False
try:
    from playwright.async_api import async_playwright, Page, Browser
    _playwright_available = True
except ImportError:
    pass


BROWSER_TOOL_DEFINITIONS = [
    {
        "name": "browser_navigate",
        "description": "ブラウザで指定URLに移動します。",
        "input_schema": {
            "type": "object",
            "properties": {
                "url": {"type": "string", "description": "移動先のURL"}
            },
            "required": ["url"]
        }
    },
    {
        "name": "browser_screenshot",
        "description": "現在のブラウザ画面のスクリーンショットを取得します。",
        "input_schema": {
            "type": "object",
            "properties": {}
        }
    },
    {
        "name": "browser_click",
        "description": "ページ内の要素をCSSセレクタでクリックします。",
        "input_schema": {
            "type": "object",
            "properties": {
                "selector": {"type": "string", "description": "クリックするCSSセレクタ"}
            },
            "required": ["selector"]
        }
    },
    {
        "name": "browser_type",
        "description": "入力フィールドにテキストを入力します。",
        "input_schema": {
            "type": "object",
            "properties": {
                "selector": {"type": "string", "description": "CSSセレクタ"},
                "text": {"type": "string", "description": "入力するテキスト"}
            },
            "required": ["selector", "text"]
        }
    },
    {
        "name": "browser_extract",
        "description": "現在のページのテキスト内容を取得します。",
        "input_schema": {
            "type": "object",
            "properties": {
                "selector": {
                    "type": "string",
                    "description": "取得するCSSセレクタ（省略時はbody全体）"
                }
            }
        }
    },
]


class BrowserSession:
    """セッション間でブラウザを再利用するための管理クラス。"""

    def __init__(self):
        self._playwright = None
        self._browser: "Browser | None" = None
        self._page: "Page | None" = None

    async def start(self, headless: bool = True):
        if not _playwright_available:
            raise RuntimeError("playwright がインストールされていません。`pip install playwright` を実行してください。")
        self._playwright = await async_playwright().start()
        self._browser = await self._playwright.chromium.launch(
            headless=headless,
            args=["--no-sandbox", "--disable-dev-shm-usage"],
        )
        self._page = await self._browser.new_page()
        await self._page.set_viewport_size({"width": 1280, "height": 800})

    async def close(self):
        if self._browser:
            await self._browser.close()
        if self._playwright:
            await self._playwright.stop()

    async def navigate(self, url: str) -> str:
        await self._page.goto(url, wait_until="domcontentloaded", timeout=20000)
        return f"ナビゲート完了: {self._page.url}"

    async def screenshot_b64(self) -> str:
        """PNG スクリーンショットをbase64文字列で返す。"""
        png_bytes = await self._page.screenshot(full_page=False)
        return base64.b64encode(png_bytes).decode("utf-8")

    async def click(self, selector: str) -> str:
        try:
            await self._page.click(selector, timeout=5000)
            return f"クリック完了: {selector}"
        except Exception as e:
            return f"クリック失敗: {e}"

    async def type_text(self, selector: str, text: str) -> str:
        try:
            await self._page.fill(selector, text)
            return f"入力完了: {selector}"
        except Exception as e:
            return f"入力失敗: {e}"

    async def extract_text(self, selector: str = "body") -> str:
        try:
            element = self._page.locator(selector)
            text = await element.inner_text()
            return text[:3000]
        except Exception as e:
            return f"テキスト取得失敗: {e}"

    @property
    def page(self):
        return self._page
