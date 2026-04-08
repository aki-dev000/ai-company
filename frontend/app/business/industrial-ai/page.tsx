import Link from "next/link";

const X_ARTICLE_POSTER_URL =
  process.env.NEXT_PUBLIC_X_ARTICLE_POSTER_URL || "https://x-article-poster.vercel.app";
const SIGNAL_ANALYSIS_AGENT_URL =
  process.env.NEXT_PUBLIC_SIGNAL_ANALYSIS_AGENT_URL || "https://tradingview-trader-agent.vercel.app";

// ===== ヘルパーコンポーネント =====

type SectionHeaderProps = {
  label: string;
  title: string;
  description?: string;
};

function SectionHeader({ label, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <p className="text-[10px] tracking-[0.3em] uppercase mb-1.5" style={{ color: "var(--accent-gold)", opacity: 0.6 }}>
        {label}
      </p>
      <h2 className="text-2xl font-medium" style={{ fontFamily: "var(--font-noto-serif), serif" }}>{title}</h2>
      {description && (
        <p className="text-sm mt-2 leading-relaxed" style={{ opacity: 0.5 }}>{description}</p>
      )}
    </div>
  );
}

// ===== データ定義 =====

const services = [
  {
    icon: "📰",
    badge: "FREE → PAID",
    title: "AI Weekly Report",
    description:
      "「今週のAIで何が起きたか」を毎週火曜に届ける。ChatGPT・Claude・Geminiの新機能から、スタートアップの新サービス、研究論文の重要発見まで、AIを追いかける人のための週次情報ライン。",
    bullets: [
      "主要AIサービスの新機能・アップデート情報",
      "AI研究論文のビジネス視点での解説",
      "注目のAIスタートアップ・プロダクト紹介",
      "「今週試すべきAIツール」週次ピックアップ",
    ],
    price: "Free（月2回）/ Pro ¥980/月（週次＋全アーカイブ）",
  },
  {
    icon: "𝕏",
    badge: "OWNED MEDIA",
    title: "X Article Poster",
    description:
      "NeiroのAI技術リサーチ結果を、X向けの実務的なスレッドに変換する発信プロダクト。テーマ選定、最新情報の調査、訴求軸の整理、投稿文生成までをAIエージェントが一気通貫で行う。",
    bullets: [
      "最新AIトピックの選定と直近情報の収集",
      "調査結果をXスレッド向けに再構成",
      "280文字制限を踏まえた投稿文ドラフト生成",
      "X API連携による自動投稿運用に対応",
    ],
    price: "Neiro発信チャネル / 運用自動化基盤",
    cta: "X Article Posterを開く →",
    href: X_ARTICLE_POSTER_URL,
    external: true,
  },
  {
    icon: "⭐",
    badge: "FREE",
    title: "AIサービスレビュー・比較",
    description:
      "「結局どのAIを使えばいいの？」に答える。Neiroのエージェントが実際に使って評価した、AIサービスのレビュー・比較・活用ガイドを無料公開。",
    bullets: [
      "ChatGPT / Claude / Gemini / Perplexity 徹底比較",
      "用途別おすすめAIツールガイド（文章・画像・コード・分析）",
      "AIを使いはじめる人向けの入門ガイド",
      "企業別のAI活用事例・費用対効果レポート",
    ],
    price: "無料公開（広告・スポンサードなし）",
  },
  {
    icon: "🔍",
    badge: "ON-DEMAND",
    title: "カスタムAIリサーチ",
    description:
      "「自社の業務に使えるAIを探してほしい」「競合のAI活用状況を調べてほしい」——具体的なテーマを指定すると、AIエージェントが数日以内に専用調査レポートを生成する。",
    bullets: [
      "業務特化AIツールの選定・比較調査",
      "競合他社のAI投資・活用動向調査",
      "特定領域のAI市場規模・参入障壁分析",
      "社内AI活用のROI試算・導入ロードマップ作成",
    ],
    price: "¥30,000〜/件（要件ヒアリング後見積）",
    cta: "リサーチを依頼する →",
    href: "/business/industrial-ai/inquiry",
  },
  {
    icon: "💡",
    badge: "B2B",
    title: "AI活用コンサル",
    description:
      "「AIを導入したいが何から始めればいいか分からない」企業向けに、NeiroのAIエージェントが組織のAI活用戦略を設計する。",
    bullets: [
      "業務フローのAI化可能性診断",
      "AIツール選定から導入・定着までの支援",
      "社内AI活用ガイドライン・研修コンテンツ作成",
    ],
    price: "¥100,000〜/月（リテイナー）",
  },
];

