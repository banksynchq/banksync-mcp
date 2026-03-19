# Changelog

All notable changes to `@banksync/mcp` will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/) and follows [Keep a Changelog](https://keepachangelog.com/).

## [1.0.0] - 2025-03-04

### Added

- Initial release of the BankSync MCP thin client for Node.js.
- Stdio-to-HTTP bridge via `mcp-remote` connecting to `https://mcp.banksync.io`.
- `BANKSYNC_API_KEY` environment variable validation with developer-facing error messages.
- CLI binary (`banksync-mcp`) for direct invocation from MCP client configs.
- 28 tools exposed via remote MCP server: workspace, bank, account, data, feed, job, and schema management.
- ESM package with TypeScript declarations.

### Dev Tooling

- **pnpm** for dependency management.
- **vitest** for testing.
- **oxlint** for linting.
- **tsc** for type checking.
- `pnpm check` runs lint + typecheck + test in one command.

[1.0.0]: https://github.com/banksynchq/banksync-mcp/releases/tag/v1.0.0
