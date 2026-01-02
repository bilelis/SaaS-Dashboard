from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
try:
    from ..models import AuthRegisterRequest, AuthLoginRequest, AuthResponse
    from ..utils import create_jwt_token, verify_jwt_token, get_supabase_anon, get_supabase_admin
except ImportError:
    from models import AuthRegisterRequest, AuthLoginRequest, AuthResponse
    from utils import create_jwt_token, verify_jwt_token, get_supabase_anon, get_supabase_admin

router = APIRouter()

@router.post("/register", response_model=AuthResponse)
async def register(request: AuthRegisterRequest):
    """Register a new user with email and password"""
    try:
        supabase = get_supabase_anon()
        supabase_admin = get_supabase_admin()
        # Create user in Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": request.email,
            "password": request.password,
        })
        
        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create user account"
            )
        
        user_id = auth_response.user.id
        
        # Create user profile in database
        supabase_admin.table("profiles").insert({
            "id": user_id,
            "email": request.email,
            "full_name": request.full_name,
            "role": "user"
        }).execute()
        
        # Generate JWT token
        access_token = create_jwt_token(user_id, request.email)
        
        return AuthResponse(
            user_id=user_id,
            email=request.email,
            full_name=request.full_name,
            role="user",
            access_token=access_token
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/login", response_model=AuthResponse)
async def login(request: AuthLoginRequest):
    """Login with email and password"""
    try:
        supabase = get_supabase_anon()
        supabase_admin = get_supabase_admin()
        # Authenticate with Supabase
        auth_response = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password
        })
        
        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        user_id = auth_response.user.id
        
        # Fetch user profile
        profile_response = supabase_admin.table("profiles").select("*").eq("id", user_id).single().execute()
        profile = profile_response.data
        
        # Generate JWT token
        access_token = create_jwt_token(user_id, request.email)
        
        return AuthResponse(
            user_id=user_id,
            email=request.email,
            full_name=profile["full_name"],
            role=profile["role"],
            access_token=access_token
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

@router.post("/refresh")
async def refresh_token(authorization: str = None):
    """Refresh JWT token"""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header"
        )
    
    try:
        token = authorization.replace("Bearer ", "")
        payload = verify_jwt_token(token)
        new_token = create_jwt_token(payload["sub"], payload["email"])
        return {"access_token": new_token, "token_type": "bearer"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
