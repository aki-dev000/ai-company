"""
Notion APIを使ってセッション結果をデータベースページとして保存する。

必要な .env 設定:
  NOTION_API_KEY=secret_xxxx
  NOTION_DATABASE_ID=xxxx  (データベースのID。NotionページURLの末尾)
"""
import httpx
from datetime import datetime
from typing import Optional

from config import settings


NOTION_API = "https://api.notion.com/v1"
HEADERS = {
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
}


def _auth_headers() -> dict:
    return {**HEADERS, "Authorization": f"Bearer {settings.notion_api_key}"}


async def create_session_page(
    session_id: str,
    directive: str,
    documents: list[str],
    summary: str = "",
) -> Optional[str]:
    """
    セッション結果をNotionデータベースに1ページとして作成する。
    Returns: 作成されたページのURL、失敗時はNone
    """
    if not settings.notion_api_key or not settings.notion_database_id:
        return None

    title = directive[:80] + ("..." if len(directive) > 80 else "")
    doc_count = len(documents)
    date_str = datetime.now().strftime("%Y-%m-%d %H:%M")

    # ページ本文（ブロック）
    children = [
        _heading("📋 ディレクティブ"),
        _paragraph(directive),
        _divider(),
        _heading("📁 生成ドキュメント一覧"),
    ]
    for doc in documents:
        doc_name = doc.split("/")[-1] if "/" in doc else doc
        children.append(_bullet(doc_name))

    if summary:
        children += [
            _divider(),
            _heading("📝 サマリー"),
            _paragraph(summary),
        ]

    payload = {
        "parent": {"database_id": settings.notion_database_id},
        "properties": {
            "title": {
                "title": [{"text": {"content": f"[TechForward] {title}"}}]
            },
            "セッションID": {"rich_text": [{"text": {"content": session_id}}]},
            "日時": {"rich_text": [{"text": {"content": date_str}}]},
            "ドキュメント数": {"number": doc_count},
        },
        "children": children,
    }

    async with httpx.AsyncClient(timeout=15) as client:
        res = await client.post(
            f"{NOTION_API}/pages",
            headers=_auth_headers(),
            json=payload,
        )
        if res.status_code == 200:
            page = res.json()
            return page.get("url", "")
        else:
            print(f"[Notion] Error {res.status_code}: {res.text[:200]}")
            return None


# ── Notionブロックヘルパー ──

def _heading(text: str) -> dict:
    return {
        "object": "block",
        "type": "heading_2",
        "heading_2": {"rich_text": [{"text": {"content": text}}]},
    }


def _paragraph(text: str) -> dict:
    return {
        "object": "block",
        "type": "paragraph",
        "paragraph": {"rich_text": [{"text": {"content": text[:2000]}}]},
    }


def _bullet(text: str) -> dict:
    return {
        "object": "block",
        "type": "bulleted_list_item",
        "bulleted_list_item": {"rich_text": [{"text": {"content": text}}]},
    }


def _divider() -> dict:
    return {"object": "block", "type": "divider", "divider": {}}
