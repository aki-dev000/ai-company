import Link from "next/link";

const businesses = [
  {
    number: "01",
    tag: "AI Research & Media",
    icon: "📡",
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
    inquiryHref: "/business/industrial-ai/inquiry",
  },
  {
    number: "02",
    tag: "Performance Science",
    icon: "🧠",
    title: "働く脳のパフォーマンス研究",
    tagline: "睡眠・集中・ストレスの科学を、働き方改善と高単価相談に接続する。",
    description:
      "睡眠・集中・ストレスの最新研究を週次でキュレーションし、働く人向けの実践レポートとして配信。無料公開から note、有料購読、個別相談へ接続する収益導線を持つ研究メディア事業。",
    services: [
      { label: "働く脳のパフォーマンスレポート", desc: "週次PDF + note導線", badge: "FREE→PAID" },
      { label: "意識インターフェース設計", desc: "AIプロダクトUXコンサル", badge: "CONSULT" },
      { label: "Human Intelligence API", desc: "研究開発中", badge: "R&D" },
      { label: "Dream AI Project", desc: "学術機関との共同研究", badge: "RESEARCH" },
    ],
    metrics: [
      { label: "リサーチ頻度", value: "毎週月曜 自動生成" },
      { label: "対象領域", value: "睡眠・集中・ストレス" },
      { label: "開始", value: "2026 Q3 開始" },
    ],
    href: "/business/bio-digital",
    reportsHref: "/business/bio-digital/reports",
    inquiryHref: "/business/bio-digital/inquiry",
  },
  {
    number: "03",
    tag: "E-Book Publishing",
    icon: "📚",
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
    tag: "MA° Design & Goods",
    icon: "🎨",
    title: "MA°ブランド・デザインアセット事業",
    tagline: "軌道と余白でつくる、静かな熱のミニマルブランド。SUZURIグッズとLINEスタンプを展開。",
    description:
      "ミニマルブランド MA° のグラフィック（Orbit Mark / Typographic Stack / Orbit Field）をSUZURIでグッズ化し、LINEスタンプもMA°の世界観に統一して自動生成。AIでデザインバリエーションを量産し、X→SUZURIの誘導で認知→購入の循環を作る。",
    services: [
      { label: "SUZURI Goods", desc: "Tシャツ・ステッカー・スマホケース・ノート等", badge: "GOODS" },
      { label: "MA° LINE Sticker", desc: "MA°テイストのミニマルLINEスタンプ自動生成", badge: "STICKER" },
      { label: "Design Variation", desc: "AIでOrbit系デザインのバリエーション量産", badge: "AI" },
      { label: "X→SUZURI Funnel", desc: "Xでブランド露出→ショップへ誘導", badge: "MARKETING" },
      { label: "Compliance Review", desc: "審査リスクを事前チェック", badge: "REVIEW" },
    ],
    metrics: [
      { label: "ブランド", value: "MA° (minimal orbit)" },
      { label: "販売先", value: "SUZURI + LINE Creators Market" },
      { label: "デザイン", value: "3種（Orbit Mark / Type / Field）" },
      { label: "開始", value: "2026 Q2 販売開始" },
    ],
    href: "/business/line-sticker",
    reportsHref: "/business/line-sticker/generate",
    inquiryHref: null,
  },
  {
    number: "05",
    tag: "AI Media Operations",
    icon: "🎬",
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
    title: "ナレッジ基盤・プライベートAI",
    tagline: "PDF、Markdown、URL、ローカルLLMをつなぎ、Neiroの知識を再利用可能な資産に変える。",
    description:
      "社内外のドキュメント、Webページ、PDF、ローカルノートを収集・要約・検索し、Neiroの全事業で再利用できる知識基盤を構築する。my-brain-connector を入口に、Gemma 4 / Ollama を使ったプライベートAI実験環境まで含め、非公開情報を扱える内部知識OSとして展開する。",
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
    <div className="min-h-full">

      {/* Hero */}
      <section className="border-b border-[var(--border-warm)] px-6 py-14">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: "var(--accent-gold)", opacity: 0.6 }}>BUSINESSES</p>
          <h1 className="text-4xl font-medium mb-3" style={{ fontFamily: "var(--font-noto-serif), serif" }}>6つの事業</h1>
          <p className="text-lg max-w-2xl leading-relaxed" style={{ opacity: 0.5 }}>
            「AIを探究し、その知識を社会全体の力に変える」——<br />
            AI技術リサーチ・情報発信、人間知性×AI研究、電子書籍出版、LINEスタンプ自動生成、AIメディア自動運営、ナレッジ基盤・プライベートAIの6本柱で展開する。
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            {businesses.map((b) => (
              <a
                key={b.number}
                href={`#business-${b.number}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border text-xs font-medium transition-colors"
                style={{ borderColor: "var(--border-warm)", color: "var(--accent-gold)" }}
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
            className="border rounded-sm overflow-hidden"
            style={{ borderColor: "var(--border-warm)" }}
          >
            {/* カードヘッダー */}
            <div
              className="px-6 py-5 border-b"
              style={{ borderColor: "var(--border-warm)" }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-sm flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ backgroundColor: "var(--border-warm)" }}
                >
                  {b.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span
                      className="text-[10px] tracking-[0.3em] uppercase px-2 py-0.5 rounded-sm"
                      style={{ color: "var(--accent-gold)", opacity: 0.6 }}
                    >
                      {b.number} — {b.tag}
                    </span>
                  </div>
                  <h2 className="text-xl font-medium" style={{ fontFamily: "var(--font-noto-serif), serif" }}>{b.title}</h2>
                  <p className="text-sm mt-1 leading-relaxed" style={{ color: "var(--accent-gold)" }}>
                    {b.tagline}
                  </p>
                </div>
              </div>
            </div>

            {/* カードボディ */}
            <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 左：説明 + サービス */}
              <div>
                <p className="text-sm leading-relaxed mb-4" style={{ opacity: 0.5 }}>{b.description}</p>
                <div className="space-y-2">
                  {b.services.map((s) => (
                    <div key={s.label} className="flex items-center gap-3">
                      <span
                        className="text-xs font-medium px-1.5 py-0.5 rounded-sm flex-shrink-0"
                        style={{ color: "var(--accent-gold)", opacity: 0.6 }}
                      >
                        {s.badge}
                      </span>
                      <span className="text-sm font-medium">{s.label}</span>
                      <span className="text-xs ml-auto" style={{ opacity: 0.4 }}>{s.desc}</span>
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
                      className="border rounded-sm px-4 py-2.5 flex items-center justify-between"
                      style={{ borderColor: "var(--border-warm)" }}
                    >
                      <p className="text-xs" style={{ opacity: 0.4 }}>{m.label}</p>
                      <p className="text-sm font-medium">{m.value}</p>
                    </div>
                  ))}
                </div>

                {/* CTAボタン群 */}
                <div className="flex flex-col gap-2">
                  <Link
                    href={b.href}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-sm font-medium text-sm transition-colors"
                    style={{ backgroundColor: "var(--accent-gold)", color: "var(--background)" }}
                  >
                    事業詳細を見る →
                  </Link>
                  {b.reportsHref && (
                    <Link
                      href={b.reportsHref}
                      className="flex items-center justify-center gap-2 py-2 rounded-sm font-medium text-xs border transition-colors hover:opacity-80"
                      style={{ borderColor: "var(--border-warm)", color: "var(--accent-gold)" }}
                    >
                      最新レポートを読む
                    </Link>
                  )}
                  {b.inquiryHref && (
                    <Link
                      href={b.inquiryHref}
                      className="flex items-center justify-center gap-2 py-2 rounded-sm font-medium text-xs border transition-colors hover:opacity-80"
                      style={{ borderColor: "var(--border-warm)", color: "var(--accent-indigo)" }}
                    >
                      分析を依頼する
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* 戻るリンク */}
        <div className="border-t border-[var(--border-warm)] pt-6">
          <Link href="/about" className="text-sm transition-colors hover:opacity-80" style={{ opacity: 0.5 }}>
            ← 企業概要に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
