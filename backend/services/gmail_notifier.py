"""
GmailのSMTPでセッション完了通知メールを送信する。

必要な .env 設定:
  GMAIL_USER=your@gmail.com
  GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx  (Googleアカウントのアプリパスワード)
  GMAIL_TO=recipient@example.com          (省略時は GMAIL_USER 自身に送信)

Googleアカウントでアプリパスワードを取得:
  https://myaccount.google.com/apppasswords
"""
import asyncio
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime
from pathlib import Path
from typing import Optional

from config import settings


def _build_html(
    session_id: str,
    directive: str,
    documents: list[str],
    notion_url: Optional[str],
) -> str:
    doc_rows = "".join(
        f"<li style='margin:4px 0;color:#374151;'>{Path(d).name}</li>"
        for d in documents
    )
    notion_link = (
        f'<p><a href="{notion_url}" style="color:#4f46e5;">Notionで確認する →</a></p>'
        if notion_url else ""
    )
    return f"""
    <html><body style="font-family:sans-serif;background:#f9fafb;padding:24px;">
      <div style="max-width:600px;margin:0 auto;background:white;border-radius:8px;
                  padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        <h2 style="color:#111827;margin:0 0 8px;">
          ✅ TechForward タスク完了
        </h2>
        <p style="color:#6b7280;font-size:13px;margin:0 0 24px;">
          {datetime.now().strftime("%Y-%m-%d %H:%M")}
        </p>
        <div style="background:#f3f4f6;border-radius:6px;padding:16px;margin-bottom:24px;">
          <p style="margin:0;font-size:13px;color:#6b7280;font-weight:600;">
            ディレクティブ
          </p>
          <p style="margin:8px 0 0;color:#111827;">{directive}</p>
        </div>
        <p style="font-weight:600;color:#374151;">生成ドキュメント ({len(documents)}件)</p>
        <ul style="margin:8px 0 24px;padding-left:20px;">{doc_rows}</ul>
        {notion_link}
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
        <p style="color:#9ca3af;font-size:12px;margin:0;">
          Session: {session_id} &nbsp;|&nbsp; TechForward Inc.
        </p>
      </div>
    </body></html>
    """


def _send_sync(subject: str, html: str, to: str) -> bool:
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = settings.gmail_user
        msg["To"] = to
        msg.attach(MIMEText(html, "html"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(settings.gmail_user, settings.gmail_app_password)
            server.sendmail(settings.gmail_user, to, msg.as_string())
        return True
    except Exception as e:
        print(f"[Gmail] Error: {e}")
        return False


async def send_completion_email(
    session_id: str,
    directive: str,
    documents: list[str],
    notion_url: Optional[str] = None,
) -> bool:
    """セッション完了通知メールを非同期で送信する。"""
    if not settings.gmail_user or not settings.gmail_app_password:
        return False

    to = settings.gmail_to or settings.gmail_user
    short_directive = directive[:50] + ("..." if len(directive) > 50 else "")
    subject = f"[TechForward] ✅ 完了: {short_directive}"
    html = _build_html(session_id, directive, documents, notion_url)

    return await asyncio.to_thread(_send_sync, subject, html, to)
