#!/usr/bin/env bash
set -euo pipefail

: "${OPENAI_API_KEY:?Set OPENAI_API_KEY in your environment}"
: "${DATABASE_URL:?Set DATABASE_URL in your environment}"

npm run build
npm start
