import React from "react";
import Link from "next/link";

// ===== ヘルパーコンポーネント =====

type SectionHeaderProps = {
  label: string;
  title: string;
  description?: string;
};

function SectionHeader({ label, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-1.5">
        {label}
      </p>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      {description && (
        <p className="text-gray-400 text-sm mt-2 leading-relaxed">{description}</p>
      )}
    </div>
  );
}

type CardProps = {
  children: React.ReactNode;
  accent?: string;
  className?: string;
};

function Card({ children, accent, className = "" }: CardProps) {
  return (
    <div
      className={`border rounded-xl p-5 bg-gray-900/80 backdrop-blur-sm ${className}`}
      style={accent ? { borderColor: accent + "44" } : { borderColor: "#374151" }}
    >
      {children}
    </div>
  );
}

type CardTagProps = {
  children: React.ReactNode;
  color: string;
};

function CardTag({ children, color }: CardTagProps) {
  return (
    <span
      className="inline-block text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
      style={{ backgroundColor: color + "22", color }}
    >
      {children}
    </span>
  );
}

// ===== データ定義 =====

const pillars = [
  {
    tag: "① AI Research & Media",
    tagColor: "#2563eb",
    icon: "📡",
    iconBg: "#2563eb",
    title: "AI技術リサーチ・情報発信",
    description:
      "AIの最新技術・サービスをリサーチし、Xで認知を獲得→noteで有料記事として収益化する自動循環型メディア事業。Claude Codeで仕組み化した「リサーチ→発信→誘導→収益化→分析」のサイクルを回し続ける。",
    bullets: [
      "Research Agent / Signal Analysis で週次AIリサーチ（情報収集）",
      "X Article Posterで調査結果をスレッド配信（認知獲得）",
      "Note Article Studioで有料記事を生成・公開（収益化）",
      "反応データを分析し次週テーマを自動選定（循環）",
      "AIサービスの比較・レビュー・活用ガイド",
      "人気note記事→電子書籍化で長期収益も確保",
    ],
    href: "/business/industrial-ai",
  },
  {
    tag: "② Bio-Digital Research",
    tagColor: "#7c3aed",
    icon: "🧠",
    iconBg: "#7c3aed",
    title: "人間知性×AI研究",
    description:
      "記憶・意識・感情・夢のメカニズムを科学的に探究し、AIと人間知性の接点を研究する。神経科学の知見をAI開発と産業に橋渡しする長期R&D事業。",
    bullets: [
      "認知科学・神経科学の週次リサーチレポート配信",
      "AIプロダクトへの人間知性設計コンサル",
    ],
    href: "/business/bio-digital",
  },
  {
    tag: "③ E-Book Publishing",
    tagColor: "#059669",
    icon: "📚",
    iconBg: "#059669",
    title: "電子書籍出版",
    description:
      "テーマを指定するだけで、AIエージェントが最新研究をリサーチし、カバー画像付きのKindle対応EPUB電子書籍を自動生成。出版プロセスを完全自動化する新しい知識流通事業。",
    bullets: [
      "テーマ入力→EPUB自動生成（5〜10分）",
      "arXiv・PubMed・業界レポートを横断リサーチ",
      "Amazon KDP直接アップロード対応",
    ],
    href: "/business/ebook",
  },
  {
    tag: "④ MA° Design & Goods",
    tagColor: "#c2410c",
    icon: "🎨",
    iconBg: "#c2410c",
    title: "MA°ブランド・デザインアセット事業",
    description:
      "ミニマルブランド MA° のグラフィックをSUZURIグッズ・LINEスタンプとして展開。AIでデザインバリエーションを量産し、軌道・余白・静かな熱量をテーマにしたアセットを継続的に蓄積・販売する。",
    bullets: [
      "SUZURIでTシャツ・ステッカー・スマホケース等を販売",
      "MA°の世界観に沿ったLINEスタンプを自動生成",
      "X→SUZURIショップへの誘導で認知→購入の循環",
    ],
    href: "/business/line-sticker",
  },
  {
    tag: "⑤ AI Media Operations",
    tagColor: "#ea580c",
    icon: "🎬",
    iconBg: "#ea580c",
    title: "AIメディア自動運営",
    description:
      "収益ブログ、AIニュース動画、派生Shortsチャンネルを統合運営。全メディアからnote有料記事への誘導導線を設計し、認知→収益化の面を広げるメディア事業。",
    bullets: [
      "収益ブログの継続更新・SEO運営→note誘導",
      "TikTok等の短尺動画でAI解説→noteリンクCTA",
      "YouTube Shortsからnote・ブログへのクロス誘導",
    ],
    href: "/business/media-ops",
  },
  {
    tag: "⑥ Knowledge Infrastructure",
    tagColor: "#14b8a6",
    icon: "🗂️",
    iconBg: "#14b8a6",
    title: "ナレッジ基盤・プライベートAI",
    description:
      "PDF、Markdown、URL、ローカルLLMをつなぎ、Neiro全体の調査・執筆・提案を支える知識基盤を構築する。",
    bullets: [
      "my-brain-connector による知識集約",
      "Gemma / Ollama を用いたプライベートAI検証",
      "各事業で再利用できる社内Knowledge OS",
    ],
    href: "/business/knowledge-infra",
  },
];

