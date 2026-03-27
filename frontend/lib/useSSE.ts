"use client";
import { useEffect, useRef, useState } from "react";
import { SSEEvent, streamUrl } from "./api";

export function useSSE(sessionId: string | null) {
  const [events, setEvents] = useState<SSEEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    setEvents([]);
    setIsDone(false);
    setIsConnected(false);

    const es = new EventSource(streamUrl(sessionId));
    esRef.current = es;

    es.onopen = () => setIsConnected(true);

    es.onmessage = (e) => {
      try {
        const event: SSEEvent = JSON.parse(e.data);
        if (event.event === "stream_end") {
          setIsDone(true);
          es.close();
          return;
        }
        setEvents((prev) => {
          // Merge agent_token events into the last token buffer
          if (event.event === "agent_token" && prev.length > 0) {
            const last = prev[prev.length - 1];
            if (last.event === "agent_token" && last.agent_id === event.agent_id) {
              return [
                ...prev.slice(0, -1),
                { ...last, token: (last.token || "") + (event.token || "") },
              ];
            }
          }
          return [...prev, event];
        });
      } catch {}
    };

    es.onerror = () => {
      setIsConnected(false);
      es.close();
    };

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [sessionId]);

  return { events, isConnected, isDone };
}
