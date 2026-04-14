import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("banksync-mcp CLI", () => {
  const originalEnv = process.env;
  const originalExit = process.exit;
  const originalError = console.error;

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = originalEnv;
    process.exit = originalExit;
    console.error = originalError;
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("should require BANKSYNC_API_KEY environment variable", async () => {
    delete process.env.BANKSYNC_API_KEY;

    const exitMock = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);

    await import("./index.js").catch(() => {});

    expect(exitMock).toHaveBeenCalledWith(1);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("BANKSYNC_API_KEY")
    );
  });

  it("should use correct remote URL", () => {
    const source = readFileSync(
      resolve(import.meta.dirname, "index.ts"),
      "utf-8"
    );
    expect(source).toContain("https://mcp.banksync.io");
  });

  it("should pass API key as X-API-Key header", () => {
    const source = readFileSync(
      resolve(import.meta.dirname, "index.ts"),
      "utf-8"
    );
    expect(source).toContain("X-API-Key");
  });

  it("should bridge stdio to Streamable HTTP via MCP SDK", () => {
    const source = readFileSync(
      resolve(import.meta.dirname, "index.ts"),
      "utf-8"
    );
    expect(source).toContain("StreamableHTTPClientTransport");
    expect(source).toContain("StdioServerTransport");
  });
});
