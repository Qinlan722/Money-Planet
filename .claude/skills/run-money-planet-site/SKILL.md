---
name: run-money-planet-site
description: Build, run, and drive the Money Planet site (money-planet-site) — a bilingual (zh/en) Cloudflare-worker-style Node site with interactive money lessons and games. Use when asked to run, start, launch, screenshot, smoke-test, or click through the site, its lessons, or its games.
---

Money Planet is a Node HTTP server (`worker/index.js`, a Cloudflare-Worker-shaped
`fetch` handler run under plain `node:http` via `scripts/dev.js`) serving
server-rendered HTML — no client framework, so there's nothing to "hydrate,"
just pages and links. All paths below are relative to the repo root
(`<repo-root>`, the directory containing this repo's `package.json`), not to
this skill directory.

## Prerequisites

None beyond Node + npm (already required by the repo) and a cached Chromium
for Playwright. Check the cache first — if it's empty, `npx playwright install
chromium` downloads it (needs network):

```bash
ls ~/Library/Caches/ms-playwright 2>/dev/null || npx playwright install chromium
```

## Setup (one-time per machine)

The repo itself has no `playwright` dependency (it only needs `esbuild` to
build). The driver brings its own, installed inside this skill directory so it
never touches the repo's `package.json`:

```bash
cd .claude/skills/run-money-planet-site && npm install
```

## Run (agent path) — the driver

1. Start the dev server in the background and wait for it to actually serve:

```bash
cd <repo-root>
pkill -f "scripts/dev.js" 2>/dev/null   # avoid EADDRINUSE from a stale run
nohup npm run dev > /tmp/my-site-dev.log 2>&1 &
echo $! > /tmp/my-site-dev.pid
for i in $(seq 1 15); do curl -sf http://127.0.0.1:5175/ >/dev/null && echo UP && break; sleep 1; done
```

`scripts/dev.js` listens on `127.0.0.1:5175` (override with `PORT=...`).

2. Pipe commands into the driver (a small Playwright REPL — no `chromium-cli`
   was available in this environment, so this driver replaces it):

```bash
cd .claude/skills/run-money-planet-site
node driver.mjs <<'EOF'
nav /
screenshot home
nav /games
wait-for text=开始游戏 Play Now
screenshot games
click text=开始游戏 Play Now
wait-for text=认钱配对
screenshot money-match
console-errors
quit
EOF
```

Screenshots land in `.claude/skills/run-money-planet-site/screenshots/<name>.png`.
`BASE_URL` env var overrides the default `http://127.0.0.1:5175` if you changed
`PORT`.

Driver commands (see `driver.mjs` for the full list): `nav <path>`,
`click <selector>`, `fill <selector> <text>`, `press <key>`,
`wait-for <selector>`, `screenshot [name]`, `eval <js>`, `console-errors`,
`quit`. Selectors accept Playwright's `text=...` engine, which is the
easiest way to target this site's bilingual buttons/links.

3. Stop the server when done:

```bash
kill $(cat /tmp/my-site-dev.pid) 2>/dev/null; rm -f /tmp/my-site-dev.pid
```

## Run (human path)

```bash
npm run dev
```

Then open `http://127.0.0.1:5175/` in a real browser. `Ctrl-C` to stop.

## Build + validate (no browser needed)

`scripts/build.js` bundles `worker/index.js` into a single-file worker at
`dist/server/index.js` (the deploy target needs one file, not multi-file ESM).
`scripts/validate.js` then imports that bundle directly and calls `.fetch()`
against ~15 representative routes (home, lessons, all 6 planet pages, games,
library, missions, etc.) — this is a fast way to smoke-test routing/rendering
without spinning up an HTTP server or a browser at all:

```bash
npm run build
npm run validate    # -> "Validation passed"
```

## Gotchas

- **No `chromium-cli` in this environment.** The `/run` skill's default
  pattern assumes it's installed; it wasn't here. `driver.mjs` is a minimal
  stand-in with the same command vocabulary (`nav`/`click`/`wait-for`/
  `screenshot`/`console-errors`) so instructions transfer if `chromium-cli`
  ever is available — just swap the invocation.
- **`playwright` isn't a repo dependency.** Installing it at the repo root
  would add an unrelated devDependency to a project that otherwise only needs
  `esbuild`. It's scoped to this skill's own `package.json` instead.
- **macOS has no `timeout` command.** The wait-for-port loop above uses a
  plain `for`/`sleep` loop instead of `timeout ... until curl ...`.
- **Chinese text selectors work fine** with Playwright's `text=` engine
  (e.g. `text=开始游戏 Play Now` matches the mixed zh/en button label used
  throughout the site) — no need to fall back to CSS selectors for content
  in this bilingual UI.

## Troubleshooting

- `curl: (7) Failed to connect` in the wait loop → the dev server didn't
  start; check `/tmp/my-site-dev.log` (most likely `EADDRINUSE` from a stale
  process — `pkill -f "scripts/dev.js"` and retry).
- `Error: Cannot find module 'playwright'` when running `driver.mjs` → you
  skipped the one-time `npm install` inside this skill directory.
