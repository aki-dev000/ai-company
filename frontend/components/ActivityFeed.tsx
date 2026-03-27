"use client";
import { useEffect, useRef } from "react";
import { SSEEvent } from "@/lib/api";

const DEPT_COLORS: Record<string, string> = {
  executive: "bg-red-900 text-red-300",
  engineering: "bg-blue-900 text-blue-300",
  product: "bg-pink-900 text-pink-300",
  marketing: "bg-orange-900 text-orange-300",
  sales: "bg-teal-900 text-teal-300",
  hr: "bg-green-900 text-green-300",
  finance: "bg-emerald-900 text-emerald-300",
};

function EventItem({ event }: { event: SSEEvent }) {
  if (event.event === "planning_start") {
    return (
      <div className="flex gap-3 py-2">
        <span className="text-xl">🧠</span>
        <div>
          <p className="text-xs text-gray-400">実行計画を作成中...</p>
          <p className="text-sm text-gray-300 mt-0.5 font-medium">「{event.directive}」</p>
        </div>
      </div>
    );
  }

  if (event.event === "plan_ready") {
    return (
      <div className="flex gap-3 py-2">
        <span className="text-xl">📋</span>
        <div>
          <p className="text-xs text-gray-400">実行計画が完成しました</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {event.steps?.map((s) => (
              <span key={s.step_id} className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded">
                {s.label} ({s.agents.length}名)
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (event.event === "step_start") {
    return (
      <div className="border-t border-gray-800 pt-3 mt-1">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
          ▶ {event.label}
        </p>
      </div>
    );
  }

  if (event.event === "step_complete") {
    return (
      <div className="flex gap-2 py-1">
        <span className="text-green-400 text-sm">✓</span>
        <p className="text-xs text-gray-400">{event.label} 完了</p>
      </div>
    );
  }

  if (event.event === "agent_start") {
    const deptClass = DEPT_COLORS[event.department || ""] || "bg-gray-800 text-gray-300";
    return (
      <div className="flex gap-3 py-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ backgroundColor: event.avatar_color || "#6366f1" }}
        >
          {(event.agent_name || "?")[0]}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">{event.agent_name}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${deptClass}`}>
              {event.department}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            考え中...
          </p>
        </div>
      </div>
    );
  }

  if (event.event === "agent_token") {
    return (
      <div className="ml-11 -mt-1 mb-2 bg-gray-800 rounded-lg p-3">
        <pre className="text-xs text-gray-300 whitespace-pre-wrap font-sans leading-relaxed max-h-48 overflow-y-auto">
          {event.token}
        </pre>
      </div>
    );
  }

  if (event.event === "agent_done") {
    return (
      <div className="ml-11 flex items-center gap-2 -mt-1 mb-1">
        <span className="text-green-400 text-xs">✓</span>
        <span className="text-xs text-gray-500">{event.document} を保存しました</span>
      </div>
    );
  }

  if (event.event === "run_complete") {
    return (
      <div className="border-t border-gray-700 pt-3 mt-2 flex gap-3">
        <span className="text-xl">🎉</span>
        <div>
          <p className="text-sm font-semibold text-green-400">全エージェントの処理が完了しました</p>
          <p className="text-xs text-gray-400 mt-0.5">{event.documents?.length || 0}件のドキュメントが生成されました</p>
        </div>
      </div>
    );
  }

  if (event.event === "error") {
    return (
      <div className="flex gap-2 py-1">
        <span className="text-red-400">⚠</span>
        <p className="text-xs text-red-400">{event.agent_id}: {event.message}</p>
      </div>
    );
  }

  return null;
}

interface Props {
  events: SSEEvent[];
}

export default function ActivityFeed({ events }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events.length]);

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-600">
        <p className="text-4xl mb-2">🏢</p>
        <p className="text-sm">ディレクティブを入力すると、各部署が動き始めます</p>
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {events.map((ev, i) => (
        <EventItem key={i} event={ev} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
