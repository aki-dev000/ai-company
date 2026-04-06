import Link from "next/link";

const businesses = [
  {
    number: "01",
    tag: "AI Research & Media",
    icon: "📡",
    color: "#2563eb",
    title: "AI技術リサーチ・情報発信",
    tagline: "「何を使えばいいか」「AIで何が変わるのか」——その問いに、週次リサーチで答え続ける。",
    description:
      "AIの最新技術・サービスをリサーチし、Xで認知を獲得→noteで有料記事として収益化する自動循環型メディア事業。「リサーチ→X発信→note誘導→収益化→分析→次回テーマ」のサイクルをClaude Codeで仕組み化。",
    services: [
      { label: "Research Agent", desc: "週次AIリサーチの自動生成（情報収集）", badge: "RESEARCH" },
      { label: "Signal Analysis Agent", desc: "シグナル検知→発信候補化", badge: "SIGNAL" },
      { label: "X Article Poster", desc: "調査結果をXスレッドで配信（認知獲得）", badge: "X" },
      { label: "Note Article Studio", desc: "有料記事を生成・公開（収益化）", badge: "NOTE" },
      { label: "AI Weekly Report", desc: "週次トレンドレポート（Free/Pro）", badge: "FREE→PAID" },
      { label: "AIサービスレビュー・比較", desc: "ツール選定ガイド", badge: "FREE" },
      { label: "反応データ分析", desc: "X・note反応→次週テーマ自動選定（循環）", badge: "ANALYTICS" },
      { label: "note→電子書籍化", desc: "人気記事をKindleで長期収益化", badge: "EBOOK" },
    ],
    metrics: [
      { label: "リサーチ頻度", value: "毎週火曜 自動生成" },
      { label: "対象領域", value: "AI全般・国内外" },
      { label: "発信チャネル", value: "レポート + Note + X + 動画下書き" },
      { label: "開始", value: "2026 Q2 β版" },
    ],
    href: "/business/industrial-ai",
    reportsHref: "/business/industrial-ai/reports",
    inquiryHref: "/business/industrial-ai/inquiry",
  },
  {
    number: "02",
    tag: "Bio-Digital Research",
    icon: "🧠",
    color: "#7c3aed",
    title: "人間知性×AI研究",
    tagline: "人間の知性の解明は、AI開発の最前線でもある。記憶・意識・感情の科学をAIに接続する。",
    description:
      "認知科学・神経科学の最新研究を週次でキュレーション・記事化。意識インターフェース設計コンサル、Human Intelligence API（研究開発中）まで、人間知性×AIの探究を事業化する長期R&D事業。",
    services: [
      { label: "Bio-Digital Research Report", desc: "週次PDF配信", badge: "FREE→PAID" },
      { label: "意識インターフェース設計", desc: "AIプロダクトUXコンサル", badge: "CONSULT" },
      { label: "Human Intelligence API", desc: "研究開発中", badge: "R&D" },
      { label: "Dream AI Project", desc: "学術機関との共同研究", badge: "RESEARCH" },
    ],
    metrics: [
      { label: "リサーチ頻度", value: "毎週月曜 自動生成" },
      { label: "対象領域", value: "認知科学・神経科学" },
      { label: "開始", value: "2026 Q3 開始" },
    ],
    href: "/business/bio-digital",
    reportsHref: "/business/bio-digital/reports",
    inquiryHref: null,
  },
  {
    number: "03",
    tag: "E-Book Publishing",
    icon: "📚",
    color: "#059669",
    title: "電子書籍出版",
    tagline: "テーマを入力するだけ。AIがリサーチ・執筆・EPUB化を自動化し、Kindle出版を加速する。",
    description:
      "指定テーマに関する最新研究をウェブリサーチ・分析し、カバー画像付きのAmazon Kindle対応EPUB電子書籍を自動生成・保存。arXiv・PubMed・業界レポートを横断的に調査し、10,000〜15,000字のプロ品質な書籍原稿を出力する出版支援事業。",
    services: [
      { label: "AIリサーチ電子書籍", desc: "テーマ→EPUB自動生成", badge: "CORE" },
      { label: "カバー画像自動生成", desc: "Kindle標準サイズ対応", badge: "FEATURE" },
      { label: "EPUB3出力", desc: "KDP直接アップロード可", badge: "OUTPUT" },
      { label: "最新研究ベース", desc: "arXiv・PubMed等一次情報", badge: "RESEARCH" },
    ],
    metrics: [
      { label: "生成時間", value: "約5〜10分" },
      { label: "出力形式", value: "EPUB3（Kindle対応）" },
      { label: "文字数", value: "10,000〜15,000字" },
    ],
    href: "/business/ebook",
    reportsHref: "/business/ebook/generate",
    inquiryHref: null,
  },
  {
    number: "04",
    tag: "AI Sticker Studio",
    icon: "💬",
    color: "#ec4899",
    title: "LINEスタンプ自動生成",
    tagline: "テーマから会話用スタンプセットまで。AIが企画し、書き出し、提出直前の形まで整える。",
    description:
      "LINE Creators Market 向けの通常スタンプをテーマベースで自動生成するアセット事業。会話で使いやすい文言設計、プレビュー生成、ZIP書き出しまでを一貫して行い、TechForward の定期生成ラインにも接続できる構成で運営する。",
    services: [
      { label: "Theme to Sticker Set", desc: "テーマ→8枚セットを自動設計", badge: "CORE" },
      { label: "LINE Export Pack", desc: "ZIP / preview / metadata 出力", badge: "OUTPUT" },
      { label: "Compliance Review", desc: "審査リスクを事前チェック", badge: "REVIEW" },
      { label: "Weekly Asset Pipeline", desc: "週次の新テーマ自動生成", badge: "AUTO" },
    ],
    metrics: [
      { label: "初期出力", value: "通常スタンプ 8枚" },
      { label: "納品形式", value: "PNG + ZIP + metadata" },
      { label: "想定時間", value: "約10〜30秒" },
      { label: "開始", value: "2026 Q2 実装開始" },
    ],
    href: "/business/line-sticker",
    reportsHref: "/business/line-sticker/generate",
    inquiryHref: null,
  },
  {
    number: "05",
    tag: "AI Media Operations",
    icon: "🎬",
    color: "#ea580c",
    title: "AIメディア自動運営",
    tagline: "記事・短尺動画・派生チャンネルを、AIが企画から配信まで継続運営する。",
    description:
      "収益ブログ、AIニュース動画、派生Shortsチャンネルを統合運営。全メディアからnote有料記事への誘導導線を設計し、認知→収益化の面を広げるメディア事業。コンテンツ制作を単発で終わらせず、noteへの流入源として継続最適化する。",
    services: [
      { label: "AI記事自動生成", desc: "毎朝6時 Claude Haiku", badge: "AUTO" },
      { label: "収益ブログ運営", desc: "SEO記事→note有料記事への誘導CTA", badge: "BLOG→NOTE" },
      { label: "AIニュース動画", desc: "TikTok向け短尺動画→noteリンクCTA", badge: "VIDEO→NOTE" },
      { label: "YouTube Shorts派生", desc: "宇宙×哲学系→note・ブログへクロス誘導", badge: "SHORTS" },
      { label: "SEO最適化", desc: "メタデータ・JSON-LD自動付与", badge: "SEO" },
      { label: "自動デプロイ / 自動投稿", desc: "GitHub・Vercel・SNS API連携", badge: "OPS" },
      { label: "チャネル別流入分析", desc: "どのメディアがnote収益に貢献しているかを可視化", badge: "ANALYTICS" },
    ],
    metrics: [
      { label: "更新頻度", value: "ブログ毎日 / 動画毎日" },
      { label: "配信面", value: "Web + TikTok + Shorts" },
      { label: "技術スタック", value: "Next.js + FastAPI + Remotion" },
      { label: "開始", value: "2026 Q2 統合運営" },
    ],
    href: "/business/media-ops",
    reportsHref: null,
    inquiryHref: null,
  },
  {
    number: "06",
    tag: "Knowledge Infrastructure",
    icon: "🗂️",
    color: "#14b8a6",
    title: "ナレッジ基盤・プライベートAI",
    tagline: "PDF、Markdown、URL、ローカルLLMをつなぎ、TechForwardの知識を再利用可能な資産に変える。",
    description:
      "社内外のドキュメント、Webページ、PDF、ローカルノートを収集・要約・検索し、TechForwardの全事業で再利用できる知識基盤を構築する。my-brain-connector を入口に、Gemma 4 / Ollama を使ったプライベートAI実験環境まで含め、非公開情報を扱える内部知識OSとして展開する。",
    services: [
      { label: "my-brain-connector", desc: "PDF / Markdown / URLの知識集約", badge: "CORE" },
      { label: "AI要約・URL解析", desc: "手元資料を即時に再利用可能化", badge: "FEATURE" },
      { label: "ローカルLLM基盤", desc: "Gemma + Ollama による私有環境", badge: "PRIVATE" },
      { label: "社内Knowledge OS", desc: "調査・執筆・提案の前段資産", badge: "INTERNAL" },
    ],
    metrics: [
      { label: "対象データ", value: "Markdown / PDF / URL" },
      { label: "利用形態", value: "社内基盤 + 将来外販候補" },
      { label: "強み", value: "非公開文書にも適用可能" },
      { label: "開始", value: "2026 Q2 内部実装済み" },
    ],
    href: "/business/knowledge-infra",
    reportsHref: null,
    inquiryHref: null,
  },
];

