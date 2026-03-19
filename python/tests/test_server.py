"""Tests for BankSync MCP server."""

import os
from unittest.mock import patch

import pytest

from banksync_mcp import __version__
from banksync_mcp.server import REMOTE_URL


def test_version():
    assert __version__ == "1.0.0"


def test_remote_url():
    assert REMOTE_URL == "https://mcp.banksync.io"


def test_run_exits_without_api_key():
    """run() should exit with code 1 when BANKSYNC_API_KEY is not set."""
    from banksync_mcp.server import run

    with patch.dict(os.environ, {}, clear=True):
        with pytest.raises(SystemExit) as exc_info:
            import asyncio

            asyncio.run(run())
        assert exc_info.value.code == 1


def test_run_exits_with_empty_api_key():
    """run() should exit with code 1 when BANKSYNC_API_KEY is empty."""
    from banksync_mcp.server import run

    with patch.dict(os.environ, {"BANKSYNC_API_KEY": ""}):
        with pytest.raises(SystemExit) as exc_info:
            import asyncio

            asyncio.run(run())
        assert exc_info.value.code == 1


def test_main_is_callable():
    """main() should be importable and callable (entry point)."""
    from banksync_mcp.server import main

    assert callable(main)


def test_module_docstring():
    """Module should have a docstring."""
    from banksync_mcp import server

    assert server.__doc__ is not None
    assert "BankSync" in server.__doc__
