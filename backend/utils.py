import os
from datetime import datetime, timedelta
from typing import Optional, Dict
import jwt
from supabase import create_client, Client
import hashlib
import secrets

_SUPABASE_URL = os.getenv("SUPABASE_URL")
_SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
_SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

_supabase_anon: Optional[Client] = None
_supabase_admin: Optional[Client] = None

_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

def _require_env(value: Optional[str], name: str) -> str:
    if value:
        return value
    raise RuntimeError(f"Missing required environment variable: {name}")

def get_supabase_anon() -> Client:
    global _supabase_anon
    if _supabase_anon is not None:
        return _supabase_anon
    url = _require_env(_SUPABASE_URL, "SUPABASE_URL")
    key = _require_env(_SUPABASE_ANON_KEY, "SUPABASE_ANON_KEY")
    _supabase_anon = create_client(url, key)
    return _supabase_anon

def get_supabase_admin() -> Client:
    global _supabase_admin
    if _supabase_admin is not None:
        return _supabase_admin
    url = _require_env(_SUPABASE_URL, "SUPABASE_URL")
    key = _require_env(_SUPABASE_SERVICE_ROLE_KEY, "SUPABASE_SERVICE_ROLE_KEY")
    _supabase_admin = create_client(url, key)
    return _supabase_admin

def _get_jwt_secret() -> str:
    return _require_env(_JWT_SECRET, "SUPABASE_JWT_SECRET")

def create_jwt_token(user_id: str, email: str) -> str:
    """Create a JWT token for a user"""
    payload = {
        "sub": user_id,
        "email": email,
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    token = jwt.encode(payload, _get_jwt_secret(), algorithm=JWT_ALGORITHM)
    return token

def verify_jwt_token(token: str) -> Dict:
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, _get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception("Token has expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")

def hash_password(password: str) -> str:
    """Hash a password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def generate_secure_token(length: int = 32) -> str:
    """Generate a secure random token"""
    return secrets.token_urlsafe(length)

class SupabaseClient:
    """Wrapper for Supabase client operations"""
    
    @staticmethod
    def get_admin_client() -> Client:
        """Get admin client for privileged operations"""
        return get_supabase_admin()
    
    @staticmethod
    def get_user_client() -> Client:
        """Get user client"""
        return get_supabase_anon()

def extract_bearer_token(authorization: Optional[str]) -> Optional[str]:
    """Extract Bearer token from Authorization header"""
    if not authorization:
        return None
    
    parts = authorization.split()
    if len(parts) == 2 and parts[0].lower() == "bearer":
        return parts[1]
    return None