export default function BusinessPage() {
  return (
    <div className="min-h-full bg-gray-950 text-gray-100">

      {/* Hero */}
      <section className="border-b border-gray-800 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 px-6 py-14">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-2">BUSINESSES</p>
          <h1 className="text-4xl font-bold text-white mb-3">6つの事業</h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            「AIを探究し、その知識を社会全体の力に変える」——<br />
            AI技術リサーチ・情報発信、人間知性×AI研究、電子書籍出版、LINEスタンプ自動生成、AIメディア自動運営、ナレッジ基盤・プライベートAIの6本柱で展開する。
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            {businesses.map((b) => (
              <a
                key={b.number}
                href={`#business-${b.number}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors"
                style={{ borderColor: b.color + "44", color: b.color, backgroundColor: b.color + "11" }}
              >
                {b.icon} {b.tag}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 事業カード */}
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {businesses.map((b) => (
          <section
            key={b.number}
            id={`business-${b.number}`}
            className="border rounded-2xl overflow-hidden bg-gray-900"
            style={{ borderColor: b.color + "33" }}
          >
            {/* カードヘッダー */}
            <div
              className="px-6 py-5 border-b"
              style={{ borderColor: b.color + "22", background: b.color + "0d" }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ backgroundColor: b.color + "22", border: `1px solid ${b.color}44` }}
                >
                  {b.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span
                      className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                      style={{ backgroundColor: b.color + "22", color: b.color }}
                    >
                      {b.number} — {b.tag}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{b.title}</h2>
                  <p className="text-sm mt-1 leading-relaxed" style={{ color: b.color + "cc" }}>
                    {b.tagline}
                  </p>
                </div>
              </div>
            </div>

            {/* カードボディ */}
            <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 左：説明 + サービス */}
              <div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">{b.description}</p>
                <div className="space-y-2">
                  {b.services.map((s) => (
                    <div key={s.label} className="flex items-center gap-3">
                      <span
                        className="text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                        style={{ backgroundColor: b.color + "22", color: b.color }}
                      >
                        {s.badge}
                      </span>
                      <span className="text-white text-sm font-medium">{s.label}</span>
                      <span className="text-gray-500 text-xs ml-auto">{s.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 右：メトリクス + CTA */}
              <div className="flex flex-col justify-between">
                <div className="grid grid-cols-1 gap-2 mb-5">
                  {b.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="border rounded-lg px-4 py-2.5 flex items-center justify-between"
                      style={{ borderColor: b.color + "22" }}
                    >
                      <p className="text-xs text-gray-500">{m.label}</p>
                      <p className="text-white text-sm font-semibold">{m.value}</p>
                    </div>
                  ))}
                </div>

                {/* CTAボタン群 */}
                <div className="flex flex-col gap-2">
                  <Link
                    href={b.href}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm text-white transition-colors"
                    style={{ backgroundColor: b.color }}
                  >
                    事業詳細を見る →
                  </Link>
                  {b.reportsHref && (
                    <Link
                      href={b.reportsHref}
                      className="flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-xs border transition-colors hover:bg-white/5"
                      style={{ borderColor: b.color + "44", color: b.color }}
                    >
                      📄 最新レポートを読む
                    </Link>
                  )}
                  {b.inquiryHref && (
                    <Link
                      href={b.inquiryHref}
                      className="flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-xs border transition-colors hover:bg-white/5"
                      style={{ borderColor: b.color + "44", color: b.color }}
                    >
                      🔍 分析を依頼する
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* 戻るリンク */}
        <div className="border-t border-gray-800 pt-6">
          <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← 企業概要に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
