"""
Dispatch API: スケジュール管理 + 即時実行エンドポイント
"""
from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel
from typing import Optional

from scheduler import create_schedule, delete_schedule, toggle_schedule, list_schedules, get_schedule
from orchestrator.orchestrator import run_directive
from storage.session_store import create_session, update_session
from utils.event_bus import event_bus

router = APIRouter(prefix="/api/dispatch", tags=["dispatch"])


class ScheduleRequest(BaseModel):
    directive: str
    cron: str                       # "minute hour day month day_of_week"
    label: Optional[str] = ""
    auto_mode: bool = True


class RunNowRequest(BaseModel):
    directive: str
    auto_mode: bool = True


async def _run_auto(session_id: str, directive: str, auto_mode: bool):
    try:
        await run_directive(session_id, directive, auto_mode=auto_mode)
        update_session(session_id, status="completed")
    except Exception as e:
        update_session(session_id, status="error", error=str(e))
        await event_bus.emit(session_id, {"event": "error", "agent_id": "system", "message": str(e)})
        await event_bus.close(session_id)


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
