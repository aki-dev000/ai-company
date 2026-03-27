"use client";
import { useEffect, useState } from "react";
import { listDirectives, Session, getDocument } from "@/lib/api";
import DocumentList from "@/components/DocumentList";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function DocumentsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [docContent, setDocContent] = useState<string>("");

  useEffect(() => {
    listDirectives().then(setSessions);
  }, []);

  const handleSelectFile = async (filename: string) => {
    if (!selectedSession) return;
    setSelectedFile(filename);
    try {
      const content = await getDocument(selectedSession, filename);
      setDocContent(content);
    } catch {
      setDocContent("読み込みに失敗しました");
    }
  };

  return (
    <div className="flex h-[calc(100vh-49px)]">
      {/* Session list */}
      <div className="w-72 flex-shrink-0 border-r border-gray-800 bg-gray-900 p-4 overflow-y-auto">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          過去のセッション
        </h2>
        {sessions.length === 0 ? (
          <p className="text-xs text-gray-600">セッションなし</p>
        ) : (
          <div className="space-y-2">
            {sessions.map((s) => (
              <button
                key={s.session_id}
                onClick={() => { setSelectedSession(s.session_id); setSelectedFile(null); setDocContent(""); }}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedSession === s.session_id
                    ? "bg-blue-900 border border-blue-700"
                    : "bg-gray-800 hover:bg-gray-700 border border-transparent"
                }`}
              >
                <p className="text-sm text-white truncate">{s.directive}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    s.status === "completed" ? "bg-green-900 text-green-300" :
                    s.status === "running" ? "bg-blue-900 text-blue-300" :
                    "bg-red-900 text-red-300"
                  }`}>{s.status}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(s.created_at).toLocaleString("ja-JP")}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Document list */}
      <div className="w-56 flex-shrink-0 border-r border-gray-800 bg-gray-900 p-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          ドキュメント
        </h3>
        <DocumentList
          sessionId={selectedSession}
          onSelect={handleSelectFile}
          selectedFile={selectedFile}
        />
      </div>

      {/* Viewer */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-950">
        {docContent ? (
          <article className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{docContent}</ReactMarkdown>
          </article>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-700">
            <p className="text-5xl mb-3">🗂️</p>
            <p className="text-sm">セッションとドキュメントを選択してください</p>
          </div>
        )}
      </div>
    </div>
  );
}
