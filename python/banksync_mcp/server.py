"""
Stdio-to-HTTP bridge for the BankSync MCP server.

Connects to the remote BankSync MCP endpoint at https://mcp.banksync.io
using Streamable HTTP transport and exposes it over stdio for local clients.
"""

import os
import sys

from mcp.client.streamable_http import streamablehttp_client
from mcp.server.stdio import stdio_server
from mcp import ClientSession


REMOTE_URL = "https://mcp.banksync.io"


async def run():
    api_key = os.environ.get("BANKSYNC_API_KEY")
    if not api_key:
        print(
            "Error: BANKSYNC_API_KEY environment variable is required.\n"
            "Get your API key at https://banksync.io/developers",
            file=sys.stderr,
        )
        sys.exit(1)

    headers = {"X-API-Key": api_key}

    async with streamablehttp_client(REMOTE_URL, headers=headers) as (
        read_stream,
        write_stream,
        _,
    ):
        async with ClientSession(read_stream, write_stream) as session:
            await session.initialize()

            # Bridge: read from stdin, forward to remote, write to stdout
            async with stdio_server() as (stdin_read, stdout_write):
                async for message in stdin_read:
                    result = await session.send_request(message)
                    await stdout_write.send(result)


def main():
    import asyncio

    asyncio.run(run())


if __name__ == "__main__":
    main()
