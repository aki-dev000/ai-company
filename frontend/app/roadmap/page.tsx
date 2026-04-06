"use client";
import React, { useState } from "react";

// ─────────────────────────────────────────────
// データ定義
// ─────────────────────────────────────────────

const PHASES = [
  {
    id: "2026",
    year: "2026",
    theme: "Foundation",
    themeJa: "基盤構築・事業立ち上げ",
    color: "#6366f1",
    bg: "from-indigo-950/40",
    quarters: ["Q1", "Q2", "Q3", "Q4"],
    summary: "5事業体制への整理・共通基盤の統合・初期収益化の立ち上げ",
  },
  {
    id: "2027",
    year: "2027",
    theme: "Growth",
    themeJa: "スケール・収益拡大",
    color: "#0ea5e9",
    bg: "from-sky-950/40",
    quarters: ["Q1", "Q2", "Q3", "Q4"],
    summary: "事業ライン横断の再利用強化・購読/受託/運営の収益拡大",
  },
  {
    id: "2028",
    year: "2028",
    theme: "Platform",
    themeJa: "プラットフォーム化・国際展開",
    color: "#06b6d4",
    bg: "from-cyan-950/40",
    quarters: ["Q1", "Q2", "Q3", "Q4"],
    summary: "研究・運営・基盤のプラットフォーム化とB2B提供の本格化",
  },
];

type RoadmapItem = {
  q: string;
  title: string;
  items: string[];
  milestone?: string;
};

