import asyncio
from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel

from orchestrator.orchestrator import run_directive
from storage.session_store import create_session, get_session, list_sessions, update_session
from utils.event_bus import event_bus

router = APIRouter(prefix="/api/directives", tags=["directives"])


class DirectiveRequest(BaseModel):
    directive: str


async def _run_and_update(session_id: str, directive: str):
    try:
        await run_directive(session_id, directive)
        update_session(session_id, status="completed")
    except Exception as e:
        update_session(session_id, status="error", error=str(e))
        await event_bus.emit(session_id, {"event": "error", "agent_id": "system", "message": str(e)})
        await event_bus.close(session_id)


@router.post("")
async def submit_directive(req: DirectiveRequest, background_tasks: BackgroundTasks):
    if not req.directive.strip():
        raise HTTPException(status_code=400, detail="Directive cannot be empty")
    session = create_session(req.directive.strip())
    background_tasks.add_task(_run_and_update, session["session_id"], req.directive.strip())
    return {"session_id": session["session_id"], "status": "running"}


@router.get("")
async def list_directives():
    return list_sessions()


@router.get("/{session_id}")
async def get_directive(session_id: str):
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session
