"""
APScheduler を使ったディレクティブ自動実行スケジューラー。
スケジュールは data/schedules.json に永続化される。
"""
import json
import uuid
from datetime import datetime
from typing import Optional

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from config import SCHEDULES_FILE

# グローバルスケジューラーインスタンス
scheduler = AsyncIOScheduler(timezone="Asia/Tokyo")

_schedules: dict[str, dict] = {}  # schedule_id → schedule dict


# ── 永続化 ──────────────────────────────────────────────────

def _load_schedules() -> dict:
    try:
        data = json.loads(SCHEDULES_FILE.read_text(encoding="utf-8"))
        return {s["id"]: s for s in data}
    except Exception:
        return {}


def _save_schedules():
    SCHEDULES_FILE.write_text(
        json.dumps(list(_schedules.values()), ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


# ── スケジュール管理 ──────────────────────────────────────────

async def _trigger_directive(schedule_id: str, directive: str, auto_mode: bool):
    """スケジューラーから呼び出される。セッションを作成してディレクティブを実行する。"""
    from storage.session_store import create_session, update_session
    from orchestrator.orchestrator import run_directive
    from utils.event_bus import event_bus

    session = create_session(f"[Dispatch] {directive}")
    session_id = session["session_id"]
    print(f"[Dispatch] Triggering schedule={schedule_id} session={session_id}")

    # last_run 更新
    if schedule_id in _schedules:
        _schedules[schedule_id]["last_run"] = datetime.now().isoformat()
        _save_schedules()

    try:
        await run_directive(session_id, directive, auto_mode=auto_mode)
        update_session(session_id, status="completed")
    except Exception as e:
        update_session(session_id, status="error", error=str(e))
        await event_bus.emit(session_id, {
            "event": "error",
            "agent_id": "scheduler",
            "message": str(e),
        })
        await event_bus.close(session_id)


def create_schedule(
    directive: str,
    cron: str,
    auto_mode: bool = True,
    label: str = "",
) -> dict:
    """
    新しいスケジュールを登録する。

    cron: "minute hour day month day_of_week" 形式
          例: "0 9 * * 1"  → 毎週月曜 09:00
              "0 8 * * *"  → 毎日 08:00
              "*/30 * * * *" → 30分ごと
    """
    schedule_id = str(uuid.uuid4())[:8]
    parts = cron.strip().split()
    if len(parts) != 5:
        raise ValueError("cron は 'minute hour day month day_of_week' の形式で指定してください")

    minute, hour, day, month, day_of_week = parts
    trigger = CronTrigger(
        minute=minute,
        hour=hour,
        day=day,
        month=month,
        day_of_week=day_of_week,
        timezone="Asia/Tokyo",
    )

    scheduler.add_job(
        _trigger_directive,
        trigger=trigger,
        args=[schedule_id, directive, auto_mode],
        id=schedule_id,
        replace_existing=True,
    )

    schedule = {
        "id": schedule_id,
        "directive": directive,
        "cron": cron,
        "label": label or directive[:40],
        "auto_mode": auto_mode,
        "active": True,
        "created_at": datetime.now().isoformat(),
        "last_run": None,
    }
    _schedules[schedule_id] = schedule
    _save_schedules()
    return schedule


def delete_schedule(schedule_id: str) -> bool:
    if schedule_id not in _schedules:
        return False
    try:
        scheduler.remove_job(schedule_id)
    except Exception:
        pass
    del _schedules[schedule_id]
    _save_schedules()
    return True


def toggle_schedule(schedule_id: str) -> Optional[dict]:
    if schedule_id not in _schedules:
        return None
    s = _schedules[schedule_id]
    s["active"] = not s["active"]
    if s["active"]:
        scheduler.resume_job(schedule_id)
    else:
        scheduler.pause_job(schedule_id)
    _save_schedules()
    return s


def list_schedules() -> list[dict]:
    return list(_schedules.values())


def get_schedule(schedule_id: str) -> Optional[dict]:
    return _schedules.get(schedule_id)


def init_scheduler():
    """アプリ起動時に呼び出す。既存スケジュールを復元してスケジューラーを開始する。"""
    global _schedules
    _schedules = _load_schedules()

    # 既存スケジュールをAPSchedulerに登録
    for s in _schedules.values():
        if not s.get("active", True):
            continue
        parts = s["cron"].strip().split()
        if len(parts) != 5:
            continue
        minute, hour, day, month, day_of_week = parts
        try:
            scheduler.add_job(
                _trigger_directive,
                CronTrigger(
                    minute=minute, hour=hour, day=day,
                    month=month, day_of_week=day_of_week,
                    timezone="Asia/Tokyo",
                ),
                args=[s["id"], s["directive"], s.get("auto_mode", True)],
                id=s["id"],
                replace_existing=True,
            )
        except Exception as e:
            print(f"[Scheduler] Failed to restore job {s['id']}: {e}")

    scheduler.start()
    print(f"[Scheduler] Started with {len(_schedules)} schedules")