const PILLARS: {
  id: string;
  tag: string;
  icon: string;
  title: string;
  color: string;
  dark: string;
  roadmap: { [year: string]: RoadmapItem[] };
}[] = [
  {
    id: "ai-research",
    tag: "AI Research & Media",
    icon: "📡",
    title: "AI技術リサーチ・情報発信",
    color: "#6366f1",
    dark: "#312e81",
    roadmap: {
      "2026": [
        {
          q: "Q2",
          title: "X×note自動配信パイプライン構築",
          items: ["週次AIリサーチ→X自動投稿の安定稼働", "note有料記事の週1本自動生成フロー確立", "Research Agent / Signal Analysis の役割整理"],
        },
        {
          q: "Q3",
          title: "X→note誘導の最適化",
          items: ["X投稿→note誘導CTA文言のテスト・改善", "note有料記事の販売開始（単品¥300〜500）", "AIサービス比較・レビュー記事の蓄積"],
          milestone: "X follower 1,000 / note記事15本",
        },
        {
          q: "Q4",
          title: "定期購読と多チャネル展開",
          items: ["note定期購読マガジン開始（¥980/月）", "人気記事の電子書籍化パイプライン構築", "反応データ→次週テーマ自動選定の仕組み化"],
          milestone: "note有料読者100人",
        },
      ],
      "2027": [
        {
          q: "Q1",
          title: "完全自動循環の確立",
          items: ["リサーチ→X→note→分析の全自動パイプライン", "X→note→Kindle→ブログの4面展開", "購読者向けプレミアムコンテンツの充実"],
          milestone: "note購読200人 / MRR ¥200K",
        },
        {
          q: "Q2",
          title: "コンテンツ資産の再利用拡大",
          items: ["電子書籍10冊へ拡大", "動画・スレッド・記事のクロス配信自動化", "Audiobook検討開始"],
          milestone: "コンテンツ資産のストック化",
        },
        {
          q: "Q3-Q4",
          title: "カスタムリサーチ少数受注",
          items: ["個人・小規模事業者向けAIリサーチ受注", "テーマ特化レポートの販売", "年間サブスク型プランの検討"],
          milestone: "MRR ¥500K",
        },
      ],
      "2028": [
        {
          q: "Q1-Q2",
          title: "リサーチ事業の拡張",
          items: ["英語版レポートの検証開始", "リサーチ+コンテンツの一気通貫サービス化", "収益安定化と再投資サイクルの確立"],
          milestone: "安定収益基盤の確立",
        },
        {
          q: "Q3-Q4",
          title: "メディア事業の成熟",
          items: ["コンテンツ資産の長期収益化モデル完成", "リサーチ成果の外部提供拡大", "次世代メディアフォーマットの実験"],
          milestone: "メディア事業の自走化",
        },
      ],
    },
  },
  {
    id: "bio-digital",
    tag: "Bio-Digital Research",
    icon: "🧠",
    title: "人間知性×AI研究",
    color: "#7c3aed",
    dark: "#3b0764",
    roadmap: {
      "2026": [
        {
          q: "Q2",
          title: "研究レポート配信開始",
          items: ["神経科学・認知科学 週次レポートβ版", "意識・感情・記憶 専門ニュースレター", "arXiv/PubMed 自動リサーチ構築"],
        },
        {
          q: "Q3",
          title: "コンサルサービス開始",
          items: ["AI企業向け 人間知性設計コンサル", "初期顧客 3社受注目標", "Bio-Digital研究ホワイトペーパー公開"],
          milestone: "コンサル月3社体制",
        },
        {
          q: "Q4",
          title: "研究パートナーシップ",
          items: ["大学・研究機関との共同研究MOU締結", "研究員AIエージェント体制 強化", "Bio-Digital Digest 有料化（¥1,980/月）"],
        },
      ],
      "2027": [
        {
          q: "Q1-Q2",
          title: "研究テーマの事業接続",
          items: ["感情・意図解析のプロトタイプ検証", "AI製品への感情設計コンサル強化", "研究特化レポートの深掘り"],
          milestone: "研究アセットの体系化",
        },
        {
          q: "Q3-Q4",
          title: "研究成果の外部提供準備",
          items: ["Human Intelligence API の外部公開可否を判断", "医療・介護・教育での活用仮説整理", "研究協業先の拡張"],
          milestone: "外部提供条件の明確化",
        },
      ],
      "2028": [
        {
          q: "Q1-Q4",
          title: "研究プラットフォーム化",
          items: ["Bio-Digital Research Hub 公開", "研究者コミュニティ 1,000人形成", "Human Intelligence OS の構想発表"],
          milestone: "研究プラットフォーム構想の具体化",
        },
      ],
    },
  },
  {
    id: "ebook",
    tag: "E-Book Publishing",
    icon: "📚",
    title: "電子書籍自動生成",
    color: "#059669",
    dark: "#064e3b",
    roadmap: {
      "2026": [
        {
          q: "Q2",
          title: "自動生成ライン完成",
          items: ["EPUB自動生成 5〜10分以内", "カバー生成・本文生成の安定化", "出版ワークフローの標準化"],
          milestone: "電子書籍ラインの定常運用",
        },
        {
          q: "Q3",
          title: "カタログ拡充",
          items: ["AI・テクノロジー・ビジネス系に特化", "カタログの品質管理", "派生記事・noteとの連動"],
          milestone: "テーマ別カタログの整備",
        },
        {
          q: "Q4",
          title: "B2B出版サービス",
          items: ["企業向けホワイトペーパー自動生成", "社内ナレッジ電子書籍化サービス", "提案書から出版への転用実験"],
          milestone: "B2B出版サービスの立ち上げ",
        },
      ],
      "2027": [
        {
          q: "Q1-Q2",
          title: "多フォーマット展開",
          items: ["多言語化の検証", "Audiobook自動生成の検討", "電子書籍SaaSのB2Bプラン試作"],
          milestone: "出版基盤の横展開",
        },
        {
          q: "Q3-Q4",
          title: "出版プラットフォーム化",
          items: ["セルフパブリッシングSaaS構想", "著者AIエージェント提供サービス", "出版社・メディアとの連携検討"],
          milestone: "出版サービスのSaaS化方針決定",
        },
      ],
      "2028": [
        {
          q: "Q1-Q4",
          title: "出版プラットフォーム強化",
          items: ["多言語対応の本格判断", "出版AIエージェントのホワイトラベル検討", "B2B案件への横展開"],
          milestone: "出版基盤のサービス化",
        },
      ],
    },
  },
  {
    id: "media-ops",
    tag: "AI Media Operations",
    icon: "🎬",
    title: "AIメディア自動運営",
    color: "#ea580c",
    dark: "#7c2d12",
    roadmap: {
      "2026": [
        {
          q: "Q2",
          title: "運営ライン統合・note誘導設計",
          items: ["収益ブログと動画運営資産の棚卸し", "全メディアからnote有料記事への誘導導線を設計", "配信KPIを共通化"],
        },
        {
          q: "Q3",
          title: "クロス誘導の標準化",
          items: ["ブログ記事末尾→note誘導CTAテンプレート化", "TikTok/YouTube Shorts→noteリンクの導線整備", "派生チャンネルからnoteへの流入効果を検証"],
          milestone: "メディア→note誘導の定着",
        },
        {
          q: "Q4",
          title: "多面展開と収益化改善",
          items: ["SEO・SNS反応を踏まえたCTA改善", "チャネル別のnote流入貢献度分析", "動画コンテンツの自動生成フロー安定化"],
          milestone: "認知→収益化の面の拡大",
        },
      ],
      "2027": [
        {
          q: "Q1-Q2",
          title: "コンテンツ再利用の自動化",
          items: ["記事→動画→Shorts→noteの自動変換パイプライン", "配信データの集約・分析自動化", "フォーマット別改善サイクルの定着"],
          milestone: "クロス配信の完全自動化",
        },
        {
          q: "Q3-Q4",
          title: "メディア資産のストック化",
          items: ["人気コンテンツのまとめ電子書籍化", "長期SEOコンテンツの蓄積と収益安定化", "Audiobook等の新フォーマット検討"],
          milestone: "ストック型メディア収益の確立",
        },
      ],
      "2028": [
        {
          q: "Q1-Q4",
          title: "メディア運営の成熟",
          items: ["複数媒体をまたぐ自動運営の標準化", "コンテンツ資産の長期収益モデル完成", "新フォーマット・新プラットフォームへの展開"],
          milestone: "メディア事業の自走化",
        },
      ],
    },
  },
  {
    id: "knowledge-infra",
    tag: "Knowledge Infrastructure",
    icon: "🗂️",
    title: "ナレッジ基盤・プライベートAI",
    color: "#14b8a6",
    dark: "#134e4a",
    roadmap: {
      "2026": [
        {
          q: "Q2",
          title: "知識基盤の内部整備",
          items: ["my-brain-connector の運用開始", "PDF / URL / Markdown の取り込み整理", "非公開文書の扱いルール整備"],
        },
        {
          q: "Q3",
          title: "全事業での共通利用",
          items: ["レポート・記事・提案書での再利用を標準化", "検索 / 要約の利用フロー整備", "Gemma / Ollama 検証の定常化"],
          milestone: "社内Knowledge OS化",
        },
        {
          q: "Q4",
          title: "B2B化の仮説整理",
          items: ["プライベートAI導入支援メニューの検討", "業種別ユースケース整理", "情報管理要件の明確化"],
          milestone: "対外展開の要件定義",
        },
      ],
      "2027": [
        {
          q: "Q1-Q2",
          title: "Private AI支援の試行",
          items: ["社内文書検索・要約支援のPoC", "RAG/ローカルLLM構成の検証", "導入支援の標準手順作成"],
          milestone: "B2B PoCの開始",
        },
        {
          q: "Q3-Q4",
          title: "知識基盤の外販準備",
          items: ["Private AI導入支援の提案開始", "業務テンプレートの整備", "継続支援モデルの設計"],
          milestone: "外販ラインの整備",
        },
      ],
      "2028": [
        {
          q: "Q1-Q4",
          title: "Knowledge Platform化",
          items: ["複数企業向けの標準導入パターン確立", "Private AI + Knowledge OS のパッケージ化", "継続支援のプロダクト化"],
          milestone: "Knowledge Platform の確立",
        },
      ],
    },
  },
];

