# BankSync MCP Server

[![npm version](https://img.shields.io/npm/v/@banksync/mcp)](https://www.npmjs.com/package/@banksync/mcp)
[![PyPI version](https://img.shields.io/pypi/v/banksync-mcp)](https://pypi.org/project/banksync-mcp/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Smithery](https://smithery.ai/badge/@banksync/banksync-mcp)](https://smithery.ai/server/banksync/banksync-mcp)
[![Install with NPX in VS Code](https://img.shields.io/badge/VS_Code-NPX-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=banksync&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40banksync%2Fmcp%22%5D%2C%22env%22%3A%7B%22BANKSYNC_API_KEY%22%3A%22your-key%22%7D%7D)

Talk to your bank data. Connect AI agents to real bank accounts — transactions, balances, investments, and loans — across 15,000+ financial institutions.

BankSync MCP is an open [Model Context Protocol](https://modelcontextprotocol.io) server with **28 tools** that gives Claude, ChatGPT, Cursor, VS Code, and other AI agents secure, read-write access to your financial data. Sync to Notion, Google Sheets, and Airtable — all through conversation.

<!-- mcp-name: io.banksync/mcp -->

<p>
  <a href="https://banksync.io/product/mcp">Website</a> ·
  <a href="https://banksync.io/developers">Docs</a> ·
  <a href="https://banksync.io/developers/mcp-setup">Setup Guides</a> ·
  <a href="#quick-start">Quick Start</a> ·
  <a href="docs/TOOLS.md">Tools Reference</a>
</p>

---

## Quick Start

Get your API key at [banksync.io/developers](https://banksync.io/developers). BankSync runs as a remote MCP server — no install required:

```
URL:       https://mcp.banksync.io
Transport: Streamable HTTP
Header:    X-API-Key: your-key
```

## Setup

<details>
<summary><strong>Claude Desktop</strong></summary>

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "banksync": {
      "type": "http",
      "url": "https://mcp.banksync.io",
      "headers": {
        "X-API-Key": "your-key"
      }
    }
  }
}
```

</details>

<details>
<summary><strong>Claude Code</strong></summary>

```bash
claude mcp add --transport http banksync https://mcp.banksync.io \
  --header "X-API-Key: your-key"
```

</details>

<details>
<summary><strong>Cursor</strong></summary>

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "banksync": {
      "url": "https://mcp.banksync.io",
      "headers": {
        "X-API-Key": "your-key"
      }
    }
  }
}
```

</details>

<details>
<summary><strong>VS Code (Copilot)</strong></summary>

Add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "banksync": {
      "type": "http",
      "url": "https://mcp.banksync.io",
      "headers": {
        "X-API-Key": "your-key"
      }
    }
  }
}
```

</details>

<details>
<summary><strong>Windsurf</strong></summary>

Add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "banksync": {
      "serverUrl": "https://mcp.banksync.io",
      "headers": {
        "X-API-Key": "your-key"
      }
    }
  }
}
```

</details>

<details>
<summary><strong>npm package (stdio fallback)</strong></summary>

For clients that don't support remote HTTP servers, use the npm package as a local bridge:

```bash
npx -y @banksync/mcp              # Node.js
pip install banksync-mcp && banksync-mcp  # Python
```

Set `BANKSYNC_API_KEY=your-key` as an environment variable. The package bridges stdio to `https://mcp.banksync.io` automatically.

Example config (any stdio client):

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

</details>

> Setup guides for all clients: [banksync.io/developers/mcp-setup](https://banksync.io/developers/mcp-setup)

## What You Can Do

Ask your AI agent questions like:

- *"What were my biggest expenses last month?"*
- *"How much do I have across all my accounts?"*
- *"Show my investment portfolio performance"*
- *"Sync my transactions to Notion every week"*
- *"What's my outstanding loan balance?"*

## Tools

28 tools across 7 categories. Full reference with parameters and examples: **[docs/TOOLS.md](docs/TOOLS.md)**

| Category | Tools | What They Do |
|----------|-------|-------------|
| **Discovery** | `get_data_type_schema`, `list_feed_sources` | Discover available fields and feed source types |
| **Workspace** | `list_workspaces`, `get_workspace`, `list_integrations`, `delete_integration` | Manage workspaces and connected destinations |
| **Banks** | `list_banks`, `get_bank`, `create_bank_link`, `connect_bank`, `delete_bank` | Connect and manage bank connections |
| **Accounts** | `list_accounts`, `get_account` | Fetch live account data from institutions |
| **Financial Data** | `get_transactions`, `get_balance`, `get_holdings`, `get_trades`, `get_loan` | Query transactions, balances, investments, loans |
| **Feeds** | `list_feeds`, `get_feed`, `create_feed`, `update_feed`, `validate_feed`, `delete_feed` | Build automated data pipelines |
| **Jobs** | `list_jobs`, `get_job`, `trigger_sync`, `cancel_job` | Run and monitor sync jobs |

## How It Works

```
AI Agent (Claude, ChatGPT, Cursor, ...)
    ↓ Streamable HTTP
mcp.banksync.io (Cloudflare Workers)
    ↓ Bank APIs
Plaid (US/UK/CA) · Basiq (AU/NZ)
    ↓ Sync
Notion · Google Sheets · Airtable
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for details.

## Typical Workflow

```
1. list_workspaces          → find your workspace
2. list_banks               → see connected banks
3. list_accounts            → discover accounts
4. get_transactions         → fetch financial data
5. list_integrations        → find your Notion/Sheets connection
6. get_data_type_schema     → discover available field mappings
7. create_feed              → set up an automated pipeline
8. trigger_sync             → run it
```

## Data Sources

| Provider | Coverage | Data Types |
|----------|----------|------------|
| **Plaid** | US, UK, Canada — 12,000+ institutions | Transactions, balances, investments, loans |
| **Basiq** | Australia, New Zealand — 3,000+ institutions | Transactions, balances |
| **Email extraction** | Global | AI-extracted structured data from forwarded emails |
| **File upload** | Global | AI-extracted data from PDFs, images, documents |

## Sync Destinations

| Destination | Capabilities |
|-------------|-------------|
| **Notion** | Sync to Notion databases |
| **Google Sheets** | Sync to spreadsheets (row or column direction) |
| **Airtable** | Sync to Airtable tables |

## Security

- API key authentication — keys scoped per workspace
- All data encrypted in transit (TLS)
- Role-based permissions (owner/admin/editor/viewer)
- BankSync never stores banking credentials — delegated to Plaid/Basiq
- Stateless MCP transport — no session data persisted

See [SECURITY.md](SECURITY.md) for our security policy and vulnerability reporting.

## Debugging

Use the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) to test and debug the server:

```bash
BANKSYNC_API_KEY=your-key npx @modelcontextprotocol/inspector npx -y @banksync/mcp
```

Or connect the inspector directly to the remote server:

```bash
npx @modelcontextprotocol/inspector --url https://mcp.banksync.io --header "X-API-Key: your-key"
```

## Documentation

| Doc | Description |
|-----|-------------|
| **[docs/TOOLS.md](docs/TOOLS.md)** | Complete tools reference with parameters and examples |
| **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** | Architecture, transport, and deployment details |
| **[docs/AGENTS.md](docs/AGENTS.md)** | Guide for AI agents: best practices, prompt patterns, workflows |
| **[CLAUDE.md](CLAUDE.md)** | Context for AI coding assistants working on this repo |
| **[SECURITY.md](SECURITY.md)** | Security policy and vulnerability reporting |
| **[banksync.io/developers](https://banksync.io/developers)** | Full API documentation |
| **[banksync.io/developers/mcp-setup](https://banksync.io/developers/mcp-setup)** | Per-client setup guides |

## License

MIT — see [LICENSE](LICENSE).
