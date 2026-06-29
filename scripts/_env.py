"""
Shared env-loading helper for all scripts.
Looks for .env in the coding_app root (two levels up from this file).
"""
import os
from pathlib import Path

def load_env():
    """Load .env from the project root if python-dotenv is available."""
    env_path = Path(__file__).resolve().parent.parent / ".env"
    try:
        from dotenv import load_dotenv
        if env_path.exists():
            load_dotenv(env_path, override=False)
    except ImportError:
        pass  # python-dotenv not installed; rely on shell-exported vars

def supabase_client():
    load_env()
    from supabase import create_client
    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise RuntimeError(
            "Missing env vars. Ensure NEXT_PUBLIC_SUPABASE_URL and "
            "SUPABASE_SERVICE_ROLE_KEY are set (or in a .env file in coding_app/)."
        )
    return create_client(url, key)
