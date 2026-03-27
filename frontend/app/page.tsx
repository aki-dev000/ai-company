"use client";
import { useState } from "react";
import DirectiveInput from "@/components/DirectiveInput";
import ActivityFeed from "@/components/ActivityFeed";
import DocumentList from "@/components/DocumentList";
import { useSSE } from "@/lib/useSSE";
import { getDocument } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Home() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [docContent, setDocContent] = useState<string>("");
  const { events, isDone } = useSSE(sessionId);

  const isRunning = !!sessionId && !isDone;

  const handleSessionStart = (sid: string) => {
    setSessionId(sid);
    setSelectedFile(null);
    setDocContent("");
  };

  const handleSelectFile = async (filename: string) => {
    if (!sessionId) return;
    setSelectedFile(filename);
    try {
      const content = await getDocument(sessionId, filename);
      setDocContent(content);
    } catch {
      setDocContent("ドキュメントの読み込みに失敗しました");
    }
  };

  return (
    <div className="flex h-[calc(100vh-49px)]">
      {/* Left: Directive + Activity */}
      <div className="w-[420px] flex-shrink-0 flex flex-col border-r border-gray-800 bg-gray-950">
        <div className="p-4 border-b border-gray-800">
          <DirectiveInput onSessionStart={handleSessionStart} isRunning={isRunning} />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            アクティビティ
          </h3>
          <ActivityFeed events={events} />
        </div>
      </div>

      {/* Right: Document viewer */}
      <div className="flex-1 flex overflow-hidden">
        {/* Document list */}
        <div className="w-56 flex-shrink-0 border-r border-gray-800 bg-gray-900 p-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            生成ドキュメント
          </h3>
          <DocumentList
            sessionId={sessionId}
            onSelect={handleSelectFile}
            selectedFile={selectedFile}
          />
        </div>

        {/* Markdown viewer */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-950">
          {docContent ? (
            <article className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{docContent}</ReactMarkdown>
            </article>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-700">
              <p className="text-5xl mb-3">📄</p>
              <p className="text-sm">左のリストからドキュメントを選択してください</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
