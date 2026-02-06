#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
export PWCLI="${PWCLI:-$CODEX_HOME/skills/playwright/scripts/playwright_cli.sh}"

PW_CMD=()
if [[ -x "$PWCLI" ]] && "$PWCLI" --help >/dev/null 2>&1; then
  PW_CMD=("$PWCLI")
else
  PW_CMD=(npx --yes --package playwright-cli playwright-cli)
fi

run_pw() {
  "${PW_CMD[@]}" "$@"
}

PORT="${PORT:-4173}"
BASE_URL="${BASE_URL:-http://127.0.0.1:${PORT}}"
SESSION="xy$(date +%s | tail -c 4)"
QUICK="${QUICK:-0}"
WIDGET_LIMIT="${WIDGET_LIMIT:-0}"

OUT_DIR="$ROOT_DIR/output/playwright"
LOG_FILE="$OUT_DIR/overflow-results.log"
mkdir -p "$OUT_DIR"
: > "$LOG_FILE"
find "$OUT_DIR" -type f -name '*.png' -delete

if [[ -z "${NO_SERVER:-}" ]]; then
  npm run dev -- --host 127.0.0.1 --port "$PORT" >/tmp/xyte-elements-dev.log 2>&1 &
  DEV_PID=$!
  trap 'kill "$DEV_PID" >/dev/null 2>&1 || true' EXIT

  for _ in {1..40}; do
    if curl -sf "$BASE_URL" >/dev/null 2>&1; then
      break
    fi
    sleep 0.5
  done
fi

WIDGET_IDS=()
while IFS= read -r widget_id; do
  WIDGET_IDS+=("$widget_id")
done < <(sed -n "s/^  story('\\([^']*\\)'.*/\\1/p" "$ROOT_DIR/src/widgets/registry.ts")

if [[ "$QUICK" == "1" ]]; then
  WIDGET_IDS=("${WIDGET_IDS[@]:0:8}")
  THEMES=(xyte_classic_dark xyte_ops_light)
else
  THEMES=(xyte_classic_dark xyte_ops_light xyte_midnight_haze xyte_graphite_neo xyte_slate_cloud xyte_teal_night)
fi

if [[ "$WIDGET_LIMIT" =~ ^[0-9]+$ ]] && [[ "$WIDGET_LIMIT" -gt 0 ]]; then
  WIDGET_IDS=("${WIDGET_IDS[@]:0:$WIDGET_LIMIT}")
fi

MODES=(legacy modern)
VIEWPORTS=(desktop mobile)

for theme in "${THEMES[@]}"; do
  mkdir -p "$OUT_DIR/$theme"
  for mode in "${MODES[@]}"; do
    for viewport in "${VIEWPORTS[@]}"; do
      if [[ "$viewport" == "mobile" ]]; then
        WIDTH=390
        HEIGHT=860
      else
        WIDTH=1440
        HEIGHT=960
      fi

      for widget in "${WIDGET_IDS[@]}"; do
        URL="${BASE_URL}/?view=explorer&widget=${widget}&theme=${theme}&mode=${mode}&viewport=${viewport}"
        SHOT_PATH="$OUT_DIR/$theme/${widget}-${mode}-${viewport}.png"

        run_pw --session "$SESSION" open "$URL" >/dev/null
        run_pw --session "$SESSION" resize "$WIDTH" "$HEIGHT" >/dev/null
        run_pw --session "$SESSION" snapshot >/dev/null || true

        run_pw --session "$SESSION" eval "() => { document.querySelectorAll('input[type=range]').forEach((el) => { const min = Number(el.min || 0); const max = Number(el.max || 100); el.value = String(Math.round((min + max) / 2)); el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); }); document.querySelectorAll('select').forEach((el) => { if (el.options.length > 1) { el.selectedIndex = 1; el.dispatchEvent(new Event('change', { bubbles: true })); }}); return 'ok'; }" >/dev/null || true

        OVERFLOW_RAW=$(run_pw --session "$SESSION" eval "() => { const root = document.querySelector('[data-widget-root]'); if (!root) return 'missing-root'; const widthOverflow = root.scrollWidth > root.clientWidth + 1; const heightOverflow = root.scrollHeight > root.clientHeight + 1; return widthOverflow || heightOverflow ? 'overflow' : 'ok'; }")
        OVERFLOW_STATUS=$(printf '%s\n' "$OVERFLOW_RAW" | sed -nE 's/^"(ok|overflow|missing-root)"$/\1/p' | tail -1)
        OVERFLOW_STATUS=${OVERFLOW_STATUS:-unknown}

        echo "${theme},${mode},${viewport},${widget},${OVERFLOW_STATUS}" >> "$LOG_FILE"

        SCREENSHOT_OUTPUT=$(run_pw --session "$SESSION" screenshot)
        SCREENSHOT_REL=$(printf '%s\n' "$SCREENSHOT_OUTPUT" | sed -nE 's/.*\]\(([^)]+\.png)\).*/\1/p' | tail -1)
        if [[ -n "$SCREENSHOT_REL" && -f "$ROOT_DIR/$SCREENSHOT_REL" ]]; then
          cp "$ROOT_DIR/$SCREENSHOT_REL" "$SHOT_PATH"
        fi
      done
    done
  done

done

if [[ "${KEEP_PLAYWRIGHT_CLI_DATA:-0}" != "1" ]]; then
  rm -rf "$ROOT_DIR/.playwright-cli"
fi

echo "Playwright sweep completed"
echo "Screenshots: $OUT_DIR"
echo "Overflow report: $LOG_FILE"
