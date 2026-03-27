"use client";
import { useState } from "react";
import { submitDirective } from "@/lib/api";

interface Props {
  onSessionStart: (sessionId: string) => void;
  isRunning: boolean;
}

const EXAMPLES = [
  "新しいタスク管理アプリを開発したい",
  "AIを活用したコードレビューツールを作りたい",
  "社内の技術ブログを立ち上げたい",
  "モバイルアプリ版のリリースを計画したい",
];

export default function DirectiveInput({ onSessionStart, isRunning }: Props) {
  const [directive, setDirective] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!directive.trim() || loading || isRunning) return;
    setLoading(true);
    setError("");
    try {
      const { session_id } = await submitDirective(directive.trim());
      onSessionStart(session_id);
      setDirective("");
    } catch (e) {
      setError("送信に失敗しました。バックエンドが起動しているか確認してください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">👔</span>
        <h2 className="font-semibold text-white">CEO ディレクティブ</h2>
        {isRunning && (
          <span className="ml-auto text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full animate-pulse">
            実行中...
          </span>
        )}
      </div>

      <textarea
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
        rows={3}
        placeholder="会社への指示を入力してください..."
        value={directive}
        onChange={(e) => setDirective(e.target.value)}
        disabled={isRunning || loading}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
        }}
      />

      <div className="flex flex-wrap gap-2 mt-2 mb-3">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => setDirective(ex)}
            disabled={isRunning || loading}
            className="text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full px-3 py-1 transition-colors"
          >
            {ex}
          </button>
        ))}
      </div>

      {error && <p className="text-red-400 text-xs mb-2">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={!directive.trim() || loading || isRunning}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium py-2 rounded-lg transition-colors text-sm"
      >
        {loading ? "送信中..." : "指示を出す (⌘+Enter)"}
      </button>
    </div>
  );
}
