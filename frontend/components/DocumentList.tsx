"use client";
import { useEffect, useState } from "react";
import { listDocuments } from "@/lib/api";

interface Props {
  sessionId: string | null;
  onSelect: (filename: string) => void;
  selectedFile: string | null;
}

const DOC_ICONS: Record<string, string> = {
  cto: "💻", cfo: "💰", coo: "⚙️", cmo: "📣",
  vp_engineering: "🔧", product: "📦", marketing: "📢",
  sales: "🤝", hr: "👥", finance: "📊",
};

function iconForFile(filename: string): string {
  for (const [key, icon] of Object.entries(DOC_ICONS)) {
    if (filename.includes(key)) return icon;
  }
  return "📄";
}

export default function DocumentList({ sessionId, onSelect, selectedFile }: Props) {
  const [docs, setDocs] = useState<{ filename: string; size: number }[]>([]);

  useEffect(() => {
    if (!sessionId) return;
    const fetch = async () => {
      const result = await listDocuments(sessionId);
      setDocs(result);
    };
    fetch();
    const interval = setInterval(fetch, 3000);
    return () => clearInterval(interval);
  }, [sessionId]);

  if (!sessionId) return (
    <p className="text-xs text-gray-600 text-center py-4">セッションを選択してください</p>
  );

  if (docs.length === 0) return (
    <p className="text-xs text-gray-600 text-center py-4">ドキュメント生成中...</p>
  );

  return (
    <div className="space-y-1">
      {docs.map((doc) => (
        <button
          key={doc.filename}
          onClick={() => onSelect(doc.filename)}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
            selectedFile === doc.filename
              ? "bg-blue-900 text-blue-100"
              : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          <span>{iconForFile(doc.filename)}</span>
          <span className="truncate">{doc.filename}</span>
          <span className="ml-auto text-xs text-gray-500">{(doc.size / 1024).toFixed(1)}KB</span>
        </button>
      ))}
    </div>
  );
}
