#!/usr/bin/env node

import { spawn } from "node:child_process";
import { resolve } from "node:path";

const REMOTE_URL = "https://mcp.banksync.io";

const apiKey = process.env.BANKSYNC_API_KEY;
if (!apiKey) {
  console.error(
    "Error: BANKSYNC_API_KEY environment variable is required.\n" +
      "Get your API key at https://banksync.io/developers"
  );
  process.exit(1);
}

const mcpRemoteBin = resolve(
  import.meta.dirname,
  "..",
  "node_modules",
  ".bin",
  "mcp-remote"
);

const child = spawn(
  mcpRemoteBin,
  [REMOTE_URL, "--header", `X-API-Key:${apiKey}`],
  {
    stdio: "inherit",
    env: process.env,
  }
);

child.on("exit", (code) => process.exit(code ?? 0));
child.on("error", (err) => {
  console.error(`Failed to start mcp-remote: ${err.message}`);
  process.exit(1);
});
