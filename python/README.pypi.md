# banksync-mcp

<!-- mcp-name: io.banksync/mcp -->

[![PyPI version](https://img.shields.io/pypi/v/banksync-mcp)](https://pypi.org/project/banksync-mcp/)
[![Python](https://img.shields.io/pypi/pyversions/banksync-mcp)](https://pypi.org/project/banksync-mcp/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/banksynchq/banksync-mcp/blob/main/LICENSE)

Connect AI agents to real bank accounts — transactions, balances, investments, and loans — across 15,000+ financial institutions.

`banksync-mcp` is a [Model Context Protocol](https://modelcontextprotocol.io) server with **28 tools** that gives Claude, ChatGPT, Cursor, VS Code, and other AI agents secure access to your financial data. Sync to Notion, Google Sheets, and Airtable — all through conversation.

## Installation

```bash
pip install banksync-mcp
```

Or with [uv](https://docs.astral.sh/uv/):

```bash
uv pip install banksync-mcp
```

Requires Python 3.10+ and a `BANKSYNC_API_KEY` environment variable. Get your API key at [banksync.io/developers](https://banksync.io/developers).

## Quick Start

```bash
export BANKSYNC_API_KEY=your-key
banksync-mcp
```

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "banksync": {
      "command": "banksync-mcp",
      "env": {
        "BANKSYNC_API_KEY": "your-key"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add banksync -e BANKSYNC_API_KEY=your-key -- banksync-mcp
```

### Cursor / VS Code / Windsurf

```json
{
  "mcpServers": {
    "banksync": {
      "command": "banksync-mcp",
      "env": {
        "BANKSYNC_API_KEY": "your-key"
      }
    }
  }
}
```

> For clients that support remote MCP servers, you can connect directly to `https://mcp.banksync.io` with an `X-API-Key` header instead. See [setup guides](https://banksync.io/developers/mcp-setup).

## Usage

Ask your AI agent:

- *"What were my biggest expenses last month?"*
- *"How much do I have across all my accounts?"*
- *"Sync my transactions to Notion every week"*
- *"Show my investment portfolio performance"*
- *"What's my outstanding loan balance?"*

## Tools

28 tools across 7 categories:

| Category | Tools |
|----------|-------|
| **Discovery** | `get_data_type_schema`, `list_feed_sources` |
| **Workspace** | `list_workspaces`, `get_workspace`, `list_integrations`, `delete_integration` |
| **Banks** | `list_banks`, `get_bank`, `create_bank_link`, `connect_bank`, `delete_bank` |
| **Accounts** | `list_accounts`, `get_account` |
| **Financial Data** | `get_transactions`, `get_balance`, `get_holdings`, `get_trades`, `get_loan` |
| **Feeds** | `list_feeds`, `get_feed`, `create_feed`, `update_feed`, `validate_feed`, `delete_feed` |
| **Jobs** | `list_jobs`, `get_job`, `trigger_sync`, `cancel_job` |

Full reference: [Tools Documentation](https://github.com/banksynchq/banksync-mcp/blob/main/docs/TOOLS.md)

## Data Sources

| Provider | Coverage | Data Types |
|----------|----------|------------|
| **Plaid** | US, UK, Canada — 12,000+ institutions | Transactions, balances, investments, loans |
| **Basiq** | Australia, New Zealand — 3,000+ institutions | Transactions, balances |
| **Email extraction** | Global | AI-extracted data from forwarded emails |
| **File upload** | Global | AI-extracted data from PDFs, images, documents |

## Sync Destinations

Notion, Google Sheets, and Airtable — with automated scheduling (daily, weekly, monthly).

## How It Works

This package is a thin stdio-to-HTTP bridge. It validates your API key and forwards MCP messages to `https://mcp.banksync.io` using the [mcp](https://pypi.org/project/mcp/) SDK's async streamable HTTP transport. No financial data is stored locally.

## Security

- API key authentication scoped per workspace
- All data encrypted in transit (TLS)
- Role-based permissions (owner/admin/editor/viewer)
- Banking credentials delegated to Plaid/Basiq — never stored by BankSync
- Stateless MCP transport — no session data persisted

## Documentation

- [Setup Guides](https://banksync.io/developers/mcp-setup) — Per-client installation
- [Tools Reference](https://github.com/banksynchq/banksync-mcp/blob/main/docs/TOOLS.md) — All 28 tools with parameters
- [Architecture](https://github.com/banksynchq/banksync-mcp/blob/main/docs/ARCHITECTURE.md) — Transport and deployment details
- [Agent Guide](https://github.com/banksynchq/banksync-mcp/blob/main/docs/AGENTS.md) — Best practices for AI agent integration
- [API Documentation](https://banksync.io/developers) — Full developer docs

## License

MIT — see [LICENSE](https://github.com/banksynchq/banksync-mcp/blob/main/LICENSE).
