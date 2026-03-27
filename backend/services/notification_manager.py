"""
セッション完了時の通知を統括するマネージャー。
executor から呼び出す。
"""
import asyncio

from config import settings
from services.notion_notifier import create_session_page
from services.gmail_notifier import send_completion_email
from utils.event_bus import event_bus


async def notify_completion(
    session_id: str,
    directive: str,
    documents: list[str],
    auto_mode: bool = False,
) -> None:
    """
    Notion保存 → Gmail送信 を並列実行し、結果をSSEで通知する。
    auto_mode=True のときは通知先の確認なしに即実行。
    """
    if not settings.notify_on_complete and not auto_mode:
        return

    await event_bus.emit(session_id, {
        "event": "notification_start",
        "message": "Gmailへ通知中...",
    })

    # Notion（APIキーが設定されている場合のみ実行）
    notion_url = None
    if settings.notion_api_key and settings.notion_database_id:
        notion_url = await create_session_page(session_id, directive, documents)

    email_ok = await send_completion_email(
        session_id, directive, documents, notion_url
    )

    results = {}
    if notion_url:
        results["notion"] = notion_url
    if email_ok:
        results["gmail"] = "送信済み"

    await event_bus.emit(session_id, {
        "event": "notification_done",
        "notion_url": notion_url or "",
        "gmail_sent": email_ok,
        "results": results,
    })


async def _dummy():
    pass
