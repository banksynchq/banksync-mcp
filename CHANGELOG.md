# Changelog

## [v1.0.3] — 2026-04-12

- Fix npx @banksync/mcp resolution and hoisted mcp-remote lookup
- Update manifest and packages for Connectors Directory submission
- Add Claude Desktop Extension (MCPB) bundle
- Fix version test to not hardcode version string
- Fix Smithery badge format
- Fix Smithery badge URL to match published slug
- Update Smithery badge to @banksync/banksync-mcp

## [v1.0.2] — 2026-03-19

- Shorten server.json description to meet registry 100-char limit
- Add auto-release workflow and unified CHANGELOG

## [v1.0.1] — 2026-03-19

- Add MCP Registry metadata (`<!-- mcp-name -->` comment) to PyPI README for official registry verification
- Update `server.json` to schema version `2025-12-11` with `isSecret`, `runtimeHint`, `remotes` fields
- Bump version to 1.0.1 across all packages

## [v1.0.0] — 2026-03-04

- Initial release — BankSync MCP server packages
- TypeScript thin client (`@banksync/mcp` on npm)
- Python thin client (`banksync-mcp` on PyPI)
- 28 MCP tools across 7 categories
- Remote server at `https://mcp.banksync.io`
- Setup guides for Claude Desktop, Claude Code, Cursor, VS Code, Windsurf, Warp, ChatGPT, Notion
