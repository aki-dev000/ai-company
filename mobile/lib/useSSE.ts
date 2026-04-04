import { useEffect, useRef, useState, useCallback } from "react";
import { streamUrl, SSEEvent } from "./api";

export function useSSE(sessionId: string | null) {
  const [events, setEvents] = useState<SSEEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const bufferRef = useRef<SSEEvent | null>(null);

  const flush = useCallback(() => {
    if (bufferRef.current) {
      const ev = bufferRef.current;
      bufferRef.current = null;
      setEvents((prev) => [...prev, ev]);
    }
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    setEvents([]);
    setIsDone(false);

    const url = streamUrl(sessionId);
    const es = new EventSource(url);

    es.onopen = () => setIsConnected(true);

    es.onmessage = (e) => {
      try {
        const data: SSEEvent = JSON.parse(e.data);

        if (data.type === "agent_token") {
          if (bufferRef.current && bufferRef.current.agent_id === data.agent_id) {
            bufferRef.current = {
              ...bufferRef.current,
              token: (bufferRef.current.token as string) + (data.token as string),
            };
          } else {
            flush();
            bufferRef.current = { ...data };
          }
          return;
        }

        flush();

        if (data.type === "stream_end") {
          setIsDone(true);
          es.close();
          setIsConnected(false);
          return;
        }

        setEvents((prev) => [...prev, data]);
      } catch {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      setIsConnected(false);
      es.close();
    };

    // Flush buffered tokens periodically
    const interval = setInterval(flush, 300);

    return () => {
      clearInterval(interval);
      es.close();
      setIsConnected(false);
    };
  }, [sessionId, flush]);

  return { events, isConnected, isDone };
}
