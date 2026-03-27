import json
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from config import SESSIONS_DIR


def _session_path(session_id: str) -> Path:
    return SESSIONS_DIR / f"{session_id}.json"


def create_session(directive: str) -> dict:
    session_id = str(uuid.uuid4())
    session = {
        "session_id": session_id,
        "directive": directive,
        "status": "running",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    _session_path(session_id).write_text(json.dumps(session, ensure_ascii=False, indent=2))
    return session


def update_session(session_id: str, **kwargs):
    path = _session_path(session_id)
    if not path.exists():
        return
    session = json.loads(path.read_text())
    session.update(kwargs)
    session["updated_at"] = datetime.now(timezone.utc).isoformat()
    path.write_text(json.dumps(session, ensure_ascii=False, indent=2))


def get_session(session_id: str) -> Optional[dict]:
    path = _session_path(session_id)
    if not path.exists():
        return None
    return json.loads(path.read_text())


def list_sessions() -> list[dict]:
    sessions = []
    for p in sorted(SESSIONS_DIR.glob("*.json"), key=lambda x: x.stat().st_mtime, reverse=True):
        try:
            sessions.append(json.loads(p.read_text()))
        except Exception:
            pass
    return sessions
