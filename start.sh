#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check .env
if [ ! -f "$SCRIPT_DIR/.env" ]; then
  echo "ERROR: .env ファイルが見つかりません"
  echo "  cp $SCRIPT_DIR/.env.example $SCRIPT_DIR/.env"
  echo "  # ANTHROPIC_API_KEY を設定してください"
  exit 1
fi

# Backend
echo "==> バックエンドを起動中 (port 8000)..."
cd "$SCRIPT_DIR/backend"
if [ ! -d ".venv" ]; then
  python3 -m venv .venv
  .venv/bin/pip install -r requirements.txt -q
fi
.venv/bin/python main.py &
BACKEND_PID=$!

# Frontend
echo "==> フロントエンドを起動中 (port 3010)..."
cd "$SCRIPT_DIR/frontend"
npm run dev -- --port 3010 &
FRONTEND_PID=$!

echo ""
echo "✅ 起動完了"
echo "   フロントエンド: http://localhost:3010"
echo "   バックエンドAPI: http://localhost:8000"
echo ""
echo "停止するには Ctrl+C を押してください"

cleanup() {
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
  exit 0
}
trap cleanup INT TERM

wait
