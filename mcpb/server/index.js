#!/usr/bin/env node

import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const REMOTE_URL = "https://mcp.banksync.io";

const apiKey = process.env.BANKSYNC_API_KEY;
if (!apiKey) {
  console.error(
    "Error: BANKSYNC_API_KEY environment variable is required.\n" +
      "Get your API key at https://banksync.io/developers"
  );
  process.exit(1);
}

const remote = new StreamableHTTPClientTransport(new URL(REMOTE_URL), {
  requestInit: { headers: { "X-API-Key": apiKey } },
});
const local = new StdioServerTransport();

local.onmessage = (msg) => {
  remote.send(msg).catch((err) => {
    console.error(`[banksync-mcp] remote.send failed: ${err.message}`);
  });
};
remote.onmessage = (msg) => {
  local.send(msg).catch((err) => {
    console.error(`[banksync-mcp] local.send failed: ${err.message}`);
  });
};

const shutdown = async () => {
  await Promise.allSettled([local.close(), remote.close()]);
  process.exit(0);
};
local.onclose = shutdown;
remote.onclose = shutdown;
local.onerror = (err) => console.error(`[banksync-mcp] local error: ${err.message}`);
remote.onerror = (err) => {
  // The SDK attempts an optional GET-based SSE listener per MCP spec;
  // the BankSync server doesn't expose it. Swallow its retry chatter.
  const msg = err.message || "";
  if (
    msg.includes("Failed to open SSE stream") ||
    msg.includes("Maximum reconnection attempts")
  )
    return;
  console.error(`[banksync-mcp] remote error: ${msg}`);
};

try {
  await remote.start();
  await local.start();
} catch (err) {
  console.error(`[banksync-mcp] startup failed: ${err.message}`);
  process.exit(1);
}
