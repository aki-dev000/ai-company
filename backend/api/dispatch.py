"""
Dispatch API: スケジュール管理 + 即時実行エンドポイント
"""
from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel
from typing import Any, Optional

from datetime import datetime, timedelta, timezone as _tz, timedelta as _td
from scheduler import create_schedule, delete_schedule, toggle_schedule, list_schedules, get_schedule, schedule_once, update_last_run
from orchestrator.orchestrator import run_directive
from services.content_job_service import run_content_job
from storage.session_store import create_session, update_session
from utils.event_bus import event_bus

router = APIRouter(prefix="/api/dispatch", tags=["dispatch"])


class ScheduleRequest(BaseModel):
    directive: str = ""
    cron: str                       # "minute hour day month day_of_week"
    label: Optional[str] = ""
    auto_mode: bool = True
    job_type: Optional[str] = None
    job_config: dict[str, Any] = {}


class RunNowRequest(BaseModel):
    directive: str = ""
    auto_mode: bool = True
    job_type: Optional[str] = None
    job_config: dict[str, Any] = {}


async def _run_auto(session_id: str, directive: str, auto_mode: bool):
    try:
        await run_directive(session_id, directive, auto_mode=auto_mode)
        update_session(session_id, status="completed")
    except Exception as e:
        update_session(session_id, status="error", error=str(e))
        await event_bus.emit(session_id, {"event": "error", "agent_id": "system", "message": str(e)})
        await event_bus.close(session_id)


async def _run_content_job_and_track(job_type: str, job_config: dict[str, Any]):
    """_run_content_job を実行し、対応スケジュールの last_run を更新する。"""
    try:
        await _run_content_job(job_type, job_config)
    finally:
        update_last_run(job_type, job_config)


async def _run_content_job(job_type: str, job_config: dict[str, Any]):
    # 専用サービスを持つジョブタイプは直接ルーティング
    if job_type == "bio_report":
        from services.bio_report_service import run_weekly_bio_report
        await run_weekly_bio_report()
        return
    if job_type == "dx_report":
        from services.dx_report_service import run_weekly_dx_report
        await run_weekly_dx_report()
        return
    if job_type == "line_sticker":
        from services.line_sticker_service import run_weekly_line_sticker_job
        await run_weekly_line_sticker_job()
        return
    if job_type == "weekly_ebook":
        from services.weekly_ebook_service import run_weekly_ebook_job
        await run_weekly_ebook_job()
        return
    if job_type == "blog_post_vercel":
        import httpx
        from config import settings
        url = settings.monetized_blog_url.rstrip("/") + "/api/generate-post"
        secret = settings.monetized_blog_cron_secret
        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.get(url, headers={"Authorization": f"Bearer {secret}"})
        print(f"[Dispatch] Blog post triggered: {resp.status_code}")
        return

    # content_job 系は job_id が必要
    job_id = job_config.get("job_id")
    if not job_id:
        raise ValueError("job_config.job_id is required for content_job")
    await run_content_job(job_id, trigger="dispatch")


# ── スケジュール CRUD ──────────────────────────────────────────

@router.get("")
async def get_schedules():
    """スケジュール一覧を返す。"""
    return list_schedules()


@router.post("")
async def add_schedule(req: ScheduleRequest):
    """新しいスケジュールを登録する。"""
    try:
        schedule = create_schedule(
            directive=req.directive,
            cron=req.cron,
            auto_mode=req.auto_mode,
            label=req.label or "",
            job_type=req.job_type,
            job_config=req.job_config,
        )
        return schedule
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{schedule_id}")
async def remove_schedule(schedule_id: str):
    """スケジュールを削除する。"""
    if not delete_schedule(schedule_id):
        raise HTTPException(status_code=404, detail="Schedule not found")
    return {"deleted": schedule_id}


@router.post("/{schedule_id}/toggle")
async def toggle(schedule_id: str):
    """スケジュールの有効/無効を切り替える。"""
    result = toggle_schedule(schedule_id)
    if not result:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return result


# ── 即時実行（Auto Mode） ──────────────────────────────────────

@router.post("/run-now")
async def run_now(req: RunNowRequest, background_tasks: BackgroundTasks):
    """
    Auto Mode でディレクティブを即時実行する。
    Notion保存・Gmail送信が自動的に行われる。
    """
    if req.job_type:
        background_tasks.add_task(_run_content_job_and_track, req.job_type, req.job_config)
        return {
            "status": "running",
            "job_type": req.job_type,
            "job_config": req.job_config,
            "auto_mode": req.auto_mode,
        }

    if not req.directive.strip():
        raise HTTPException(status_code=400, detail="Directive cannot be empty")
    session = create_session(f"[AutoMode] {req.directive.strip()}")
    background_tasks.add_task(
        _run_auto,
        session["session_id"],
        req.directive.strip(),
        req.auto_mode,
    )
    return {
        "session_id": session["session_id"],
        "status": "running",
        "auto_mode": req.auto_mode,
    }


# ── 今夜一括テスト実行 ────────────────────────────────────────────

# 各タスクの開始オフセット（分）と設定
_TONIGHT_TASKS = [
    {"offset": 0,  "job_type": "content_job",      "job_config": {"job_id": "x_weekly_post"},   "label": "🐦 X投稿 [今夜テスト]",              "note": "X投稿 (~2分)"},
    {"offset": 5,  "job_type": "content_job",       "job_config": {"job_id": "instagram_daily"}, "label": "📸 Instagram投稿 [今夜テスト]",      "note": "Instagram (~2分)"},
    {"offset": 8,  "job_type": "blog_post_vercel",  "job_config": {},                             "label": "✍️ ブログ記事生成 [今夜テスト]",    "note": "ブログ (~1分)"},
    {"offset": 10, "job_type": "bio_report",        "job_config": {},                             "label": "🧠 働く脳のパフォーマンスレポート [今夜テスト]","note": "Bio Report (~10分)"},
    {"offset": 25, "job_type": "line_sticker",      "job_config": {},                             "label": "🎨 LINEスタンプ生成 [今夜テスト]",  "note": "LINEスタンプ (~5分)"},
    {"offset": 35, "job_type": "weekly_ebook",      "job_config": {},                             "label": "📚 電子書籍出版 [今夜テスト]",       "note": "電子書籍 (~45-60分)"},
]


@router.post("/run-tonight")
async def run_tonight(start_hour: int = 22, start_minute: int = 0):
    """
    今夜の指定時刻から全タスクを時間差で1回ずつ実行する。
    デフォルト: 22:00 JST スタート
    """
    JST = _tz(_td(hours=9))
    now_jst = datetime.now(JST)
    base = now_jst.replace(hour=start_hour, minute=start_minute, second=0, microsecond=0)

    if base <= now_jst:
        raise HTTPException(status_code=400, detail=f"指定時刻 {start_hour:02d}:{start_minute:02d} はすでに過ぎています")

    scheduled = []
    for task in _TONIGHT_TASKS:
        run_at = base + timedelta(minutes=task["offset"])
        s = schedule_once(
            run_at=run_at,
            job_type=task["job_type"],
            job_config=task["job_config"],
            label=task["label"],
        )
        scheduled.append({
            "label": task["label"],
            "run_at": run_at.strftime("%H:%M JST"),
            "note": task["note"],
            "schedule_id": s["id"],
        })

    return {"status": "scheduled", "base_time": base.strftime("%H:%M JST"), "tasks": scheduled}
