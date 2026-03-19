# BankSync MCP — Architecture

## Overview

BankSync MCP follows a **thin client + remote server** architecture. The npm and PyPI packages are lightweight bridges that forward MCP messages to the hosted server at `mcp.banksync.io`.

```
┌─────────────────────────────┐
│  AI Client                  │
│  (Claude, ChatGPT, Cursor,  │
│   VS Code, Windsurf, etc.)  │
└──────────┬──────────────────┘
           │ MCP Protocol (stdio)
           ▼
┌─────────────────────────────┐
│  @banksync/mcp              │
│  (npm / PyPI thin client)   │
│                             │
│  - Validates BANKSYNC_API_KEY│
│  - Bridges stdio ↔ HTTP    │
│  - Zero business logic      │
└──────────┬──────────────────┘
           │ Streamable HTTP
           │ Header: X-API-Key
           ▼
┌─────────────────────────────┐
│  mcp.banksync.io            │
│  (Cloudflare Workers)       │
│                             │
│  - MCP server (28 tools)    │
│  - Auth + RBAC middleware   │
│  - CORS enabled             │
│  - Health check endpoint    │
└──────────┬──────────────────┘
           │ Internal APIs
           ▼
┌─────────────────────────────┐
│  BankSync Platform          │
│                             │
│  ┌─────────┐ ┌───────────┐  │
│  │ US/UK/CA│ │ AU/NZ     │  │
│  └────┬────┘ └─────┬─────┘  │
│       │             │       │
│  ┌────▼─────────────▼────┐  │
│  │  Firestore (data)     │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │  Destination Syncs    │  │
│  │  Notion · Sheets ·    │  │
│  │  Airtable             │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

## Transport

### Client → Thin Client (stdio)

MCP clients communicate with the local package via **stdio** (standard input/output). The client spawns the `banksync-mcp` process, sends JSON-RPC messages over stdin, and reads responses from stdout.

### Thin Client → Remote Server (Streamable HTTP)

The thin client bridges stdio to HTTP using `mcp-remote` (Node.js) or the MCP SDK's built-in HTTP transport (Python). All requests go to:

```
POST https://mcp.banksync.io
Content-Type: application/json
X-API-Key: <BANKSYNC_API_KEY>
```

### Direct Remote Connection

Clients that support remote MCP servers (ChatGPT, some IDE configurations) can connect directly to `https://mcp.banksync.io` without installing the thin client.

## Authentication & Authorization

1. **API Key Validation** — Every request requires a valid `X-API-Key` header
2. **Workspace Scoping** — Keys are scoped to workspaces; users can only access their own data
3. **Role-Based Access Control** — Four roles with escalating permissions:
   - **Viewer** — Read-only access to data and feeds
   - **Editor** — Create/update feeds, trigger syncs
   - **Admin** — Manage integrations and bank connections
   - **Owner** — Full control including workspace settings and member management

## Thin Client Implementation

### Node.js (`@banksync/mcp`)

- Entry point: `typescript/src/index.ts`
- Validates `BANKSYNC_API_KEY` is set
- Spawns `mcp-remote` as a child process
- Forwards stdio to `https://mcp.banksync.io` with the API key header
- Published as an ESM package with a `banksync-mcp` CLI binary

### Python (`banksync-mcp`)

- Entry point: `python/banksync_mcp/server.py`
- Validates `BANKSYNC_API_KEY` is set
- Uses the MCP SDK's async stdio and streamable HTTP transports
- Creates a stdio-to-HTTP bridge (stdin → remote → stdout)
- Published on PyPI with a `banksync-mcp` CLI entry point

## Data Flow Example

**User asks:** *"What were my biggest expenses last month?"*

```
1. Claude sends tools/call (get_transactions) → stdio
2. @banksync/mcp forwards → POST https://mcp.banksync.io
3. Server validates API key → resolves workspace
4. Server calls Plaid Transactions Sync API
5. Returns transactions as MCP tool result
6. Claude analyzes and presents top expenses
```