const SYSTEM_ROADMAP: {
  year: string;
  color: string;
  items: { q: string; title: string; desc: string }[];
}[] = [
  {
    year: "2026",
    color: "#6366f1",
    items: [
      { q: "Q2", title: "24名体制の再編", desc: "5事業に対して役割を再配置し、重複タスクを整理" },
      { q: "Q3", title: "Gmail/Notion連携強化", desc: "完了通知・ドキュメント自動同期・Slack連携" },
      { q: "Q4", title: "共通運用基盤の定着", desc: "ディレクティブ→調査→出力の共通化と自動運用" },
    ],
  },
  {
    year: "2027",
    color: "#0ea5e9",
    items: [
      { q: "Q1", title: "マルチモーダル対応", desc: "画像・PDF・動画インプット対応エージェント" },
      { q: "Q2", title: "エージェント自己改善", desc: "成果データを基に運用フローとプロンプトを改善" },
      { q: "Q3", title: "事業別ダッシュボード整備", desc: "調査・運営・Knowledge の各ラインで可視化を強化" },
      { q: "Q4", title: "26エージェント体制", desc: "必要領域にだけ専門エージェントを追加" },
    ],
  },
  {
    year: "2028",
    color: "#06b6d4",
    items: [
      { q: "Q1", title: "自律型運営OS", desc: "人間のレビューを残しつつ、自動運営の比率を高める" },
      { q: "Q2", title: "Knowledge / Media / Research API整理", desc: "対外提供できる単位へ機能を分割" },
      { q: "Q4", title: "28エージェント体制", desc: "収益に直結する領域を中心に拡張" },
    ],
  },
];

