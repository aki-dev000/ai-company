"use client";
import { useState, useEffect } from "react";
import {
  listSchedules,
  createSchedule,
  deleteSchedule,
  toggleSchedule,
  runNow,
  Schedule,
} from "@/lib/api";

const CRON_PRESETS = [
  { label: "毎日 08:00", value: "0 8 * * *" },
  { label: "毎週月曜 09:00", value: "0 9 * * 1" },
  { label: "毎週金曜 17:00", value: "0 17 * * 5" },
  { label: "毎時", value: "0 * * * *" },
  { label: "30分ごと", value: "*/30 * * * *" },
  { label: "カスタム", value: "custom" },
];

export default function DispatchPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [runningNow, setRunningNow] = useState<string | null>(null);

  // フォーム
  const [directive, setDirective] = useState("");
  const [cronPreset, setCronPreset] = useState(CRON_PRESETS[0].value);
  const [customCron, setCustomCron] = useState("");
  const [label, setLabel] = useState("");
  const [autoMode, setAutoMode] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchSchedules = async () => {
    const data = await listSchedules();
    setSchedules(data);
    setLoading(false);
  };

  useEffect(() => { fetchSchedules(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directive.trim()) return;
    const cron = cronPreset === "custom" ? customCron : cronPreset;
    setSubmitting(true);
    try {
      await createSchedule(directive, cron, label, autoMode);
      setDirective(""); setLabel(""); setCustomCron("");
      setShowForm(false);
      await fetchSchedules();
    } catch (err: unknown) {
      alert((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("このスケジュールを削除しますか？")) return;
    await deleteSchedule(id);
    await fetchSchedules();
  };

  const handleToggle = async (id: string) => {
    await toggleSchedule(id);
    await fetchSchedules();
  };

  const handleRunNow = async (s: Schedule) => {
    setRunningNow(s.id);
    try {
      const res = await runNow(s.directive, s.auto_mode);
      alert(`実行開始: セッション ${res.session_id}`);
    } finally {
      setRunningNow(null);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Dispatch</h1>
          <p className="text-xs text-gray-500 mt-1">
            ディレクティブをスケジュール実行・Auto Modeで管理します
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition"
        >
          + スケジュール追加
        </button>
      </div>

      {/* 追加フォーム */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-gray-900 border border-gray-700 rounded-xl p-5 mb-6 space-y-4"
        >
          <h2 className="text-sm font-semibold text-white">新しいスケジュール</h2>

          <div>
            <label className="text-xs text-gray-400">ラベル（任意）</label>
            <input
              type="text"
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="例: 毎朝の競合チェック"
              className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2
                         text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400">ディレクティブ *</label>
            <textarea
              value={directive}
              onChange={e => setDirective(e.target.value)}
              rows={3}
              required
              placeholder="例: AI業界の最新ニュースをweb_researcherで調査し、要約レポートを作成してください"
              className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2
                         text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400">スケジュール</label>
            <select
              value={cronPreset}
              onChange={e => setCronPreset(e.target.value)}
              className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2
                         text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              {CRON_PRESETS.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
            {cronPreset === "custom" && (
              <input
                type="text"
                value={customCron}
                onChange={e => setCustomCron(e.target.value)}
                placeholder="minute hour day month day_of_week（例: 0 9 * * 1）"
                className="w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2
                           text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 font-mono"
              />
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAutoMode(!autoMode)}
              className={`relative w-10 h-6 rounded-full transition ${autoMode ? "bg-indigo-600" : "bg-gray-600"}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all
                               ${autoMode ? "left-5" : "left-1"}`} />
            </button>
            <div>
              <p className="text-sm text-white">Auto Mode</p>
              <p className="text-xs text-gray-500">
                Notion保存・Gmail通知を自動実行。確認なしに処理が進みます。
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50
                         text-white text-sm rounded-lg transition"
            >
              {submitting ? "登録中..." : "スケジュールを登録"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition"
            >
              キャンセル
            </button>
          </div>
        </form>
      )}

      {/* スケジュール一覧 */}
      {loading ? (
        <p className="text-gray-500 text-sm">読み込み中...</p>
      ) : schedules.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <p className="text-4xl mb-3">🕐</p>
          <p className="text-sm">スケジュールがありません</p>
          <p className="text-xs mt-1">「+ スケジュール追加」から登録してください</p>
        </div>
      ) : (
        <div className="space-y-3">
          {schedules.map(s => (
            <div
              key={s.id}
              className={`bg-gray-900 border rounded-xl p-4 transition
                          ${s.active ? "border-gray-700" : "border-gray-800 opacity-60"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-white truncate">
                      {s.label || s.directive.slice(0, 50)}
                    </span>
                    {s.auto_mode && (
                      <span className="text-xs px-2 py-0.5 bg-indigo-900 text-indigo-300 rounded">
                        Auto
                      </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      s.active
                        ? "bg-green-900 text-green-300"
                        : "bg-gray-800 text-gray-500"
                    }`}>
                      {s.active ? "有効" : "停止中"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 truncate">{s.directive}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <code className="text-xs text-amber-400 bg-gray-800 px-2 py-0.5 rounded font-mono">
                      {s.cron}
                    </code>
                    {s.last_run && (
                      <span className="text-xs text-gray-600">
                        最終実行: {new Date(s.last_run).toLocaleString("ja-JP")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleRunNow(s)}
                    disabled={runningNow === s.id}
                    className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50
                               text-emerald-200 text-xs rounded-lg transition"
                  >
                    {runningNow === s.id ? "実行中..." : "今すぐ実行"}
                  </button>
                  <button
                    onClick={() => handleToggle(s.id)}
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600
                               text-gray-300 text-xs rounded-lg transition"
                  >
                    {s.active ? "停止" : "再開"}
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="px-3 py-1.5 bg-gray-800 hover:bg-red-900
                               text-gray-500 hover:text-red-300 text-xs rounded-lg transition"
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
