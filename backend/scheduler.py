"""
APScheduler を使ったディレクティブ自動実行スケジューラー。
スケジュールは data/schedules.json に永続化される。
"""
import json
import uuid
from datetime import datetime, timedelta
from typing import Optional

from datetime import timezone as _tz, timedelta as _td

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.date import DateTrigger

from config import SCHEDULES_FILE

JST = _tz(_td(hours=9))  # UTC+9 (Asia/Tokyo, no DST)

# グローバルスケジューラーインスタンス
scheduler = AsyncIOScheduler(timezone="Asia/Tokyo", job_defaults={"misfire_grace_time": 300})

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

async def _trigger_schedule(
    schedule_id: str,
    directive: str,
    auto_mode: bool,
    job_type: Optional[str] = None,
    job_config: Optional[dict] = None,
):
    """スケジューラーから呼び出される。ディレクティブまたは各種ジョブを実行する。"""
    from storage.session_store import create_session, update_session
    from orchestrator.orchestrator import run_directive
    from services.content_job_service import run_content_job
    from utils.event_bus import event_bus
    session_id = None

    # last_run 更新
    is_one_time = False
    if schedule_id in _schedules:
        _schedules[schedule_id]["last_run"] = datetime.now().isoformat()
        is_one_time = _schedules[schedule_id].get("one_time", False)
        _save_schedules()

    try:
        if job_type == "weekly_ebook":
            from services.weekly_ebook_service import run_weekly_ebook_job
            await run_weekly_ebook_job()
            return

        if job_type == "bio_report":
            from services.bio_report_service import run_weekly_bio_report
            await run_weekly_bio_report()
            return

        if job_type == "line_sticker":
            from services.line_sticker_service import run_weekly_line_sticker_job
            await run_weekly_line_sticker_job()
            return

        if job_type == "blog_post_vercel":
            import httpx
            from config import settings
            url = settings.monetized_blog_url.rstrip("/") + "/api/generate-post"
            secret = settings.monetized_blog_cron_secret
            async with httpx.AsyncClient(timeout=120) as client:
                resp = await client.get(url, headers={"Authorization": f"Bearer {secret}"})
            print(f"[Scheduler] Blog post triggered: {resp.status_code}")
            return

        if job_type:
            job_id = (job_config or {}).get("job_id")
            if not job_id:
                raise ValueError("job_config.job_id is required")
            await run_content_job(job_id, trigger="schedule")
            return

        session = create_session(f"[Dispatch] {directive}")
        session_id = session["session_id"]
        print(f"[Dispatch] Triggering schedule={schedule_id} session={session_id}")
        await run_directive(session_id, directive, auto_mode=auto_mode)
        update_session(session_id, status="completed")
    except Exception as e:
        if not job_type and session_id:
            update_session(session_id, status="error", error=str(e))
            await event_bus.emit(session_id, {
                "event": "error",
                "agent_id": "scheduler",
                "message": str(e),
            })
            await event_bus.close(session_id)
        else:
            print(f"[Scheduler] Job failed: schedule={schedule_id} job_type={job_type} error={e}")

    # 一回限りジョブは実行後に削除
    if is_one_time and schedule_id in _schedules:
        delete_schedule(schedule_id)


