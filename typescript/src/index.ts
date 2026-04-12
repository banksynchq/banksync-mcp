#!/usr/bin/env node

import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";

const REMOTE_URL = "https://mcp.banksync.io";

const apiKey = process.env.BANKSYNC_API_KEY;
if (!apiKey) {
  console.error(
    "Error: BANKSYNC_API_KEY environment variable is required.\n" +
      "Get your API key at https://banksync.io/developers"
  );
  process.exit(1);
}

const require = createRequire(import.meta.url);
const pkgJsonPath = require.resolve("mcp-remote/package.json");
const { bin } = require("mcp-remote/package.json") as {
  bin: string | Record<string, string>;
};
const binRel = typeof bin === "string" ? bin : bin["mcp-remote"];
if (!binRel) {
  console.error("Failed to locate mcp-remote executable in its package.json");
  process.exit(1);
}
const mcpRemoteBin = resolve(dirname(pkgJsonPath), binRel);

const child = spawn(
  process.execPath,
  [mcpRemoteBin, REMOTE_URL, "--header", `X-API-Key:${apiKey}`],
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
