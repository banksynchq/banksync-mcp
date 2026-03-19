# Changelog

All notable changes to `banksync-mcp` will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/) and follows [Keep a Changelog](https://keepachangelog.com/).

## [1.0.0] - 2025-03-04

### Added

- Initial release of the BankSync MCP server for Python.
- Async stdio-to-HTTP bridge using `mcp` SDK's `streamablehttp_client` and `stdio_server`.
- `BANKSYNC_API_KEY` environment variable validation with developer-facing error messages.
- CLI entry point (`banksync-mcp`) registered via `[project.scripts]`.
- Connects to remote MCP server at `https://mcp.banksync.io`.
- Python 3.10–3.13 support.
- Published as `banksync-mcp` on PyPI.

### Dev Tooling

- **uv** for dependency management.
- **pytest** + **pytest-asyncio** for testing.
- **ruff** for linting and formatting (rules: E, F, I, UP, B, SIM).

[1.0.0]: https://github.com/banksynchq/banksync-mcp/releases/tag/v1.0.0
