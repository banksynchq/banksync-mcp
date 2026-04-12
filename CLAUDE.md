# BankSync MCP Server

This is a thin MCP client that bridges stdio to the remote BankSync MCP server at `https://mcp.banksync.io`.

## Repository Structure

```
banksync-mcp/
├── typescript/     # Node.js thin client (@banksync/mcp on npm)
├── python/         # Python thin client (banksync-mcp on PyPI)
├── docs/           # Documentation (TOOLS.md, ARCHITECTURE.md, AGENTS.md)
├── server.json     # MCP Registry metadata
├── smithery.yaml   # Smithery registry config
└── glama.json      # Glama registry metadata
```

## Architecture

Both clients validate `BANKSYNC_API_KEY` then bridge stdio to `https://mcp.banksync.io` via Streamable HTTP. No business logic lives here — everything is handled by the remote server.

- **Node.js**: Spawns `mcp-remote` as a child process
- **Python**: Uses the MCP SDK's async `streamablehttp_client`

## Key Files

- `typescript/src/index.ts` — Node.js entry point (thin client)
- `python/banksync_mcp/server.py` — Python entry point (thin client)
- `server.json` — MCP Registry manifest (schema version 2025-12-11)
- `docs/TOOLS.md` — All 28 tools with parameters
- `docs/AGENTS.md` — Agent integration guide

## Development

```bash
# TypeScript
cd typescript && pnpm install && pnpm build && pnpm check

# Python
cd python && uv sync && uv run ruff check && uv run pytest
```

## Publishing

Publishing is automated by `.github/workflows/release.yml`, which fires on pushes to `main` that touch `server.json`. The workflow tags the new version, creates a GitHub release, then invokes `publish-npm.yml` and `publish-pypi.yml` via `workflow_call` in the same run (this avoids the `GITHUB_TOKEN` cascade-suppression that would otherwise prevent the publish workflows from firing).

To cut a release:

1. On a branch, bump the version in all five places so they stay in sync:
   - `typescript/package.json`
   - `python/pyproject.toml`
   - `server.json` (top-level `version` plus both `packages[].version`)
   - `mcpb/manifest.json`
   - `mcpb/package.json`
2. Open a PR and **rebase-merge** (not squash). Put the bump as the last commit so the previous commit's message ends up in the auto-generated CHANGELOG (`release.yml` runs `git log PREV..HEAD~1`, which excludes the tip commit).
3. Once merged, `release.yml` runs automatically: tags `v<version>`, creates the GitHub release, then publishes to npm and PyPI in the same run. Confirm both via `npm view @banksync/mcp version` and `curl -s https://pypi.org/pypi/banksync-mcp/json | jq -r .info.version`.

Manual follow-up per release:

- **MCP Registry:** `mcp-publisher publish` (not automated).
- **Connectors Directory refresh:** rebuild the bundle locally and upload the generated `.mcpb` (it's gitignored):
  ```bash
  cd mcpb
  rm -f banksync-mcp-*.mcpb
  npx --yes @anthropic-ai/mcpb validate manifest.json
  npx --yes @anthropic-ai/mcpb pack . banksync-mcp-<version>.mcpb
  ```