const flowSteps = [
  {
    step: "01",
    title: "まず無料レポートを読む",
    desc: "毎週火曜配信のAI Weeklyで最新動向をキャッチ。何が起きているかを把握する",
  },
  {
    step: "02",
    title: "気になるサービスをレビューで確認",
    desc: "「使ってみたい」AIツールのレビュー・比較ページで詳細を確認する",
  },
  {
    step: "03",
    title: "シグナルを検知する",
    desc: "市場・競合・AIアップデートのシグナルを Signal Analysis Agent で整理し、発信優先度をつける",
  },
  {
    step: "04",
    title: "発信か深掘りへつなげる",
    desc: "優先度の高い内容は X Article Poster で外部発信し、さらに深く知りたければカスタムリサーチへ進む",
  },
];

const roadmapItems = [
  { period: "Q2 2026", title: "AI Weekly β版・読者500人目標", active: true },
  { period: "Q3 2026", title: "AIサービスレビューDB公開・X Article Poster連携開始", active: false },
  { period: "Q4 2026", title: "Signal Analysis Agent 統合・検知から発信まで自動化", active: false },
  { period: "Q4 2026", title: "Pro購読500件・コンサル月3社体制", active: false },
  { period: "Q1 2027", title: "Pro購読1,000件・MRR ¥1M", active: false },
];

// ===== メインページ =====