const values = [
  {
    icon: "🔬",
    title: "Research First",
    desc: "発信より先にリサーチ。一次情報と深い理解から生まれたコンテンツだけを届ける",
    color: "#2563eb",
  },
  {
    icon: "🌐",
    title: "Open Intelligence",
    desc: "AIの知識は特定の専門家だけのものではない。誰もが理解し使いこなせる形に変換する",
    color: "#7c3aed",
  },
  {
    icon: "🤝",
    title: "Human × AI",
    desc: "AIを人間の代替ではなく補完として設計する。人間の判断・創造性・倫理観が中心にある",
    color: "#0891b2",
  },
  {
    icon: "⚡",
    title: "Always Current",
    desc: "AIの進化は止まらない。週次リサーチと自動更新で、常に最前線の情報を維持する",
    color: "#059669",
  },
];

const lumiAbilities = ["AIリサーチ", "意識研究", "情報発信", "エージェント統括"];

const agentOps = [
  {
    role: "CEO Agent（高木 大輝）",
    icon: "👑",
    color: "#f59e0b",
    desc: "週次経営会議を主宰。事業進捗・課題を分析し全社方針を決定",
  },
  {
    role: "AI Researcher（桐島 蓮）",
    icon: "🔬",
    color: "#2563eb",
    desc: "国内外のAI技術・サービス・事例を毎週ウェブリサーチ",
  },
  {
    role: "Bio Researcher（神崎 陽菜）",
    icon: "🧠",
    color: "#7c3aed",
    desc: "認知科学・神経科学の最新論文を調査・分析",
  },
  {
    role: "Writer（野村 彩 / 橘 詩乃）",
    icon: "✍️",
    color: "#059669",
    desc: "リサーチ結果を有料note記事に変換し、X投稿用の要約・誘導文も設計",
  },
];

const roadmap = [
  {
    period: "2026 Q2–Q3",
    label: "現在地",
    title: "X×note自動配信パイプラインの構築",
    active: true,
    items: ["週次AIリサーチ→X自動投稿の安定稼働", "note有料記事の週1本自動生成フロー確立", "目標: X follower 1,000 / note記事15本公開"],
  },
  {
    period: "2026 Q4",
    label: "",
    title: "収益化チャネルの多角化",
    active: false,
    items: ["note定期購読マガジン開始（¥980/月）", "電子書籍を計5冊KDP出版", "LINEスタンプ初セット販売開始"],
  },
  {
    period: "2027 Q1–Q2",
    label: "",
    title: "自動循環の完成・収益安定化",
    active: false,
    items: ["リサーチ→X→note→分析の完全自動パイプライン", "X→note→Kindle→ブログの4面展開", "目標: note購読200人 / MRR ¥200K〜300K"],
  },
  {
    period: "2027 Q3–",
    label: "",
    title: "コンテンツ資産の拡大・受注開始",
    active: false,
    items: ["電子書籍10冊以上・Audiobook検討", "カスタムAIリサーチの少数受注開始", "目標: MRR ¥500K"],
  },
];

const kpis = [
  { label: "X followers", value: "3,000", sub: "2026年末目標" },
  { label: "note有料読者", value: "150人", sub: "2026年末目標" },
  { label: "月次収益（MRR）", value: "¥100K〜150K", sub: "2026年末目標" },
  { label: "コンテンツ自動化率", value: "80%+", sub: "制作〜配信の自動化" },
];

// ===== メインページ =====

