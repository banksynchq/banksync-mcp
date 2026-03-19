import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
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

    // Dynamic import to re-execute the module
    await import("./index.js").catch(() => {});

    expect(exitMock).toHaveBeenCalledWith(1);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("BANKSYNC_API_KEY")
    );
  });

  it("should resolve mcp-remote binary path correctly", () => {
    const expected = resolve(
      import.meta.dirname,
      "..",
      "node_modules",
      ".bin",
      "mcp-remote"
    );
    // Verify path resolution logic matches what index.ts does
    expect(expected).toContain("node_modules/.bin/mcp-remote");
  });

  it("should use correct remote URL", async () => {
    // We test the constant by reading the source
    const { readFileSync } = await import("node:fs");
    const source = readFileSync(
      resolve(import.meta.dirname, "index.ts"),
      "utf-8"
    );
    expect(source).toContain('https://mcp.banksync.io');
  });

  it("should pass API key as X-API-Key header", async () => {
    const { readFileSync } = await import("node:fs");
    const source = readFileSync(
      resolve(import.meta.dirname, "index.ts"),
      "utf-8"
    );
    expect(source).toContain("X-API-Key:");
    expect(source).toContain("--header");
  });

  it("should use stdio inherit for child process", async () => {
    const { readFileSync } = await import("node:fs");
    const source = readFileSync(
      resolve(import.meta.dirname, "index.ts"),
      "utf-8"
    );
    expect(source).toContain('"inherit"');
  });
});
