# AGENTS.md

Instructions for AI coding agents working on this repository.

## Repo Structure

```
banksync-mcp/
├── typescript/          # npm package: @banksync/mcp
│   ├── src/index.ts     # CLI entry — spawns mcp-remote with API key
│   ├── src/index.test.ts
│   ├── README.md        # npm-specific README (SEO optimized for npmjs.com)
│   ├── package.json     # pnpm, vitest, oxlint, tsc
│   └── CHANGELOG.md
├── python/              # PyPI package: banksync-mcp
│   ├── banksync_mcp/
│   │   ├── __init__.py
│   │   └── server.py    # Async stdio↔HTTP bridge via mcp SDK
│   ├── tests/
│   ├── README.pypi.md   # PyPI-specific README (SEO optimized, no HTML)
│   ├── pyproject.toml   # uv, pytest, ruff
│   └── CHANGELOG.md
├── .github/workflows/
│   ├── ci.yml           # CI: lint + typecheck + test + build (push/PR to main)
│   ├── publish-npm.yml  # Publish @banksync/mcp to npm (on release)
│   └── publish-pypi.yml # Publish banksync-mcp to PyPI (on release)
├── server.json          # MCP server registry metadata (28 tools)
├── docs/
│   ├── TOOLS.md         # End-user tool reference
│   ├── ARCHITECTURE.md  # System architecture
│   └── AGENTS.md        # Guide for agents *using* BankSync tools
└── README.md
```

## What This Repo Is

Thin MCP clients (Node.js + Python) that bridge stdio ↔ `https://mcp.banksync.io`. No business logic — just auth validation and protocol forwarding. The remote server (separate repo: `banksync-workspace`) hosts the actual 28-tool MCP server.

## Dev Commands

### TypeScript (`typescript/`)

```sh
pnpm install             # install deps
pnpm test                # vitest run
pnpm lint                # oxlint src/
pnpm typecheck           # tsc --noEmit
pnpm check               # lint + typecheck + test
pnpm build               # tsc → dist/
```

### Python (`python/`)

```sh
uv sync                  # install deps + create venv
uv run pytest -v         # run tests
uv run ruff check .      # lint
uv run ruff check --fix .  # auto-fix lint issues
uv build                 # build sdist + wheel
```

## CI/CD

### Workflows

- **ci.yml** — Runs on push/PR to `main`. Matrix: Node 20+22, Python 3.10–3.13. Steps: lint → typecheck → test → build.
- **publish-npm.yml** — Triggered by GitHub release. Publishes `@banksync/mcp` to npm. Requires `NPM_TOKEN` secret.
- **publish-pypi.yml** — Triggered by GitHub release. Publishes `banksync-mcp` to PyPI via trusted publisher (OIDC). Requires `pypi` environment.

### Running CI Locally with `act`

Requires Docker (Colima works: `brew install colima docker && colima start`).

```sh
# From repo root:
export DOCKER_HOST="unix://${HOME}/.colima/default/docker.sock"

# TypeScript CI (single matrix entry)
act push -W .github/workflows/ci.yml -j typescript \
  --matrix node-version:22 \
  --container-daemon-socket '-' \
  -P ubuntu-latest=node:22-bookworm

# Python CI (single matrix entry)
act push -W .github/workflows/ci.yml -j python \
  --matrix python-version:3.13 \
  --container-daemon-socket '-' \
  -P ubuntu-latest=catthehacker/ubuntu:act-latest
```

Key flags:
- `--container-daemon-socket '-'` — required for Colima (disables docker socket bind mount).
- `-P ubuntu-latest=<image>` — TypeScript needs `node:*-bookworm`, Python needs `catthehacker/ubuntu:act-latest`.

### READMEs

Three separate READMEs, each optimized for its platform:
- `README.md` (root) — GitHub repo page. Uses HTML (`<details>`) for collapsed setup guides.
- `typescript/README.md` — npmjs.com package page. Leads with `npx` install command, absolute GitHub links.
- `python/README.pypi.md` — PyPI package page. Pure markdown (no HTML — PyPI strips it), leads with `pip install`, absolute GitHub links.

## Conventions

- **TypeScript**: ESM, strict mode, Node16 module resolution, ES2022 target.
- **Python**: Python ≥3.10, ruff rules `E,F,I,UP,B,SIM`, line-length 100.
- Both packages share version `1.0.0` — bump together.
- `server.json` must list all 28 tools and stay in sync with the remote server.

## Testing

- TypeScript: `vitest` — tests in `src/*.test.ts`.
- Python: `pytest` + `pytest-asyncio` — tests in `tests/`.
- Tests cover: env var validation, remote URL correctness, entry point callability. These are thin clients so tests focus on configuration correctness, not business logic.

## Key Files to Watch

| Change | Update |
|--------|--------|
| New/removed MCP tool on server | `server.json`, `docs/TOOLS.md`, `docs/AGENTS.md` |
| Version bump | `package.json`, `pyproject.toml`, `python/banksync_mcp/__init__.py`, both `CHANGELOG.md` files, `server.json` |
| Remote URL change | `typescript/src/index.ts`, `python/banksync_mcp/server.py` |
| Auth header change | Same as above |
| CI/CD changes | `.github/workflows/*.yml`, this `AGENTS.md` |

## Maintenance Rules

When making changes to this repo:

1. **Run checks before finishing** — `pnpm check` (TS) and `uv run pytest && uv run ruff check .` (Python).
2. **Update changelogs** — Add entries to the relevant `CHANGELOG.md` under an `[Unreleased]` section. Follow Keep a Changelog format.
3. **Keep docs in sync** — If tools, architecture, or workflows change, update `docs/TOOLS.md`, `docs/ARCHITECTURE.md`, `docs/AGENTS.md`, and `server.json` accordingly.
4. **Keep this file accurate** — If repo structure, commands, or conventions change, update this `AGENTS.md`.