def create_schedule(
    directive: str,
    cron: str,
    auto_mode: bool = True,
    label: str = "",
    job_type: Optional[str] = None,
    job_config: Optional[dict] = None,
) -> dict:
    """
    新しいスケジュールを登録する。

    cron: "minute hour day month day_of_week" 形式
          例: "0 9-16 * * 1"   → 毎週月曜 09〜16時 毎時
              "0 6,9 * * 6"    → 毎週土曜 06:00 と 09:00
              "0 9-16 * * *"   → 毎日 09〜16時 毎時
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
        _trigger_schedule,
        trigger=trigger,
        args=[schedule_id, directive, auto_mode, job_type, job_config or {}],
        id=schedule_id,
        replace_existing=True,
    )

    schedule = {
        "id": schedule_id,
        "directive": directive,
        "cron": cron,
        "label": label or directive[:40],
        "auto_mode": auto_mode,
        "job_type": job_type,
        "job_config": job_config or {},
        "active": True,
        "created_at": datetime.now().isoformat(),
        "last_run": None,
    }
    _schedules[schedule_id] = schedule
    _save_schedules()
    return schedule


def schedule_once(
    run_at: datetime,
    job_type: str,
    job_config: dict,
    label: str,
) -> dict:
    """指定日時に一回だけ実行するジョブを登録する。実行後に自動削除される。"""
    schedule_id = str(uuid.uuid4())[:8]
    if run_at.tzinfo is None:
        run_at = run_at.replace(tzinfo=JST)

    scheduler.add_job(
        _trigger_schedule,
        DateTrigger(run_date=run_at),
        args=[schedule_id, "", True, job_type, job_config],
        id=schedule_id,
        replace_existing=True,
    )

    schedule = {
        "id": schedule_id,
        "directive": "",
        "cron": run_at.strftime("%Y-%m-%dT%H:%M JST"),
        "label": label,
        "auto_mode": True,
        "job_type": job_type,
        "job_config": job_config,
        "active": True,
        "one_time": True,
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


def update_last_run(job_type: str, job_config: Optional[dict] = None):
    """job_type (と job_config.job_id) に一致するスケジュールの last_run を更新する。"""
    job_id = (job_config or {}).get("job_id")
    for s in _schedules.values():
        if s.get("job_type") != job_type:
            continue
        if job_type == "content_job" and s.get("job_config", {}).get("job_id") != job_id:
            continue
        s["last_run"] = datetime.now().isoformat()
    _save_schedules()


# ── 自動管理スケジュール定義 ──────────────────────────────────

# デプロイ時に自動登録・自動更新されるスケジュール一覧
# cron を変更するだけで再デプロイ後に自動反映される
_AUTO_SCHEDULES = [
    {
        "match_key": "job_type",
        "match_val": "bio_report",
        "cron": "0 9-16 * * 1",       # 毎週月曜 09〜16時 毎時 (8回)
        "label": "🧠 働く脳のパフォーマンスレポート (月 09-16時 毎時)",
        "job_type": "bio_report",
        "job_config": {},
    },
    {
        "match_key": "job_type",
        "match_val": "line_sticker",
        "cron": "0 10-17 * * 4",      # 毎週木曜 10〜17時 毎時 (8回)
        "label": "🎨 LINEスタンプ自動生成 (木 10-17時 毎時)",
        "job_type": "line_sticker",
        "job_config": {},
    },
    {
        "match_key": "job_type",
        "match_val": "weekly_ebook",
        "cron": "0 6,9 * * 6",        # 毎週土曜 06:00 と 09:00 (2回)
        "label": "📚 電子書籍出版 (土 06:00/09:00)",
        "job_type": "weekly_ebook",
        "job_config": {},
    },
    {
        "match_key": "job_id",
        "match_val": "x_weekly_post",
        "cron": "0 13 * * 1,3,5",     # 月・水・金 13:00 (週3回)
        "label": "🐦 X投稿 (月水金 13:00)",
        "job_type": "content_job",
        "job_config": {"job_id": "x_weekly_post"},
    },
    {
        "match_key": "job_id",
        "match_val": "instagram_daily",
        "cron": "0 9-16 * * *",       # 毎日 09〜16時 毎時 (8回)
        "label": "📸 Instagram投稿 (毎日 09-16時 毎時)",
        "job_type": "content_job",
        "job_config": {"job_id": "instagram_daily"},
    },
    {
        "match_key": "job_id",
        "match_val": "youtube_sleep_shorts",
        "cron": "0 21 * * 1",         # 月曜 21:00
        "label": "🌙 YouTube睡眠Shorts (月 21:00)",
        "job_type": "content_job",
        "job_config": {"job_id": "youtube_sleep_shorts"},
    },
    {
        "match_key": "job_id",
        "match_val": "youtube_focus_shorts",
        "cron": "0 8 * * 3",          # 水曜 8:00
        "label": "🎯 YouTube集中Shorts (水 08:00)",
        "job_type": "content_job",
        "job_config": {"job_id": "youtube_focus_shorts"},
    },
    {
        "match_key": "job_id",
        "match_val": "youtube_meditation_shorts",
        "cron": "0 6 * * 5",          # 金曜 6:00
        "label": "🧘 YouTube瞑想Shorts (金 06:00)",
        "job_type": "content_job",
        "job_config": {"job_id": "youtube_meditation_shorts"},
    },
]


def _upsert_auto_schedule(spec: dict):
    """
    自動管理スケジュールを登録または更新する。
    - 未登録 → 新規作成
    - cron が変わっている → 削除して再作成
    - cron が同じ → 何もしない
    """
    key = spec["match_key"]
    val = spec["match_val"]

    if key == "job_type":
        existing = next(
            (s for s in _schedules.values() if s.get("job_type") == val),
            None,
        )
    else:  # job_id
        existing = next(
            (s for s in _schedules.values()
             if s.get("job_config", {}).get("job_id") == val),
            None,
        )

    if existing:
        if existing.get("cron") == spec["cron"]:
            return  # 変更なし
        print(f"[Scheduler] Updating cron for '{spec['label']}': {existing['cron']} → {spec['cron']}")
        delete_schedule(existing["id"])

    create_schedule(
        directive="",
        cron=spec["cron"],
        auto_mode=True,
        label=spec["label"],
        job_type=spec["job_type"],
        job_config=spec["job_config"],
    )
    print(f"[Scheduler] Registered: {spec['label']} ({spec['cron']})")


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
                _trigger_schedule,
                CronTrigger(
                    minute=minute, hour=hour, day=day,
                    month=month, day_of_week=day_of_week,
                    timezone="Asia/Tokyo",
                ),
                args=[s["id"], s["directive"], s.get("auto_mode", True), s.get("job_type"), s.get("job_config", {})],
                id=s["id"],
                replace_existing=True,
            )
        except Exception as e:
            print(f"[Scheduler] Failed to restore job {s['id']}: {e}")

    scheduler.start()

    # 自動管理スケジュールを登録/更新
    for spec in _AUTO_SCHEDULES:
        try:
            _upsert_auto_schedule(spec)
        except Exception as e:
            print(f"[Scheduler] Failed to upsert '{spec['label']}': {e}")

    print(f"[Scheduler] Started with {len(_schedules)} schedules")
