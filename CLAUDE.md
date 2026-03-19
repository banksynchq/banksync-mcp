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

1. Bump version in `typescript/package.json`, `python/pyproject.toml`, and `server.json`
2. `cd typescript && npm publish --access public`
3. `cd python && python -m build && twine upload dist/*`
4. `mcp-publisher publish` (updates official MCP Registry)
