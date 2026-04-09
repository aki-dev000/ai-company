import Link from "next/link";

const services = [
  {
    badge: "CORE",
    title: "AIリサーチ電子書籍",
    desc: "テーマを指定するだけでリサーチ→執筆→EPUB出力まで自動化。Amazon Kindleですぐ出版できるファイルを生成します。",
  },
  {
    badge: "FEATURE",
    title: "カバー画像自動生成",
    desc: "書籍タイトルに合わせたプロフェッショナルなカバー画像をAIが自動生成。デザイナー不要でKindleの表紙要件を満たします。",
  },
  {
    badge: "OUTPUT",
    title: "EPUB3形式で出力",
    desc: "Amazon KDP（Kindle Direct Publishing）に直接アップロードできるEPUB3形式で出力。章立て・目次・スタイルも自動設定。",
  },
  {
    badge: "RESEARCH",
    title: "最新研究ベースの内容",
    desc: "arXiv・PubMed・業界メディアなど一次情報を優先リサーチ。数値・事例・出典付きの信頼性の高い内容で差別化。",
  },
];

const pipeline = [
  {
    step: "01",
    icon: "🔍",
    title: "テーマ入力",
    desc: "出版したいテーマを入力するだけ。「生成AIの倫理」「量子コンピュータ入門」など何でもOK。",
  },
  {
    step: "02",
    icon: "🌐",
    title: "自動リサーチ",
    desc: "田中 航（Research Analyst）が学術論文・業界レポート・専門メディアを横断的にリサーチ。",
  },
  {
    step: "03",
    icon: "✍️",
    title: "原稿執筆",
    desc: "藤原 莉子（E-Book Author）がリサーチ結果を基に10,000〜15,000字の書籍原稿を執筆。",
  },
  {
    step: "04",
    icon: "📚",
    title: "EPUB生成・保存",
    desc: "カバー画像生成、章立て・目次の自動構成、EPUB3変換。ドキュメントに保存してダウンロード可能に。",
  },
];

const genres = [
  "AI・機械学習", "量子コンピュータ", "バイオテクノロジー", "宇宙開発",
  "気候変動・環境", "未来の働き方", "デジタルヘルス", "ブロックチェーン",
  "脳科学・認知科学", "教育テクノロジー",
];

const legacyCatalog = [
  {
    title: "代替される私",
    type: "SF短編小説",
    status: "完成原稿・PDF（16p）",
    desc: "AI業務エージェント《HARBOR》に仕事を奪われる企画職の物語。AIと人間の共存・代替をテーマにした近未来SF。著者: 晴れ時々猫",
  },
  {
    title: "不老の取引",
    type: "SF長編小説",
    status: "完成原稿・PDF（28p）",
    desc: "2065年東京、寿命延長企業の事業開発本部長が主人公。不老不死の商業化と倫理を描くバイオSF。著者: 晴れ時々猫",
  },
  {
    title: "教祖の子",
    type: "文芸/サスペンス",
    status: "完成原稿・PDF（42p）",
    desc: "宗教団体の教祖の子が金庫の暗証番号を発見する。信仰と現実の狭間を描くサスペンス。著者: 晴れ時々猫",
  },
  {
    title: "原質の海",
    type: "SFシリーズ",
    status: "合本版・第二部・出版企画書PDF",
    desc: "シリーズ全2部構成のSF長編。合本版（67p+）、出版向け企画書（帯文・あらすじ・商業訴求）完備。著者: 晴れ時々猫",
  },
  {
    title: "欠乏と脳",
    type: "研究ベース書籍",
    status: "原稿・PDF・EPUB・note導線あり",
    desc: "学術研究をベースに長文原稿、EPUB、PDF、有料note向け抜粋まで揃った完成度の高い既存資産。",
  },
  {
    title: "仕事が変わるAI活用術",
    type: "AI実務本候補",
    status: "構成案あり",
    desc: "Neiroの AI Research & Media と親和性が高い。業務AI・Copilot・ChatGPT活用本のシリーズ化候補。",
  },
  {
    title: "生命とは何か",
    type: "Bio-Digital連携候補",
    status: "章別原稿・表紙案あり",
    desc: "Bio-Digital Research との接続に向いた長編原稿資産。シリーズ再編集や研究叢書化に使える。",
  },
  {
    title: "技術系エンジニアの転職記",
    type: "実務エッセイ",
    status: "完成原稿・EPUBあり",
    desc: "Neiro本流の研究テーマとは少しズレるが、制作テンプレートと体裁サンプルとして再利用可能。",
  },
];

