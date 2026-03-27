import json
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from utils.event_bus import event_bus
from storage.session_store import get_session

router = APIRouter(prefix="/api/stream", tags=["stream"])


@router.get("/{session_id}")
async def stream_session(session_id: str):
    async def event_generator():
        # First replay existing log
        for event in event_bus.get_log(session_id):
            data = json.dumps(event, ensure_ascii=False)
            yield f"data: {data}\n\n"

        # Then stream new events
        session = get_session(session_id)
        if session and session.get("status") in ("completed", "error"):
            yield "data: {\"event\": \"stream_end\"}\n\n"
            return

        async for event in event_bus.subscribe(session_id):
            data = json.dumps(event, ensure_ascii=False)
            yield f"data: {data}\n\n"
            if event.get("event") in ("run_complete", "error") and event.get("agent_id") == "system":
                break

        yield "data: {\"event\": \"stream_end\"}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        }
    )
