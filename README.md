# BankSync MCP Server

[![npm version](https://img.shields.io/npm/v/@banksync/mcp)](https://www.npmjs.com/package/@banksync/mcp)
[![PyPI version](https://img.shields.io/pypi/v/banksync-mcp)](https://pypi.org/project/banksync-mcp/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Connect AI agents to bank accounts, transactions, balances, and investment data. Sync financial data to Notion, Google Sheets, and Airtable.

<a href="https://banksync.io">
  <img src="https://banksync.io/logo.png" alt="BankSync" width="120" />
</a>

## Quick Start

### Prerequisites

Get your API key at [banksync.io/developers](https://banksync.io/developers).

### npx (Node.js)

```bash
BANKSYNC_API_KEY=your-key npx -y @banksync/mcp
```

### pip (Python)

```bash
pip install banksync-mcp
BANKSYNC_API_KEY=your-key banksync-mcp
```

### Remote (no install)

BankSync MCP runs as a remote server — connect directly without installing anything:

```
URL: https://mcp.banksync.io
Transport: Streamable HTTP
Header: X-API-Key: your-key
```

---

## Client Configuration

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "banksync": {
      "command": "npx",
      "args": ["-y", "@banksync/mcp"],
      "env": {
        "BANKSYNC_API_KEY": "your-key"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add banksync -- npx -y @banksync/mcp
```

Then set the environment variable:

```bash
export BANKSYNC_API_KEY=your-key
```

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "banksync": {
      "command": "npx",
      "args": ["-y", "@banksync/mcp"],
      "env": {
        "BANKSYNC_API_KEY": "your-key"
      }
    }
  }
}
```

### VS Code

Add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "banksync": {
      "command": "npx",
      "args": ["-y", "@banksync/mcp"],
      "env": {
        "BANKSYNC_API_KEY": "your-key"
      }
    }
  }
}
```

### ChatGPT

Use the remote server URL directly:

```
URL: https://mcp.banksync.io
Transport: Streamable HTTP
Authentication: API Key header (X-API-Key)
```

---

## Tools Reference

### Discovery

| Tool | Description |
|------|-------------|
| `get_data_type_schema` | Get available source fields for a data type — use before building field mappings |
| `list_feed_sources` | List supported feed source types and their data type combinations |

### Workspace

| Tool | Description |
|------|-------------|
| `list_workspaces` | List all workspaces the authenticated user belongs to |
| `get_workspace` | Get workspace name, subscription plan, and settings |
| `list_integrations` | List connected destination integrations (Notion, Google Sheets, Airtable) |
| `delete_integration` | Remove a destination integration from a workspace |

### Banks

| Tool | Description |
|------|-------------|
| `list_banks` | List connected bank/institution connections for a workspace |
| `get_bank` | Get a bank connection and its live accounts from the institution |
| `create_bank_link` | Initiate a new bank connection — returns an authorization URL |
| `connect_bank` | Complete a Plaid bank connection with a public_token |
| `delete_bank` | Remove a bank connection from a workspace |

### Accounts

| Tool | Description |
|------|-------------|
| `list_accounts` | Fetch live accounts for a bank connection directly from the institution |
| `get_account` | Fetch a single account's current details from the institution |

### Financial Data

| Tool | Description |
|------|-------------|
| `get_transactions` | Fetch bank transactions with date range or incremental cursor sync |
| `get_balance` | Fetch the current live balance for an account |
| `get_holdings` | Get current investment holdings (positions, quantities, market values) |
| `get_trades` | Get investment transactions (buys, sells, dividends) over a date range |
| `get_loan` | Get loan details (outstanding balance, interest rate, next payment) |

### Feeds (Data Pipelines)

| Tool | Description |
|------|-------------|
| `list_feeds` | List all data pipeline feeds in a workspace |
| `get_feed` | Get full configuration and status of a feed pipeline |
| `create_feed` | Create a new data pipeline feed |
| `update_feed` | Update a feed's configuration or schedule |
| `validate_feed` | Pre-flight validate a feed configuration without creating it |
| `delete_feed` | Permanently delete a feed and its job history |

### Jobs (Sync Execution)

| Tool | Description |
|------|-------------|
| `list_jobs` | List sync job history for a feed |
| `get_job` | Get status and progress of a specific sync job |
| `trigger_sync` | Queue a new sync job for a feed |
| `cancel_job` | Cancel a queued or in-progress sync job |

---

## Authentication

All requests require a BankSync API key. Pass it via the `BANKSYNC_API_KEY` environment variable.

The npm and PyPI packages automatically forward the key as an `X-API-Key` header to the remote server.

If connecting directly to the remote endpoint, include the header yourself:

```bash
curl -X POST https://mcp.banksync.io \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-key" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

---

## Typical Workflow

1. `list_workspaces` — find your workspace ID
2. `list_banks` — see connected bank accounts
3. `list_accounts` — discover accounts within a bank
4. `get_transactions` — fetch transaction data
5. `list_integrations` — find your Notion/Sheets/Airtable connection
6. `get_data_type_schema` — discover available field mappings
7. `create_feed` — set up an automated data pipeline
8. `trigger_sync` — run the pipeline

---

## Links

- [BankSync Developer Docs](https://banksync.io/developers)
- [BankSync App](https://banksync.io)
- [MCP Protocol Specification](https://modelcontextprotocol.io)

## License

MIT