const leveragePoints = [
  {
    label: "Metadata",
    title: "EPUBメタデータ資産",
    desc: "既存の metadata 定義を使えば、タイトル・説明・subject・rights・cover を書籍ごとに持てる。",
  },
  {
    label: "Cover",
    title: "表紙テンプレート群",
    desc: "HTML と PNG の表紙資産が既にあり、今の単純自動表紙より売り物としての見栄えを上げられる。",
  },
  {
    label: "Funnel",
    title: "note抜粋導線",
    desc: "電子書籍の冒頭を無料公開し、有料記事や販売ページへ送る導線を標準機能にできる。",
  },
];

export default function EbookPage() {
  return (
    <div className="min-h-full">

      {/* Hero */}
      <section className="border-b border-[var(--border-warm)] px-6 py-14">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/business" className="text-xs transition-colors hover:opacity-80" style={{ opacity: 0.4 }}>
              ← 事業一覧
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">📚</span>
            <span className="text-[10px] tracking-[0.3em] uppercase px-2 py-0.5 rounded-sm" style={{ color: "var(--accent-gold)", opacity: 0.6 }}>
              E-Book Publishing Division
            </span>
          </div>
          <h1 className="text-4xl font-medium mb-4 leading-tight" style={{ fontFamily: "var(--font-noto-serif), serif" }}>
            テーマを入力するだけで、<br />
            <span style={{ color: "var(--accent-gold)" }}>Kindle電子書籍</span>が自動生成される。
          </h1>
          <p className="text-lg max-w-2xl leading-relaxed mb-8" style={{ opacity: 0.5 }}>
            AIエージェントが最新研究をリサーチし、プロ品質の電子書籍原稿を執筆。
            カバー画像も自動生成し、Amazon Kindleにそのまま出版できるEPUBファイルを作成します。
            さらに、既存の原稿資産・表紙テンプレート・note導線も再利用し、単発生成ではなく出版ラインとして展開します。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/business/ebook/generate"
              className="px-6 py-3 rounded-sm font-medium text-sm transition-colors"
              style={{ backgroundColor: "var(--accent-gold)", color: "var(--background)" }}
            >
              今すぐ電子書籍を生成 →
            </Link>
            <Link
              href="/business/ebook/generate"
              className="px-6 py-3 rounded-sm font-medium text-sm border transition-colors hover:opacity-80"
              style={{ borderColor: "var(--border-warm)", color: "var(--accent-gold)" }}
            >
              生成済み書籍を見る
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">

        {/* パイプライン */}
        <section>
          <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: "var(--accent-gold)", opacity: 0.6 }}>HOW IT WORKS</p>
          <h2 className="text-2xl font-medium mb-8" style={{ fontFamily: "var(--font-noto-serif), serif" }}>4ステップで電子書籍が完成</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pipeline.map((p, i) => (
              <div key={p.step} className="relative">
                {i < pipeline.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px z-0" style={{ width: "calc(100% - 3rem)", backgroundColor: "var(--border-warm)" }} />
                )}
                <div className="border border-[var(--border-warm)] rounded-sm p-5 relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium" style={{ backgroundColor: "var(--border-warm)", color: "var(--accent-gold)" }}>
                      {p.step}
                    </span>
                    <span className="text-2xl">{p.icon}</span>
                  </div>
                  <h3 className="font-medium text-sm mb-2">{p.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ opacity: 0.5 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 機能一覧 */}
        <section>
          <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: "var(--accent-gold)", opacity: 0.6 }}>FEATURES</p>
          <h2 className="text-2xl font-medium mb-6" style={{ fontFamily: "var(--font-noto-serif), serif" }}>主要機能</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((s) => (
              <div key={s.title} className="border border-[var(--border-warm)] rounded-sm p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="text-[10px] tracking-[0.3em] uppercase font-medium px-2 py-0.5 rounded-sm"
                    style={{ color: "var(--accent-gold)", opacity: 0.6 }}
                  >
                    {s.badge}
                  </span>
                  <h3 className="font-medium text-sm">{s.title}</h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ opacity: 0.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: "var(--accent-gold)", opacity: 0.6 }}>ASSET BASE</p>
          <h2 className="text-2xl font-medium mb-4" style={{ fontFamily: "var(--font-noto-serif), serif" }}>既存資産をそのまま事業に載せられる</h2>
          <p className="text-sm mb-6 max-w-3xl leading-relaxed" style={{ opacity: 0.5 }}>
            `ai-management/電子書籍/` には、完成原稿、EPUB、表紙画像、HTML表紙、note向け有料導線の雛形がすでに存在します。
            Neiro はそれらを「制作実績」「再編集シリーズ」「販売導線テンプレート」として電子書籍事業へ取り込めます。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {legacyCatalog.map((item) => (
              <div key={item.title} className="border border-[var(--border-warm)] rounded-sm p-5">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <p className="font-medium text-base">{item.title}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-sm border" style={{ borderColor: "var(--border-warm)", color: "var(--accent-gold)" }}>
                    {item.type}
                  </span>
                </div>
                <p className="text-xs font-medium mb-2" style={{ color: "var(--accent-gold)" }}>{item.status}</p>
                <p className="text-sm leading-relaxed" style={{ opacity: 0.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: "var(--accent-gold)", opacity: 0.6 }}>LEVERAGE</p>
          <h2 className="text-2xl font-medium mb-6" style={{ fontFamily: "var(--font-noto-serif), serif" }}>今すぐ転用できる3つの資産</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leveragePoints.map((point) => (
              <div key={point.title} className="border border-[var(--border-warm)] rounded-sm p-5">
                <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: "var(--accent-gold)", opacity: 0.6 }}>{point.label}</p>
                <h3 className="font-medium text-base mb-2">{point.title}</h3>
                <p className="text-sm leading-relaxed" style={{ opacity: 0.5 }}>{point.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 対応テーマ例 */}
        <section>
          <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: "var(--accent-gold)", opacity: 0.6 }}>GENRES</p>
          <h2 className="text-2xl font-medium mb-4" style={{ fontFamily: "var(--font-noto-serif), serif" }}>対応テーマ（一例）</h2>
          <p className="text-sm mb-6" style={{ opacity: 0.5 }}>
            これらに限らず、あらゆるテーマで電子書籍を生成できます。
            テーマが具体的であるほど、より深い内容になります。
          </p>
          <div className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <span
                key={g}
                className="px-3 py-1.5 rounded-sm border text-xs font-medium"
                style={{ borderColor: "var(--border-warm)", color: "var(--accent-gold)" }}
              >
                {g}
              </span>
            ))}
          </div>
        </section>

        {/* スペック */}
        <section>
          <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: "var(--accent-gold)", opacity: 0.6 }}>SPECS</p>
          <h2 className="text-2xl font-medium mb-6" style={{ fontFamily: "var(--font-noto-serif), serif" }}>出力仕様</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "出力形式", value: "EPUB3", sub: "Kindle Direct Publishing対応" },
              { label: "文字数", value: "10,000〜15,000字", sub: "5〜7章構成" },
              { label: "カバー画像", value: "自動生成", sub: "1600×2400px JPEG" },
              { label: "既存資産活用", value: "可能", sub: "既刊原稿・表紙・構成案を流用" },
              { label: "目次", value: "自動構成", sub: "章・節レベル" },
              { label: "販売導線", value: "note連携対応", sub: "抜粋記事・有料導線の展開候補" },
              { label: "使用エージェント", value: "田中 航 → 藤原 莉子", sub: "Researcher → Author" },
            ].map((spec) => (
              <div key={spec.label} className="border border-[var(--border-warm)] rounded-sm p-4">
                <p className="text-xs mb-1" style={{ opacity: 0.4 }}>{spec.label}</p>
                <p className="font-medium text-sm">{spec.value}</p>
                <p className="text-xs mt-0.5" style={{ opacity: 0.4 }}>{spec.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border border-[var(--border-warm)] rounded-sm p-8 text-center">
          <p className="text-4xl mb-4">📚</p>
          <h2 className="text-2xl font-medium mb-3" style={{ fontFamily: "var(--font-noto-serif), serif" }}>今すぐ電子書籍を生成する</h2>
          <p className="text-sm mb-6 max-w-lg mx-auto" style={{ opacity: 0.5 }}>
            テーマを入力するだけ。AIエージェントが自動でリサーチ・執筆・EPUB化を行います。
            生成完了まで約5〜10分。既存シリーズの再編集や note 抜粋導線の元原稿としても使えます。
          </p>
          <Link
            href="/business/ebook/generate"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-sm font-medium text-base transition-colors"
            style={{ backgroundColor: "var(--accent-gold)", color: "var(--background)" }}
          >
            電子書籍を生成する →
          </Link>
        </section>

        <div className="border-t border-[var(--border-warm)] pt-6">
          <Link href="/business" className="text-sm transition-colors hover:opacity-80" style={{ opacity: 0.5 }}>
            ← 事業一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