export default function AboutPage() {
  return (
    <div className="min-h-full bg-gray-950 text-gray-100 relative">

      {/* ===== 1. ヒーローセクション ===== */}
      <section
        aria-label="ヒーロー"
        className="relative z-10 border-b border-gray-800/60 bg-gradient-to-br from-blue-950/30 via-black/40 to-black/50 px-6 py-16 backdrop-blur-[1px]"
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          {/* マスコット画像 */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <div className="relative">
              {/* グロー背景 */}
              <div
                className="absolute inset-0 rounded-full blur-3xl opacity-30"
                style={{ background: "radial-gradient(circle, #3B82F6 0%, #1D4ED8 50%, transparent 70%)" }}
              />
              <img
                src="/mascot.png"
                alt="Lumi — Neiroの知的守護AI"
                width={280}
                height={356}
                className="relative z-10 drop-shadow-2xl"
                style={{ filter: "drop-shadow(0 0 24px rgba(59,130,246,0.45))" }}
              />
            </div>
          </div>

          {/* テキスト */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">
              Neiro Inc. — Company Overview
            </p>
            <h1 className="text-4xl font-bold text-white mb-5 leading-tight">
              AIを探究し、
              <br />
              <span className="text-blue-400">その知識を社会全体の力に変える</span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-lg">
              AIの最新技術・人間知性の研究を継続的に調査・発信し、
              「AIを正しく理解し、使いこなす人を増やす」ことに特化した研究×メディア企業。
            </p>
            {/* Mission/Vision サマリー */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 border border-blue-900/60 rounded-lg px-4 py-3 bg-blue-950/30">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Mission</p>
                <p className="text-white text-sm font-semibold leading-snug">
                  AIを探究し、知識を社会の力に変える
                </p>
              </div>
              <div className="flex-1 border border-purple-900/60 rounded-lg px-4 py-3 bg-purple-950/30">
                <p className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">Vision</p>
                <p className="text-white text-sm font-semibold leading-snug">
                  AIを使いこなす人が増える世界
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 space-y-16">

        {/* ===== 2. Mission & Vision ===== */}
        <section aria-label="Mission and Vision">
          <SectionHeader label="IDENTITY" title="Mission & Vision" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card accent="#2563eb">
              <CardTag color="#2563eb">Mission — 存在意義</CardTag>
              <p className="text-white font-semibold text-lg leading-snug mt-3">
                AIを探究し、
                <br />その知識を社会全体の力に変える
              </p>
              <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                AI技術と人間知性の研究を継続的に深め、
                誰もが理解・活用できる形に変換して届ける。
                知識の民主化こそが、テクノロジーの本来の使命だ。
              </p>
            </Card>
            <Card accent="#7c3aed">
              <CardTag color="#7c3aed">Vision — 目指す未来</CardTag>
              <p className="text-white font-semibold text-lg leading-snug mt-3">
                AIを正しく理解し、
                <br />使いこなす人が増える世界
              </p>
              <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                「何を使えばいいかわからない」「難しそう」という壁をなくし、
                あらゆる人がAIを自分の力として使える時代をつくる。
              </p>
            </Card>
          </div>
        </section>

        {/* ===== 3. Strategic Pillars ===== */}
        <section aria-label="Strategic Pillars">
          <SectionHeader
            label="STRATEGY"
            title="5つの事業（Strategic Pillars）"
            description="統合済みのプロダクト群を5つの事業ラインへ整理し、研究・発信・出版・運営・基盤の各層で展開する"
          />
          <div className="space-y-4">
            {pillars.map((p) => (
              <div
                key={p.tag}
                className="border border-gray-800 rounded-xl p-5 bg-gray-900/80 backdrop-blur-sm hover:border-gray-700 transition-colors"
              >
                <div className="flex gap-5 items-start">
                  {/* アイコン */}
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                    style={{
                      backgroundColor: p.iconBg + "22",
                      border: `1px solid ${p.iconBg}44`,
                    }}
                  >
                    {p.icon}
                  </div>
                  <div className="flex-1">
                    {/* タグ */}
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <CardTag color={p.tagColor}>{p.tag}</CardTag>
                    </div>
                    {/* タイトル */}
                    <p className="text-white font-bold text-base">{p.title}</p>
                    {/* 説明 */}
                    <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">{p.description}</p>
                    {/* 箇条書き */}
                    <ul className="mt-2.5 space-y-1">
                      {p.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-gray-300">
                          <span style={{ color: p.tagColor }} className="mt-0.5 flex-shrink-0">
                            ▸
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                    <Link href={p.href} className="inline-flex items-center gap-1 text-xs font-semibold mt-4 text-blue-400 hover:text-blue-300 transition-colors">
                      詳細を見る →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== 4. Values ===== */}
        <section aria-label="Values">
          <SectionHeader label="PRINCIPLES" title="Values（行動指針）" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {values.map((v) => (
              <div
                key={v.title}
                className="border border-gray-800 rounded-xl p-4 bg-gray-900/80 backdrop-blur-sm hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: v.color + "22" }}
                  >
                    {v.icon}
                  </span>
                  <p className="text-white font-semibold text-sm">{v.title}</p>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== 5. マスコットキャラクター紹介 ===== */}
        <section aria-label="マスコットキャラクター紹介">
          <SectionHeader label="MASCOT" title="知的守護AI — Lumi（ルミ）" />
          <div className="border border-blue-900/50 rounded-2xl p-6 bg-gray-900/80 backdrop-blur-sm overflow-hidden relative">
            {/* 背景グロー装飾 */}
            <div
              className="absolute -top-10 -right-10 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
              style={{ background: "radial-gradient(circle, #3B82F6, transparent 70%)" }}
            />
            <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
              {/* マスコット画像（小） */}
              <div className="flex-shrink-0">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <div
                    className="absolute inset-0 rounded-full blur-2xl opacity-40"
                    style={{ background: "radial-gradient(circle, #60A5FA, transparent 70%)" }}
                  />
                  <img
                    src="/mascot.png"
                    alt="Lumi マスコット"
                    width={150}
                    height={190}
                    className="relative z-10"
                    style={{ filter: "drop-shadow(0 0 16px rgba(96,165,250,0.5))" }}
                  />
                </div>
              </div>
              {/* テキスト情報 */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-2xl font-bold text-white">Lumi（ルミ）</h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    AI Mascot
                  </span>
                </div>
                <p className="text-blue-400 text-sm font-semibold mb-3">
                  Neiroの知的守護AI
                </p>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  Lumiは<strong className="text-white">"Luminous Intelligence"</strong>の象徴。
                  産業の知能化と人間理解の融合という使命を体現し、24のAIエージェントたちを導く存在です。
                  光のオーブに宿るのは、あらゆる産業の課題を照らし出すデータとインサイト。
                </p>
                {/* 能力タグ */}
                <div className="flex flex-wrap gap-2">
                  {lumiAbilities.map((ability) => (
                    <span
                      key={ability}
                      className="text-xs px-3 py-1 rounded-full border border-blue-500/40 text-blue-300 bg-blue-500/10 font-medium"
                    >
                      {ability}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 6. エージェント運用体制 ===== */}
        <section aria-label="エージェント運用体制">
          <SectionHeader
            label="OPERATIONS"
            title="エージェント運用体制"
            description="24のAIエージェントが役割を持って連携するバーチャル組織"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {agentOps.map((a) => (
              <div
                key={a.role}
                className="border border-gray-800 rounded-xl p-4 bg-gray-900/80 backdrop-blur-sm flex gap-4 items-start hover:border-gray-700 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: a.color + "22", border: `1px solid ${a.color}44` }}
                >
                  {a.icon}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{a.role}</p>
                  <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== 7. ロードマップ ===== */}
        <section aria-label="ロードマップ">
          <SectionHeader label="ROADMAP" title="開発・事業ロードマップ" />
          <div className="relative">
            {/* タイムラインの縦線 */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-800" />
            <div className="space-y-5">
              {roadmap.map((r) => (
                <div key={r.period} className="flex gap-5 items-start pl-2">
                  {/* ドット */}
                  <div
                    className={`w-3.5 h-3.5 rounded-full mt-0.5 flex-shrink-0 relative z-10 ${
                      r.active
                        ? "bg-blue-400 ring-4 ring-blue-400/20"
                        : "bg-gray-700 border border-gray-600"
                    }`}
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono text-gray-500 font-bold">{r.period}</span>
                      {r.label && (
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-bold border border-blue-500/30">
                          {r.label}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-sm leading-snug ${
                        r.active ? "text-white font-semibold" : "text-gray-400"
                      }`}
                    >
                      {r.title}
                    </p>
                    {r.items && r.items.length > 0 && (
                      <ul className="mt-1.5 space-y-0.5">
                        {r.items.map((item) => (
                          <li key={item} className="text-xs text-gray-500 leading-relaxed">
                            · {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 8. KPI ===== */}
        <section aria-label="KPI 2026年末目標">
          <SectionHeader label="TARGETS" title="KPI — 2026年末目標" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {kpis.map((k) => (
              <div
                key={k.label}
                className="border border-gray-800 rounded-xl p-5 bg-gray-900/80 backdrop-blur-sm text-center hover:border-blue-900/50 transition-colors"
              >
                <p className="text-3xl font-bold text-blue-400 font-mono">{k.value}</p>
                <p className="text-white text-xs font-semibold mt-2 leading-snug">{k.label}</p>
                <p className="text-gray-500 text-xs mt-1">{k.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== 9. フッター ===== */}
        <footer className="border-t border-gray-800 pt-6 text-center" aria-label="フッター">
          <p className="text-gray-600 text-xs">
            Neiro Inc. — Working Intelligence Platform
            &nbsp;|&nbsp;
            Powered by 24 AI Agents &amp; Lumi
          </p>
        </footer>
      </div>
    </div>
  );
}
