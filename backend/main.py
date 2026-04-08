from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import ensure_dirs, settings
from agents.registry import load_agents
from api.directives import router as directives_router
from api.stream import router as stream_router
from api.documents import router as documents_router
from api.org_chart import router as org_chart_router
from api.dispatch import router as dispatch_router
from api.content_jobs import router as content_jobs_router
from api.content_kpis import router as content_kpis_router
from api.bio_reports import router as bio_reports_router
from api.inquiries import router as inquiries_router
from api.ebooks import router as ebooks_router
from api.line_stickers import router as line_stickers_router
from scheduler import init_scheduler, scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    ensure_dirs()
    load_agents()
    init_scheduler()

    print(f"Neiro Inc. AI Company started. Model: {settings.model}")
    yield
    scheduler.shutdown(wait=False)


app = FastAPI(title="Neiro Inc. - AI Company API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3010",
        "http://127.0.0.1:3010",
        "http://localhost:3011",
        "http://127.0.0.1:3011",
        settings.frontend_url,
        "https://frontend-iota-eight-68.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(directives_router)
app.include_router(stream_router)
app.include_router(documents_router)
app.include_router(org_chart_router)
app.include_router(dispatch_router)
app.include_router(content_jobs_router)
app.include_router(content_kpis_router)
app.include_router(bio_reports_router)
app.include_router(inquiries_router)
app.include_router(ebooks_router)
app.include_router(line_stickers_router)


@app.get("/api/health")
async def health():
    return {"status": "ok", "company": "Neiro Inc."}


@app.get("/api/health/notifications")
async def test_notifications():
    """Resend・Google Drive の接続テスト（設定確認用）"""
    import json
    from datetime import datetime
    results = {}

    # ── Resend テスト ──
    if settings.resend_api_key:
        try:
            import resend as resend_lib
            resend_lib.api_key = settings.resend_api_key
            resend_lib.Emails.send({
                "from": "Neiro <onboarding@resend.dev>",
                "to": [settings.gmail_to or settings.gmail_user],
                "subject": "[Neiro] テスト通知",
                "html": "<p>Resend接続テスト成功です。</p>",
            })
            results["email"] = "ok (Resend)"
        except Exception as e:
            results["email"] = f"error: {e}"
    else:
        results["email"] = "RESEND_API_KEY未設定"

    # ── Google Drive テスト ──
    if settings.google_service_account_json and settings.google_drive_bio_folder_id:
        try:
            from google.oauth2 import service_account
            from googleapiclient.discovery import build
            creds_info = json.loads(settings.google_service_account_json)
            creds = service_account.Credentials.from_service_account_info(
                creds_info, scopes=["https://www.googleapis.com/auth/drive.file"]
            )
            service = build("drive", "v3", credentials=creds, cache_discovery=False)
            service.files().list(pageSize=1, q=f"'{settings.google_drive_bio_folder_id}' in parents").execute()
            results["google_drive"] = "ok"
            results["bio_folder_id"] = settings.google_drive_bio_folder_id
        except Exception as e:
            results["google_drive"] = f"error: {e}"
    else:
        results["google_drive"] = "not configured"

    results["checked_at"] = datetime.now().isoformat()
    return results


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.host, port=settings.port, reload=True)
