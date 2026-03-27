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
            {event.web_enabled && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-sky-900 text-sky-300">
                🌐 Web
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            {event.web_enabled ? "ウェブを調査中..." : "考え中..."}
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

  if (event.event === "tool_use") {
    const isSearch = event.tool_name === "web_search";
    const label = isSearch
      ? `検索中: "${event.tool_input?.query as string}"`
      : `取得中: ${event.tool_input?.url as string}`;
    return (
      <div className="ml-11 flex items-center gap-2 py-1 -mt-1">
        <span className="text-sky-400 text-sm">{isSearch ? "🔍" : "🌐"}</span>
        <span className="text-xs text-sky-300 italic">{label}</span>
      </div>
    );
  }

  if (event.event === "tool_result") {
    return (
      <div className="ml-11 mb-2 bg-sky-950 border border-sky-800 rounded px-3 py-1.5">
        <p className="text-xs text-sky-400 font-medium mb-0.5">
          {event.tool_name === "web_search" ? "検索結果" : "ページ取得完了"}
        </p>
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{event.preview}</p>
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

  if (event.event === "notification_start") {
    return (
      <div className="flex items-center gap-2 py-1.5 mt-1">
        <span className="text-lg">📬</span>
        <span className="text-xs text-indigo-300 italic">{event.message}</span>
      </div>
    );
  }

  if (event.event === "notification_done") {
    return (
      <div className="bg-indigo-950 border border-indigo-800 rounded px-3 py-2 mt-1">
        <p className="text-xs font-semibold text-indigo-300 mb-1">通知完了</p>
        {event.notion_url && (
          <a
            href={event.notion_url as string}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-400 hover:text-indigo-200 underline block"
          >
            Notionで確認する →
          </a>
        )}
        {event.gmail_sent && (
          <p className="text-xs text-gray-400 mt-0.5">Gmail 送信済み ✓</p>
        )}
      </div>
    );
  }

  if (event.event === "screenshot") {
    return (
      <div className="ml-11 mb-2 bg-gray-900 border border-gray-700 rounded overflow-hidden">
        <p className="text-xs text-gray-500 px-2 py-1">{event.agent_name} — ブラウザ操作中</p>
        {event.screenshot_b64 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`data:image/png;base64,${event.screenshot_b64}`}
            alt="browser screenshot"
            className="w-full"
          />
        )}
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
