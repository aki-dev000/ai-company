import asyncio
import json
from datetime import datetime, timezone
from typing import AsyncIterator


class EventBus:
    def __init__(self):
        self._queues: dict[str, list[asyncio.Queue]] = {}
        self._logs: dict[str, list[dict]] = {}

    def _now(self) -> str:
        return datetime.now(timezone.utc).isoformat()

    async def emit(self, session_id: str, event: dict):
        event.setdefault("ts", self._now())
        self._logs.setdefault(session_id, []).append(event)
        for q in self._queues.get(session_id, []):
            await q.put(event)

    def get_log(self, session_id: str) -> list[dict]:
        return self._logs.get(session_id, [])

    async def subscribe(self, session_id: str) -> AsyncIterator[dict]:
        q: asyncio.Queue = asyncio.Queue()
        self._queues.setdefault(session_id, []).append(q)
        try:
            while True:
                event = await q.get()
                if event is None:
                    break
                yield event
        finally:
            queues = self._queues.get(session_id, [])
            if q in queues:
                queues.remove(q)

    async def close(self, session_id: str):
        for q in self._queues.get(session_id, []):
            await q.put(None)


event_bus = EventBus()