const REVENUE_TARGETS = [
  { year: "2026 末", mrr: "¥100K〜150K", arr: "¥1.2M〜1.8M", agents: "24名", color: "#6366f1" },
  { year: "2027 末", mrr: "¥300K〜500K", arr: "¥3.6M〜6M", agents: "26名", color: "#0ea5e9" },
  { year: "2028 末", mrr: "¥800K〜1.5M", arr: "¥10M〜18M", agents: "28名", color: "#06b6d4" },
];

// ─────────────────────────────────────────────
// コンポーネント
// ─────────────────────────────────────────────

function PhaseHeader({
  phase,
  active,
  onClick,
}: {
  phase: (typeof PHASES)[0];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-xl border px-5 py-4 text-left transition-all duration-200 ${
        active
          ? "border-opacity-60 bg-gray-900/90"
          : "border-gray-800 bg-gray-900/40 hover:border-gray-700"
      }`}
      style={active ? { borderColor: phase.color + "99" } : {}}
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: phase.color }}
        >
          {phase.year}
        </span>
        <span
          className="text-xs px-2 py-0.5 rounded font-semibold"
          style={{ backgroundColor: phase.color + "22", color: phase.color }}
        >
          {phase.theme}
        </span>
      </div>
      <p className="text-white text-sm font-semibold leading-snug">{phase.themeJa}</p>
      {active && (
        <p className="text-gray-500 text-xs mt-1 leading-relaxed">{phase.summary}</p>
      )}
    </button>
  );
}

function PillarRoadmapCard({
  pillar,
  year,
}: {
  pillar: (typeof PILLARS)[0];
  year: string;
}) {
  const items = pillar.roadmap[year] || [];
  return (
    <div
      className="rounded-xl border bg-gray-900/80 overflow-hidden"
      style={{ borderColor: pillar.color + "44" }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center gap-3"
        style={{ backgroundColor: pillar.color + "18" }}
      >
        <span className="text-2xl">{pillar.icon}</span>
        <div>
          <p
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: pillar.color }}
          >
            {pillar.tag}
          </p>
          <p className="text-white text-sm font-semibold">{pillar.title}</p>
        </div>
      </div>
      {/* Timeline items */}
      <div className="px-4 py-3 space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex gap-3">
            {/* Quarter badge */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded font-mono"
                style={{ backgroundColor: pillar.color + "22", color: pillar.color }}
              >
                {item.q}
              </span>
              {i < items.length - 1 && (
                <div
                  className="w-px flex-1 min-h-[16px]"
                  style={{ backgroundColor: pillar.color + "30" }}
                />
              )}
            </div>
            {/* Content */}
            <div className="pb-2">
              <p className="text-white text-sm font-semibold mb-1">{item.title}</p>
              <ul className="space-y-0.5">
                {item.items.map((it, j) => (
                  <li key={j} className="text-gray-400 text-xs flex gap-1.5">
                    <span style={{ color: pillar.color }} className="flex-shrink-0">▸</span>
                    {it}
                  </li>
                ))}
              </ul>
              {item.milestone && (
                <div
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: pillar.color + "22", color: pillar.color, border: `1px solid ${pillar.color}44` }}
                >
                  <span>🏆</span> {item.milestone}
                </div>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-gray-600 text-xs py-2">このフェーズの詳細は準備中です</p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// メインページ
// ─────────────────────────────────────────────

export default function RoadmapPage() {
  const [activeYear, setActiveYear] = useState("2026");

  return (
    <div className="min-h-full bg-gray-950 text-gray-100">
      {/* ヘッダー */}
      <section className="border-b border-gray-800 bg-gradient-to-br from-indigo-950/30 via-gray-950 to-gray-950 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">
            TechForward Inc. — 3-Year Roadmap
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            2026 – 2028 成長ロードマップ
          </h1>
          <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
            AI Research・Bio-Digital・E-Book・Media Ops・Knowledge Infrastructure の5事業を柱に、
            現在の24名体制から、調査・運営・基盤を横断して再利用できる事業基盤へ進化させる。
          </p>
          {/* 収益目標サマリー */}
          <div className="grid grid-cols-3 gap-3 mt-8 max-w-2xl">
            {REVENUE_TARGETS.map((r) => (
              <div
                key={r.year}
                className="rounded-xl border px-4 py-3 bg-gray-900/60"
                style={{ borderColor: r.color + "55" }}
              >
                <p className="text-xs font-mono font-bold" style={{ color: r.color }}>
                  {r.year}
                </p>
                <p className="text-white text-xl font-bold mt-1">{r.mrr}</p>
                <p className="text-gray-500 text-xs">MRR目標</p>
                <p className="text-gray-400 text-xs mt-1.5">ARR {r.arr}</p>
                <p className="text-gray-500 text-xs">エージェント {r.agents}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        {/* フェーズセレクター */}
        <div className="flex gap-3">
          {PHASES.map((phase) => (
            <PhaseHeader
              key={phase.id}
              phase={phase}
              active={activeYear === phase.id}
              onClick={() => setActiveYear(phase.id)}
            />
          ))}
        </div>

        {/* 事業別ロードマップ */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{
                color:
                  activeYear === "2026"
                    ? "#6366f1"
                    : activeYear === "2027"
                    ? "#0ea5e9"
                    : "#06b6d4",
              }}
            >
              {activeYear} — Business Roadmap
            </span>
            <div className="h-px flex-1 bg-gray-800" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            {PILLARS.map((pillar) => (
              <PillarRoadmapCard key={pillar.id} pillar={pillar} year={activeYear} />
            ))}
          </div>
        </section>

        {/* システム・エージェント開発ロードマップ */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              System & Agent Development
            </span>
            <div className="h-px flex-1 bg-gray-800" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SYSTEM_ROADMAP.map((yr) => (
              <div
                key={yr.year}
                className={`rounded-xl border bg-gray-900/80 overflow-hidden transition-all duration-200 ${
                  activeYear === yr.year ? "ring-1" : "opacity-60"
                }`}
                style={{
                  borderColor: yr.color + "44",
                  ...(activeYear === yr.year ? { ringColor: yr.color + "60" } : {}),
                }}
              >
                <div
                  className="px-4 py-2.5 flex items-center gap-2"
                  style={{ backgroundColor: yr.color + "18" }}
                >
                  <span className="text-lg">⚙️</span>
                  <div>
                    <span
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: yr.color }}
                    >
                      {yr.year}
                    </span>
                    <span className="text-gray-400 text-xs ml-2">システム開発</span>
                  </div>
                </div>
                <div className="px-4 py-3 space-y-3">
                  {yr.items.map((item, i) => (
                    <div key={i} className="flex gap-2.5">
                      <span
                        className="text-xs font-bold font-mono px-1.5 py-0.5 rounded h-fit flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: yr.color + "22", color: yr.color }}
                      >
                        {item.q}
                      </span>
                      <div>
                        <p className="text-white text-xs font-semibold">{item.title}</p>
                        <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 全体タイムライン（ガントチャート風） */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              3-Year Overview Timeline
            </span>
            <div className="h-px flex-1 bg-gray-800" />
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 overflow-hidden">
            {/* 年ヘッダー */}
            <div className="grid grid-cols-[140px_1fr_1fr_1fr] border-b border-gray-800">
              <div className="px-4 py-2.5 border-r border-gray-800" />
              {PHASES.map((phase) => (
                <div
                  key={phase.id}
                  className="px-4 py-2.5 border-r border-gray-800 last:border-r-0"
                >
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: phase.color }}
                  >
                    {phase.year} — {phase.theme}
                  </span>
                </div>
              ))}
            </div>
            {/* Qヘッダー */}
            <div className="grid grid-cols-[140px_1fr_1fr_1fr] border-b border-gray-800 bg-gray-900/40">
              <div className="px-4 py-1.5 border-r border-gray-800 text-xs text-gray-600 font-semibold">
                事業
              </div>
              {PHASES.map((phase) => (
                <div
                  key={phase.id}
                  className="grid grid-cols-4 border-r border-gray-800 last:border-r-0"
                >
                  {phase.quarters.map((q) => (
                    <div
                      key={q}
                      className="px-2 py-1.5 text-center text-xs text-gray-600 border-r border-gray-800/50 last:border-r-0"
                    >
                      {q}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {/* 各事業の行 */}
            {PILLARS.map((pillar) => (
              <div
                key={pillar.id}
                className="grid grid-cols-[140px_1fr_1fr_1fr] border-b border-gray-800 last:border-b-0"
              >
                {/* ラベル */}
                <div className="px-4 py-3 border-r border-gray-800 flex items-center gap-2">
                  <span className="text-base">{pillar.icon}</span>
                  <span className="text-xs text-gray-300 font-semibold leading-tight">
                    {pillar.tag.replace(" & ", "\n& ")}
                  </span>
                </div>
                {/* 各年のバー */}
                {PHASES.map((phase) => {
                  const items = pillar.roadmap[phase.year] || [];
                  return (
                    <div
                      key={phase.id}
                      className="grid grid-cols-4 border-r border-gray-800 last:border-r-0"
                    >
                      {["Q1", "Q2", "Q3", "Q4"].map((q) => {
                        const hit = items.find((it) => it.q === q || it.q.includes(q));
                        return (
                          <div
                            key={q}
                            className="px-1 py-3 flex items-center justify-center border-r border-gray-800/50 last:border-r-0"
                          >
                            {hit ? (
                              <div
                                className="w-full rounded text-center px-1 py-1"
                                style={{ backgroundColor: pillar.color + "30", border: `1px solid ${pillar.color}44` }}
                                title={hit.title}
                              >
                                <p
                                  className="text-[10px] font-semibold leading-tight truncate"
                                  style={{ color: pillar.color }}
                                >
                                  {hit.title.length > 10
                                    ? hit.title.slice(0, 9) + "…"
                                    : hit.title}
                                </p>
                              </div>
                            ) : (
                              <div className="w-full h-2 rounded bg-gray-800/50" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
            {/* システム行 */}
            <div className="grid grid-cols-[140px_1fr_1fr_1fr]">
              <div className="px-4 py-3 border-r border-gray-800 flex items-center gap-2">
                <span className="text-base">⚙️</span>
                <span className="text-xs text-gray-300 font-semibold">System Dev</span>
              </div>
              {SYSTEM_ROADMAP.map((yr) => (
                <div
                  key={yr.year}
                  className="grid grid-cols-4 border-r border-gray-800 last:border-r-0"
                >
                  {["Q1", "Q2", "Q3", "Q4"].map((q) => {
                    const hit = yr.items.find((it) => it.q === q || it.q.includes(q));
                    return (
                      <div
                        key={q}
                        className="px-1 py-3 flex items-center justify-center border-r border-gray-800/50 last:border-r-0"
                      >
                        {hit ? (
                          <div
                            className="w-full rounded text-center px-1 py-1"
                            style={{ backgroundColor: yr.color + "25", border: `1px solid ${yr.color}35` }}
                            title={hit.title}
                          >
                            <p
                              className="text-[10px] font-semibold leading-tight truncate"
                              style={{ color: yr.color }}
                            >
                              {hit.title.length > 10
                                ? hit.title.slice(0, 9) + "…"
                                : hit.title}
                            </p>
                          </div>
                        ) : (
                          <div className="w-full h-2 rounded bg-gray-800/50" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* KPIサマリー */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Growth Milestones
            </span>
            <div className="h-px flex-1 bg-gray-800" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                year: "2026",
                color: "#6366f1",
                kpis: [
                  { label: "MRR", value: "¥3M" },
                  { label: "読者・購読者", value: "1,000人+" },
                  { label: "企業顧客", value: "5社" },
                  { label: "AI Agents", value: "24名" },
                  { label: "重点", value: "5事業整理完了" },
                ],
              },
              {
                year: "2027",
                color: "#0ea5e9",
                kpis: [
                  { label: "MRR", value: "¥3M" },
                  { label: "読者・購読者", value: "5,000人+" },
                  { label: "企業顧客", value: "20社" },
                  { label: "AI Agents", value: "30名" },
                  { label: "重点", value: "B2Bライン拡張" },
                ],
              },
              {
                year: "2028",
                color: "#06b6d4",
                kpis: [
                  { label: "MRR", value: "¥8M" },
                  { label: "読者・顧客基盤", value: "10,000人+" },
                  { label: "企業顧客", value: "50社" },
                  { label: "AI Agents", value: "36名" },
                  { label: "重点", value: "Platform化" },
                ],
              },
            ].map((target) => (
              <div
                key={target.year}
                className="rounded-xl border bg-gray-900/80 overflow-hidden"
                style={{ borderColor: target.color + "44" }}
              >
                <div
                  className="px-4 py-3"
                  style={{ backgroundColor: target.color + "18" }}
                >
                  <span
                    className="text-sm font-bold"
                    style={{ color: target.color }}
                  >
                    {target.year} 年末目標
                  </span>
                </div>
                <div className="px-4 py-3 space-y-2">
                  {target.kpis.map((kpi) => (
                    <div key={kpi.label} className="flex justify-between items-center">
                      <span className="text-gray-500 text-xs">{kpi.label}</span>
                      <span
                        className="text-sm font-bold font-mono"
                        style={{ color: target.color }}
                      >
                        {kpi.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* フッター */}
        <footer className="border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-700 text-xs">
            TechForward Inc. — 3-Year Roadmap 2026–2028 &nbsp;|&nbsp; Powered by 24 AI Agents / 5 Business Lines
          </p>
        </footer>
      </div>
    </div>
  );
}
