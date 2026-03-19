# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in the BankSync MCP server, please report it responsibly.

**Email:** security@banksync.io

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact

We will acknowledge your report within 48 hours and provide a timeline for a fix.

## Security Model

- **API Key Authentication** — All requests require a valid `BANKSYNC_API_KEY`
- **Transport Encryption** — All data is encrypted in transit via TLS
- **No Credential Storage** — BankSync never stores banking credentials; authentication is delegated to Plaid and Basiq
- **Workspace Scoping** — API keys are scoped per workspace; cross-workspace access is not possible
- **Role-Based Access Control** — Four permission levels (viewer, editor, admin, owner)
- **Stateless Transport** — The MCP bridge stores no session data locally

## Thin Client Security

The npm (`@banksync/mcp`) and PyPI (`banksync-mcp`) packages are thin stdio-to-HTTP bridges. They:

1. Validate the `BANKSYNC_API_KEY` environment variable is present
2. Forward MCP messages to `https://mcp.banksync.io` over TLS
3. Contain no business logic, data storage, or credential handling

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | Yes       |