export default function AIResearchPage() {
  return (
    <div className="min-h-full">

      {/* ===== Hero ===== */}
      <section
        aria-label="ヒーロー"
        className="border-b border-[var(--border-warm)] px-6 py-16"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-14 h-14 rounded-sm flex items-center justify-center text-3xl"
              style={{ backgroundColor: "var(--border-warm)" }}
            >
              📡
            </div>
            <span
              className="inline-block text-[10px] tracking-[0.3em] uppercase px-3 py-1 rounded-sm"
              style={{ color: "var(--accent-gold)", opacity: 0.6 }}
            >
              ① Strategic Pillar
            </span>
          </div>
          <h1 className="text-4xl font-medium mb-3 leading-tight" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
            AI Research & Media
          </h1>
          <p className="text-lg leading-relaxed mb-6 max-w-2xl" style={{ opacity: 0.5 }}>
            AIの最新技術・サービス・活用事例を毎週自動リサーチし、<br />
            「何を使えばいいか」「AIで何が変わるのか」に答え続ける。
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Link
              href="/business/industrial-ai/inquiry"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm font-medium text-sm transition-colors"
              style={{ backgroundColor: "var(--accent-gold)", color: "var(--background)" }}
            >
              カスタムリサーチを依頼
            </Link>
            <a
              href={X_ARTICLE_POSTER_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm font-medium text-sm border transition-colors hover:opacity-80"
              style={{ borderColor: "var(--border-warm)" }}
            >
              𝕏 X Article Poster
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
            {[
              { label: "リサーチ頻度", value: "毎週火曜 自動生成" },
              { label: "カバー領域", value: "AI全般・国内外" },
              { label: "開始", value: "2026 Q2 β版" },
            ].map((m) => (
              <div
                key={m.label}
                className="border border-[var(--border-warm)] rounded-sm px-4 py-3"
              >
                <p className="text-xs mb-1" style={{ opacity: 0.4 }}>{m.label}</p>
                <p className="text-sm font-medium">{m.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">

        {/* ===== 事業概要 ===== */}
        <section aria-label="事業概要">
          <SectionHeader label="OVERVIEW" title="事業概要" />
          <div className="border border-[var(--border-warm)] rounded-sm p-6">
            <p className="text-base leading-relaxed" style={{ opacity: 0.5 }}>
              AIは毎日進化している。ChatGPTのアップデート、新しいモデルのリリース、スタートアップの新サービス。情報の洪水の中で「自分に関係あること」だけを追うのは難しい。NeiroはAIエージェントを使って最新情報を毎週自動収集・整理し、「今週のAIで知っておくべきこと」をわかりやすく届ける。さらに、調査結果のうち拡散力が高いテーマはX Article Posterでスレッド化し、リサーチから発信までを一つの事業ラインとして接続する。レポートを読むだけで最前線が分かり、使いたいサービスのレビューが見つかり、必要ならそのままX発信や個別調査にもつなげられる。NeiroはAIの情報インフラを作る。
            </p>
          </div>
        </section>

        <section aria-label="シグナル分析基盤">
          <SectionHeader
            label="SIGNAL LAYER"
            title="Signal Analysis Agent"
            description="Webhook や市場シグナルを整理し、Neiro の発信候補へ変換する前段レイヤー"
          />
          <div className="border border-[var(--border-warm)] rounded-sm p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
              <div className="max-w-3xl">
                <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ opacity: 0.4 }}>
                  DETECT TO DISTRIBUTE
                </p>
                <h3 className="text-xl font-medium mb-3" style={{ fontFamily: "var(--font-noto-serif), serif" }}>シグナルを検知し、そのまま発信の起点にする</h3>
                <p className="text-sm leading-relaxed" style={{ opacity: 0.5 }}>
                  `Signal Analysis Agent` は TradingView のテクニカルシグナルを起点にしつつ、将来的には AI市場のアップデートや競合動向も同じ形式で扱う前段基盤です。単なる分析ダッシュボードではなく、Neiro の配信価値、想定読者、X向けフックまで整理し、X Article Poster へ受け渡すことを前提に設計します。
                </p>
              </div>
              <a
                href={SIGNAL_ANALYSIS_AGENT_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-sm font-medium text-sm border transition-colors hover:opacity-80"
                style={{ borderColor: "var(--border-warm)", color: "var(--accent-indigo)" }}
              >
                Signal Analysis Agent を開く →
              </a>
            </div>
          </div>
        </section>

        <section aria-label="関連プロダクト">
          <SectionHeader
            label="PRODUCT LINK"
            title="X Article Poster"
            description="NeiroのAI技術リサーチ・情報発信事業に属する、X向け発信プロダクト"
          />
          <div className="border border-[var(--border-warm)] rounded-sm p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
              <div className="max-w-3xl">
                <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ opacity: 0.4 }}>
                  RESEARCH TO DISTRIBUTION
                </p>
                <h3 className="text-xl font-medium mb-3" style={{ fontFamily: "var(--font-noto-serif), serif" }}>調査済みのAIトピックを、そのままX発信に変える</h3>
                <p className="text-sm leading-relaxed" style={{ opacity: 0.5 }}>
                  `x-article-poster` はNeiroの研究成果を外部に届けるための配信レイヤーです。AIエージェントがテーマを選び、最新情報を調べ、Xスレッドに最適化し、必要なら自動投稿まで行います。AI Weeklyや各種レビューと並ぶ、AI技術リサーチ・情報発信事業の実行装置として位置づけます。
                </p>
              </div>
              <a
                href={X_ARTICLE_POSTER_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-sm font-medium text-sm transition-colors"
                style={{ backgroundColor: "var(--accent-gold)", color: "var(--background)" }}
              >
                プロダクトを開く →
              </a>
            </div>
          </div>
        </section>

        {/* ===== 利用フロー ===== */}
        <section aria-label="利用フロー">
          <SectionHeader
            label="HOW IT WORKS"
            title="4ステップで深まる"
            description="無料コンテンツからX発信、深掘り依頼まで、必要に応じてシームレスに使い分ける"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {flowSteps.map((s) => (
              <div key={s.step} className="border border-[var(--border-warm)] rounded-sm p-5">
                <p className="text-5xl font-medium mb-3 opacity-15" style={{ color: "var(--accent-gold)" }}>{s.step}</p>
                <p className="font-medium text-base mb-2">{s.title}</p>
                <p className="text-sm leading-relaxed" style={{ opacity: 0.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== サービス ===== */}
        <section aria-label="サービス">
          <SectionHeader
            label="SERVICES"
            title="4つのサービス"
            description="無料情報から有料リサーチまで、AIを知りたい・使いたいすべての人のために"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((s) => (
              <div
                key={s.title}
                className="border border-[var(--border-warm)] rounded-sm p-5 flex flex-col"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-sm flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: "var(--border-warm)" }}
                  >
                    {s.icon}
                  </div>
                  <span
                    className="text-[10px] tracking-[0.3em] uppercase font-medium px-2 py-0.5 rounded-sm"
                    style={{ color: "var(--accent-gold)", opacity: 0.6 }}
                  >
                    {s.badge}
                  </span>
                </div>
                <p className="font-medium text-base mb-1">{s.title}</p>
                <p className="text-sm mb-3 leading-relaxed" style={{ opacity: 0.5 }}>{s.description}</p>
                <ul className="space-y-1 mb-4 flex-1">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm" style={{ opacity: 0.5 }}>
                      <span style={{ color: "var(--accent-gold)" }} className="mt-0.5 flex-shrink-0">▸</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-3 border-t" style={{ borderColor: "var(--border-warm)" }}>
                  <p className="text-xs font-medium mb-2" style={{ color: "var(--accent-gold)" }}>{s.price}</p>
                  {"href" in s && s.href && (
                    s.external ? (
                      <a
                        href={s.href as string}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-80"
                        style={{ opacity: 0.5 }}
                      >
                        {s.cta ?? "詳細を見る →"}
                      </a>
                    ) : (
                      <Link
                        href={s.href as string}
                        className="inline-flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-80"
                        style={{ opacity: 0.5 }}
                      >
                        {s.cta ?? "詳細を見る →"}
                      </Link>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== ターゲット ===== */}
        <section aria-label="ターゲット">
          <SectionHeader label="TARGET" title="こんな方に" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-[var(--border-warm)] rounded-sm p-5">
              <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: "var(--accent-gold)", opacity: 0.6 }}>Individual</p>
              <p className="font-medium text-base mb-1">AIに関心はあるが、情報が多すぎて追えていない人</p>
              <p className="text-sm" style={{ opacity: 0.5 }}>エンジニア・ビジネスパーソン・研究者・学生。「AIを使いたいが何から始めればいいかわからない」という層に特に刺さる。</p>
            </div>
            <div className="border border-[var(--border-warm)] rounded-sm p-5">
              <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ opacity: 0.4 }}>Business</p>
              <p className="font-medium text-base mb-1">AI活用を検討・推進している企業の担当者</p>
              <p className="text-sm" style={{ opacity: 0.5 }}>「社内でAIを使いたいが何を選べばいいか」「競合がどこまでAIを使っているか知りたい」という経営者・DX推進担当。</p>
            </div>
          </div>
        </section>

        {/* ===== 収益モデル ===== */}
        <section aria-label="収益モデル">
          <SectionHeader label="REVENUE" title="収益モデル" />
          <div className="border border-[var(--border-warm)] rounded-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-warm)]">
                  <th className="px-5 py-3 text-left text-[10px] tracking-[0.3em] uppercase" style={{ opacity: 0.4 }}>サービス</th>
                  <th className="px-5 py-3 text-left text-[10px] tracking-[0.3em] uppercase" style={{ opacity: 0.4 }}>単価</th>
                  <th className="px-5 py-3 text-left text-[10px] tracking-[0.3em] uppercase" style={{ opacity: 0.4 }}>粗利率</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { service: "AI Weekly Pro購読", price: "¥980/月", margin: "92%" },
                  { service: "カスタムAIリサーチ", price: "¥30,000〜/件", margin: "75%" },
                  { service: "AI活用コンサル", price: "¥100,000〜/月", margin: "65%" },
                ].map((row, i, arr) => (
                  <tr key={row.service} className={i < arr.length - 1 ? "border-b border-[var(--border-warm)]" : ""}>
                    <td className="px-5 py-3 font-medium">{row.service}</td>
                    <td className="px-5 py-3" style={{ opacity: 0.5 }}>{row.price}</td>
                    <td className="px-5 py-3 font-medium" style={{ color: "var(--accent-gold)" }}>{row.margin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ===== ロードマップ ===== */}
        <section aria-label="ロードマップ">
          <SectionHeader label="ROADMAP" title="ロードマップ" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {roadmapItems.map((r) => (
              <div
                key={r.period}
                className="border rounded-sm p-4"
                style={{
                  borderColor: r.active ? "var(--accent-gold)" : "var(--border-warm)",
                  opacity: r.active ? 1 : 0.7,
                }}
              >
                <p
                  className="text-xs font-medium mb-1"
                  style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    color: r.active ? "var(--accent-gold)" : undefined,
                    opacity: r.active ? 1 : 0.4,
                  }}
                >
                  {r.period}
                </p>
                <p className={`text-sm leading-snug ${r.active ? "font-medium" : ""}`} style={{ opacity: r.active ? 1 : 0.5 }}>
                  {r.title}
                </p>
                {r.active && (
                  <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-sm border font-medium" style={{ borderColor: "var(--accent-gold)", color: "var(--accent-gold)", opacity: 0.6 }}>
                    現在地
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section aria-label="CTA">
          <div className="border border-[var(--border-warm)] rounded-sm p-8 text-center">
            <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: "var(--accent-gold)", opacity: 0.6 }}>START HERE</p>
            <h3 className="text-xl font-medium mb-2" style={{ fontFamily: "var(--font-noto-serif), serif" }}>AIの疑問をリサーチで解決する</h3>
            <p className="text-sm mb-6 max-w-md mx-auto" style={{ opacity: 0.5 }}>
              「自社に使えるAIは？」「競合のAI活用状況は？」<br />
              具体的なテーマを指定すると、AIエージェントが専用レポートを生成します。
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/business/industrial-ai/inquiry"
                className="px-6 py-2.5 rounded-sm font-medium text-sm transition-colors"
                style={{ backgroundColor: "var(--accent-gold)", color: "var(--background)" }}
              >
                カスタムリサーチを依頼
              </Link>
            </div>
          </div>
        </section>

        {/* ===== 戻るリンク ===== */}
        <div className="border-t border-[var(--border-warm)] pt-6">
          <Link href="/about" className="text-sm transition-colors hover:opacity-80" style={{ opacity: 0.5 }}>
            ← 企業概要に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
