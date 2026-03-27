# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

**TechForward Inc.** — 18人のAIエージェントが役割を持って連携するバーチャルソフトウェア会社のシミュレーションシステム。CEOユーザーがディレクティブを入力すると、Plannerが実行計画を生成し、各エージェントが順次・並列に処理して結果をMarkdownドキュメントとして保存する。

## 起動・開発コマンド

```bash
# 初回セットアップ
cp .env.example .env
# .env の ANTHROPIC_API_KEY を設定

# まとめて起動（バックエンド port 8000 + フロントエンド port 3010）
bash start.sh

# バックエンド単体
cd backend
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/python main.py

# フロントエンド単体
cd frontend
npm install
npm run dev -- --port 3010

# エージェント読み込み確認
cd backend && ANTHROPIC_API_KEY=dummy .venv/bin/python -c \
  "from agents.registry import load_agents, get_all_definitions; load_agents(); print(len(get_all_definitions()))"
```

## アーキテクチャ

```
CEO (ユーザー) → POST /api/directives
                     │
              orchestrator/planner.py   ← Claude API でJSON実行計画を生成
                     │
              orchestrator/executor.py  ← トポロジカルソート → 並列/直列でエージェント実行
                     │
         agents/base_agent.py           ← Claude API ストリーミング呼び出し
                     │
         utils/event_bus.py             ← asyncio.Queue で SSE にリアルタイム配信
                     │
         data/documents/{session_id}/   ← Markdown保存
```

### 処理フロー詳細

1. **Planner** (`orchestrator/planner.py`): 全エージェントのIDと責務を含むプロンプトをClaudeに投げ、`{steps: [{step_id, label, agents[], depends_on[], parallel}]}` のJSON実行計画を生成。失敗時は`DEFAULT_STEPS`にフォールバック。
2. **Executor** (`orchestrator/executor.py`): 計画をトポロジカルソートし、`parallel: true`のステップは`asyncio.gather`で並列実行。各ステップ完了後、次ステップの`AgentContext.prior_outputs`に前ステップ出力（先頭80行）を渡す。
3. **BaseAgent** (`agents/base_agent.py`): `asyncio.to_thread`でClaudeのストリーミングを非同期化。トークンはevent_busに逐次emit、完了後`data/documents/{session_id}/{output_document}`に保存。
4. **EventBus** (`utils/event_bus.py`): セッションIDごとに`asyncio.Queue`を管理するシングルトン。SSEエンドポイント(`api/stream.py`)がsubscribeし、フロントエンドに配信。

### エージェント定義の追加・変更

`backend/agents/definitions/*.yaml` に追加するだけで自動ロード。YAMLスキーマ：

```yaml
id: unique_id          # Plannerがagent_idとして参照
display_name: "名前"
department: engineering  # 組織図の色分けに使用
tier: 3                  # 1=C-Suite, 2=Manager, 3=Lead, 4=IC
reports_to: vp_engineering
system_prompt: |
  # エージェントの役割・出力形式をここに記述
output_document: "XX_filename.md"  # data/documents/{session_id}/ に保存
avatar_color: "#2563eb"
```

### APIエンドポイント

| メソッド | パス | 用途 |
|---------|------|------|
| POST | `/api/directives` | ディレクティブ送信、バックグラウンド実行開始 |
| GET | `/api/directives` | セッション一覧 |
| GET | `/api/stream/{session_id}` | SSE（リアルタイムイベント） |
| GET | `/api/documents/{session_id}` | ドキュメント一覧 |
| GET | `/api/documents/{session_id}/{filename}` | ドキュメント本文 |
| GET | `/api/org-chart` | 組織図データ |

### フロントエンド構成（Next.js 16 / Tailwind v4）

- `app/page.tsx` — ダッシュボード: `DirectiveInput` + `ActivityFeed` + `DocumentViewer`
- `app/org-chart/page.tsx` — 組織図（tier別表示、クリックで責務展開）
- `app/documents/page.tsx` — 過去セッションのドキュメントブラウザ
- `lib/useSSE.ts` — SSE接続フック（`agent_token`イベントは同一エージェントの連続トークンをマージ）
- `lib/api.ts` — バックエンドURL: `NEXT_PUBLIC_API_URL`（デフォルト `http://localhost:8000`）

---

## note向け技術記事作成ワークフロー

ディレクティブ例：「note向けに○○の技術記事を書いて」

### 推奨実行計画（Plannerへのヒント）

このワークフローをPlannerに意識させるため、ディレクティブに以下を含めると効果的：
> 「note向け技術記事。Tech Leadが技術的正確性を担保し、Content Writerが読者向けに執筆、最後にQAが動作確認する」

### 設計済みワークフロー

```
Step 1（並列）: 戦略策定
  ├── cto         → 技術選定・アーキテクチャ方針（技術的正確性の基準）
  └── cmo         → note向けターゲット読者・メッセージング戦略

Step 2（並列）: 素材準備
  ├── tech_lead_1 → 記事に登場する技術の詳細仕様・コードサンプル・動作確認手順
  ├── tech_lead_2 → フロントエンド技術の詳細仕様・UIサンプル
  └── product_manager → 読者の課題・ユーザーストーリー・記事構成案

Step 3（直列, depends_on: s2）: 記事執筆
  └── content_writer_1 → Tech Leadの仕様を受けてnote記事本文を執筆
                          （Tech Lead出力を「技術的根拠」として全面参照）

Step 4（直列, depends_on: s3）: 品質検証
  └── qa_engineer_1    → 記事内コードサンプルの動作確認・技術的誤り検出・
                          Acceptance Criteria達成確認

Step 5（並列, depends_on: s3）: 拡散・展開
  ├── marketing_manager → note投稿後のSNS拡散戦略・ハッシュタグ
  └── seo_specialist    → note SEO最適化・タイトル・見出し改善提案
```

### Content Writer ↔ Tech Lead 連携の鍵

`content_writer_1.yaml` の `system_prompt` において、Tech Leadの出力（`prior_outputs`に含まれる `10_backend_spec.md` / `11_frontend_spec.md`）を必ず参照し、技術的事実をそのまま文章化するよう指示する。Content WriterはTech Leadが書いたコードサンプルを一字一句変更せず引用すること。

### QA の動作確認スコープ

`qa_engineer_1.yaml` の `system_prompt` には以下を追記することを推奨：
- 記事内の全コードブロックを仮想的に実行し、エラーが出ないか検証
- Tech Leadの仕様書（`10_backend_spec.md`）との整合性チェック
- note読者（初級〜中級エンジニア）が手順通りに実行できるか評価
- 問題発見時は「修正指示」として `content_writer_1` へのフィードバックを出力

### カスタムワークフローの固定方法

特定のディレクティブに対してPlannerに頼らず固定フローで動かしたい場合、`orchestrator/planner.py` の `DEFAULT_STEPS` を上記ステップに合わせて上書きする、またはディレクティブに「以下の順序で実行:」と明示的な実行順を含める。

---

## 設定ファイル

| ファイル | 用途 |
|---------|------|
| `.env` | `ANTHROPIC_API_KEY`, `MODEL`（デフォルト: `claude-sonnet-4-6`） |
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL` |
| `backend/config.py` | `max_tokens=4096`, `context_budget_tokens=6000` |

コンテキスト予算（`context_budget_tokens`）は各エージェントへ渡す`prior_outputs`の上限制御に使用。記事執筆のように前段の出力を多く参照する場合は増やすことを検討。
