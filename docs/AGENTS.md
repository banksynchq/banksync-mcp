# BankSync MCP — Guide for AI Agents

This guide helps AI agents (and their developers) get the most out of the BankSync MCP server. It covers recommended workflows, prompting patterns, and best practices.

## First-Time Setup Flow

When a user connects BankSync for the first time, follow this sequence:

```
1. list_workspaces           → Identify the user's workspace
2. list_banks                → Check if any banks are connected
3. (if none) create_bank_link → Start bank connection flow
4. list_accounts             → Discover available accounts
5. list_integrations         → Check connected destinations (Notion, Sheets, Airtable)
```

If `list_workspaces` returns an empty list, direct the user to [banksync.io](https://banksync.io) to create a workspace first.

## Common Workflows

### Querying Financial Data

**Goal:** Answer questions about the user's finances.

```
1. list_workspaces         → Get workspaceId
2. list_banks              → Get bankId
3. list_accounts           → Get accountId
4. get_transactions        → Fetch data (use startDate/endDate for date ranges)
   OR get_balance          → Current balance
   OR get_holdings         → Investment positions
   OR get_trades           → Investment transactions
   OR get_loan             → Loan details
```

**Tips:**
- Use `get_transactions` with `startDate` and `endDate` for date-bounded queries
- Use the `cursor` parameter for incremental sync (useful for large datasets)
- `get_balance` returns the live balance from the institution, not a cached value

### Setting Up a Data Pipeline

**Goal:** Create an automated sync from bank data to a destination.

```
1. list_workspaces         → Get workspaceId
2. list_integrations       → Find the destination integrationId
3. list_banks              → Find the source bankId
4. list_accounts           → Find the source accountId
5. list_feed_sources       → Discover valid source type + data type combinations
6. get_data_type_schema    → Get available fields for mapping
7. validate_feed           → Pre-flight check before creating
8. create_feed             → Create the pipeline
9. trigger_sync            → Run the first sync
10. get_job                → Monitor progress
```

**Tips:**
- Always call `validate_feed` before `create_feed` to catch configuration errors early
- Feed source type and data type are **immutable** after creation — only destination, field mappings, and schedule can be updated
- Use `get_data_type_schema` to discover which source fields are available before building `fieldMappings`

### Monitoring Syncs

```
1. list_feeds              → Find the feedId
2. list_jobs               → See recent sync history
3. get_job                 → Check status of a specific job
4. trigger_sync            → Manually run a sync
5. cancel_job              → Stop a running sync if needed
```

## Feed Source Types

| Source Type | Description | Data Types |
|-------------|-------------|------------|
| `sync` | Pull structured data from connected bank accounts via Plaid or Basiq | transactions, balances, trades, holdings, loans |
| `extractor` | AI extracts structured data from forwarded emails | receipts, invoices, documents |
| `upload` | AI extracts structured data from uploaded PDFs, images, documents | receipts, invoices, documents |

## Feed Destination Types

| Destination | Config Notes |
|-------------|-------------|
| `notion` | Requires a connected Notion integration. Specify the target database |
| `google_sheets` | Supports both `row` and `column` direction for data layout |
| `airtable` | Requires a connected Airtable integration. Specify the target table |

## Permissions

Different workspace roles have different access levels:

| Action | Viewer | Editor | Admin | Owner |
|--------|--------|--------|-------|-------|
| Read data (transactions, balances, etc.) | Yes | Yes | Yes | Yes |
| List feeds and jobs | Yes | Yes | Yes | Yes |
| Create/update feeds | No | Yes | Yes | Yes |
| Trigger/cancel syncs | No | Yes | Yes | Yes |
| Manage bank connections | No | No | Yes | Yes |
| Manage integrations | No | No | Yes | Yes |
| Workspace settings | No | No | No | Yes |

If a user gets a permission error, check their role with `get_workspace`.

## Error Handling

Common error scenarios and how to handle them:

| Error | Cause | Resolution |
|-------|-------|------------|
| `Invalid API key` | Missing or incorrect `BANKSYNC_API_KEY` | Direct user to [banksync.io/developers](https://banksync.io/developers) to get a key |
| `Workspace not found` | Invalid workspaceId | Call `list_workspaces` to get valid IDs |
| `Bank connection expired` | Bank requires re-authentication | Call `create_bank_link` to re-authorize |
| `Permission denied` | User role insufficient for this action | Check role with `get_workspace` |
| `Rate limit exceeded` | Too many requests | Wait and retry with exponential backoff |
| `Feed validation failed` | Invalid feed configuration | Check error details, fix config, retry `validate_feed` |

## Prompting Best Practices

### For Agent Developers

1. **Start with discovery** — Always call `list_workspaces` first to establish context
2. **Cache workspace and bank IDs** within a conversation — don't re-fetch every turn
3. **Use `get_data_type_schema` before creating feeds** — it tells you exactly what fields are available
4. **Prefer incremental sync** — Use `cursor` with `get_transactions` for efficiency
5. **Validate before creating** — `validate_feed` catches errors before `create_feed`

### For End Users

Example prompts that work well:

**Data queries:**
- *"What were my biggest expenses last month?"*
- *"How much did I spend on restaurants in February?"*
- *"Show me my account balances across all banks"*
- *"What's my investment portfolio allocation?"*
- *"How much do I owe on my student loan?"*

**Pipeline setup:**
- *"Sync my Chase checking transactions to my Notion database"*
- *"Create a weekly sync of my balances to Google Sheets"*
- *"Set up a feed for my investment trades to Airtable"*

**Management:**
- *"Show me all my active syncs"*
- *"When was my last sync and did it succeed?"*
- *"Cancel the currently running sync"*
- *"Connect a new bank account"*

## Rate Limits

- Standard plan: 100 requests/minute
- Pro plan: 500 requests/minute
- Enterprise: Custom limits

Rate limits apply per API key. The MCP server returns standard rate limit headers.

## Supported Institutions

BankSync connects to **15,000+ financial institutions** across:

| Region | Provider | Institutions |
|--------|----------|-------------|
| United States | Plaid | 12,000+ (Chase, Bank of America, Wells Fargo, Citi, Capital One, etc.) |
| United Kingdom | Plaid | Major banks and building societies |
| Canada | Plaid | Major banks |
| Australia | Basiq | 200+ (CBA, ANZ, Westpac, NAB, etc.) |
| New Zealand | Basiq | Major banks |
