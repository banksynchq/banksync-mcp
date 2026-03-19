# BankSync MCP — Tools Reference

Complete reference for all 28 tools available through the BankSync MCP server. Each tool is callable by any MCP-compatible AI agent (Claude, ChatGPT, Cursor, VS Code, Windsurf, Warp, Notion).

## Tool Annotations

Each tool carries MCP [tool annotations](https://modelcontextprotocol.io/specification/2025-03-26/server/tools#annotations) to help clients understand behavior:

| Tool | Read-Only | Idempotent | Destructive |
|------|-----------|------------|-------------|
| `get_data_type_schema` | yes | yes | no |
| `list_feed_sources` | yes | yes | no |
| `list_workspaces` | yes | yes | no |
| `get_workspace` | yes | yes | no |
| `list_integrations` | yes | yes | no |
| `delete_integration` | no | no | **yes** |
| `list_banks` | yes | yes | no |
| `get_bank` | yes | yes | no |
| `create_bank_link` | no | no | no |
| `connect_bank` | no | no | no |
| `delete_bank` | no | no | **yes** |
| `list_accounts` | yes | yes | no |
| `get_account` | yes | yes | no |
| `get_transactions` | yes | yes | no |
| `get_balance` | yes | yes | no |
| `get_holdings` | yes | yes | no |
| `get_trades` | yes | yes | no |
| `get_loan` | yes | yes | no |
| `list_feeds` | yes | yes | no |
| `get_feed` | yes | yes | no |
| `create_feed` | no | no | no |
| `update_feed` | no | no | no |
| `validate_feed` | yes | yes | no |
| `delete_feed` | no | no | **yes** |
| `list_jobs` | yes | yes | no |
| `get_job` | yes | yes | no |
| `trigger_sync` | no | no | no |
| `cancel_job` | no | no | no |

---

## Discovery

### `get_data_type_schema`

Get available source fields for a data type. Use this before building field mappings for feeds.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | yes | Workspace ID |
| `dataType` | string | yes | One of: `transactions`, `balances`, `trades`, `holdings`, `loans`, `receipts`, `invoices`, `documents` |

**Example prompt:** *"What fields are available for transaction data?"*

### `list_feed_sources`

List supported feed source types and their data type combinations.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | yes | Workspace ID |

**Example prompt:** *"What feed source types can I use?"*

---

## Workspace

### `list_workspaces`

List all workspaces the authenticated user belongs to.

*No parameters required.*

**Example prompt:** *"Show me my workspaces."*

### `get_workspace`

Get workspace name, subscription plan, and settings.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | yes | Workspace ID |

### `list_integrations`

List connected destination integrations (Notion, Google Sheets, Airtable) for a workspace.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | yes | Workspace ID |

**Example prompt:** *"What destinations do I have connected?"*

### `delete_integration`

Remove a destination integration from a workspace.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | yes | Workspace ID |
| `integrationId` | string | yes | Integration ID to remove |

---

## Banks

### `list_banks`

List connected bank/institution connections for a workspace.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | yes | Workspace ID |

**Example prompt:** *"Which banks do I have connected?"*

### `get_bank`

Get a bank connection and its live accounts from the institution.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | yes | Workspace ID |
| `bankId` | string | yes | Bank connection ID |

### `create_bank_link`

Initiate a new bank connection. Returns an authorization URL the user must visit to authenticate with their bank.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | yes | Workspace ID |
| `provider` | string | no | `plaid` or `basiq` (defaults based on workspace region) |

**Example prompt:** *"Connect a new bank account."*

### `connect_bank`

Complete a Plaid bank connection using the public_token received after authorization.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | yes | Workspace ID |
| `publicToken` | string | yes | Plaid public token from Link |
| `institutionId` | string | yes | Plaid institution ID |
| `institutionName` | string | yes | Institution display name |

### `delete_bank`

Remove a bank connection from a workspace.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | yes | Workspace ID |
| `bankId` | string | yes | Bank connection ID |

---

## Accounts

### `list_accounts`

Fetch live accounts for a bank connection directly from the institution.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | yes | Workspace ID |
| `bankId` | string | yes | Bank connection ID |

**Example prompt:** *"Show me all accounts from my Chase connection."*

### `get_account`

Fetch a single account's current details from the institution.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | yes | Workspace ID |
| `bankId` | string | yes | Bank connection ID |
| `accountId` | string | yes | Account ID |

---

## Financial Data

### `get_transactions`

Fetch bank transactions with date range filtering or incremental cursor-based sync.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | yes | Workspace ID |
| `bankId` | string | yes | Bank connection ID |
| `accountId` | string | yes | Account ID |
| `startDate` | string | no | Start date (YYYY-MM-DD) |
| `endDate` | string | no | End date (YYYY-MM-DD) |
| `cursor` | string | no | Pagination cursor for incremental sync |

**Example prompt:** *"What were my biggest expenses last month?"*

### `get_balance`

Fetch the current live balance for an account.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | yes | Workspace ID |
| `bankId` | string | yes | Bank connection ID |
| `accountId` | string | yes | Account ID |

**Example prompt:** *"How much money is in my checking account?"*

### `get_holdings`

Get current investment holdings — positions, quantities, and market values.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | yes | Workspace ID |
| `bankId` | string | yes | Bank connection ID |
| `accountId` | string | yes | Investment account ID |

**Example prompt:** *"Show my investment portfolio."*

### `get_trades`

Get investment transactions (buys, sells, dividends) over a date range.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | yes | Workspace ID |
| `bankId` | string | yes | Bank connection ID |
| `accountId` | string | yes | Investment account ID |
| `startDate` | string | no | Start date (YYYY-MM-DD) |
| `endDate` | string | no | End date (YYYY-MM-DD) |

**Example prompt:** *"What trades have I made this quarter?"*

### `get_loan`

Get loan details — outstanding balance, interest rate, next payment date.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | yes | Workspace ID |
| `bankId` | string | yes | Bank connection ID |
| `accountId` | string | yes | Loan/liability account ID |

**Example prompt:** *"What's my mortgage balance and interest rate?"*

---

## Feeds (Data Pipelines)

Feeds are automated pipelines that sync financial data from a source (bank account, email, file upload) to a destination (Notion, Google Sheets, Airtable).

### `list_feeds`

List all data pipeline feeds in a workspace.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | yes | Workspace ID |

### `get_feed`

Get full configuration and status of a feed pipeline.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | yes | Workspace ID |
| `feedId` | string | yes | Feed ID |

### `create_feed`

Create a new data pipeline feed. Use `get_data_type_schema` and `list_feed_sources` first to discover available options.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | yes | Workspace ID |
| `name` | string | yes | Feed display name |
| `source` | object | yes | Source configuration (type, bankId, accountId, dataType) |
| `destination` | object | yes | Destination configuration (type, integrationId, config) |
| `fieldMappings` | array | yes | Array of source-to-destination field mappings |
| `schedule` | object | no | Automated sync schedule |

**Example prompt:** *"Create a feed that syncs my Chase transactions to Notion every week."*

### `update_feed`

Update a feed's configuration or schedule. Source type and data type are immutable after creation.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | yes | Workspace ID |
| `feedId` | string | yes | Feed ID |
| `name` | string | no | Updated name |
| `destination` | object | no | Updated destination config |
| `fieldMappings` | array | no | Updated field mappings |
| `schedule` | object | no | Updated schedule |

### `validate_feed`

Pre-flight validate a feed configuration without creating it. Returns validation errors if any.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | yes | Workspace ID |
| *(same as create_feed)* | | | |

### `delete_feed`

Permanently delete a feed and its job history.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | yes | Workspace ID |
| `feedId` | string | yes | Feed ID |

---

## Jobs (Sync Execution)

Jobs represent individual sync runs for a feed.

### `list_jobs`

List sync job history for a feed.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | yes | Workspace ID |
| `feedId` | string | yes | Feed ID |

### `get_job`

Get status and progress of a specific sync job.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | yes | Workspace ID |
| `feedId` | string | yes | Feed ID |
| `jobId` | string | yes | Job ID |

### `trigger_sync`

Queue a new sync job for a feed.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | yes | Workspace ID |
| `feedId` | string | yes | Feed ID |

**Example prompt:** *"Run my transaction sync now."*

### `cancel_job`

Cancel a queued or in-progress sync job.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceId` | string | yes | Workspace ID |
| `feedId` | string | yes | Feed ID |
| `jobId` | string | yes | Job ID |
