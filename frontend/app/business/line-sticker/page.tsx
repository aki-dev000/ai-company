import Link from "next/link";

const specs = [
  { label: "ブランド", value: "MA°", sub: "minimal orbit / measured heat" },
  { label: "SUZURI", value: "Tシャツ・ステッカー・ケース等", sub: "グッズ販売プラットフォーム" },
  { label: "LINEスタンプ", value: "MA°テイストの8枚セット", sub: "通常スタンプ / PNG + ZIP" },
  { label: "運用", value: "AI量産 + 手動提出", sub: "デザイン生成は自動、審査・販売は手動" },
];

const flow = [
  "MA°のデザイン原則（軌道・余白・テラコッタ）を基にテーマ設定",
  "AIでデザインバリエーションを生成",
  "SUZURIグッズ / LINEスタンプとして出力",
  "審査リスクと品質を確認",
  "Xでブランド露出→SUZURIショップへ誘導",
];

const designs = [
  { name: "Orbit Mark", desc: "MA°のシンボルロゴ。最も汎用性が高く、ブランドの基準商品。", items: "ステッカー・Tシャツ・トート・マグ" },
  { name: "Typographic Stack", desc: "タイポグラフィ主役の静かな存在感。文字が読める面積が必要。", items: "Tシャツ・ノート・トート" },
  { name: "Orbit Field", desc: "複数の軌道モチーフを配置した抽象パターン。面で見せる商品に強い。", items: "スマホケース・ノート・ポスター" },
];

export default function MADesignGoodsPage() {
  return (
    <div className="min-h-full bg-gray-950 text-gray-100">
      <div className="border-b border-gray-800 bg-gradient-to-br from-orange-950/50 via-gray-900 to-gray-950 px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <Link href="/business" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
            ← Businesses
          </Link>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-4xl">🎨</span>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400 px-2 py-1 rounded bg-orange-400/10">
              MA° Design & Goods
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mt-4">MA°ブランド・デザインアセット事業</h1>
          <p className="text-gray-400 mt-3 max-w-3xl leading-relaxed">
            軌道と余白をテーマにしたミニマルブランド MA° のグラフィックを、SUZURIグッズとLINEスタンプで展開。
            静かな熱量と整った余白を、日用品の上で機能するデザインに落とし込みます。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://suzuri.jp/clearskycat/products"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold transition-colors"
            >
              SUZURIショップ →
            </a>
            <Link
              href="/business/line-sticker/generate"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-orange-500/40 text-orange-300 hover:text-white hover:border-orange-300 transition-colors text-sm font-semibold"
            >
              LINEスタンプ生成
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {/* スペック */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {specs.map((spec) => (
            <div key={spec.label} className="border border-orange-900/30 rounded-xl p-5 bg-gray-900">
              <p className="text-xs text-gray-500 mb-1">{spec.label}</p>
              <p className="text-white font-semibold">{spec.value}</p>
              <p className="text-xs text-gray-600 mt-1">{spec.sub}</p>
            </div>
          ))}
        </section>

        {/* デザインラインナップ */}
        <section className="border border-gray-800 rounded-2xl p-6 bg-gray-900">
          <p className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-4">Design Lineup</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {designs.map((d) => (
              <div key={d.name} className="border border-gray-700/50 rounded-xl p-4">
                <h3 className="text-white font-semibold text-sm mb-2">{d.name}</h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-2">{d.desc}</p>
                <p className="text-xs text-orange-400/80">→ {d.items}</p>
              </div>
            ))}
          </div>
        </section>

        {/* フローとブランド方針 */}
        <section className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-3 border border-gray-800 rounded-2xl p-6 bg-gray-900">
            <p className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-4">Flow</p>
            <div className="space-y-3">
              {flow.map((item, index) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-orange-500/15 text-orange-300 text-xs font-bold flex items-center justify-center mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-sm text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 border border-gray-800 rounded-2xl p-6 bg-gray-900">
            <p className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-4">Brand Guidelines</p>
            <div className="space-y-3 text-sm text-gray-300">
              <p>カラー：黒・生成り・テラコッタを軸にしたミニマルパレット。</p>
              <p>モチーフ：円弧・軌道・余白。派手さよりも長く見ていられる輪郭を重視。</p>
              <p>LINEスタンプもMA°の世界観に統一し、静かで日常に馴染むデザインで生成。</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
