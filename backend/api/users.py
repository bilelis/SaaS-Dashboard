from fastapi import APIRouter, HTTPException, status, Header, Depends
from typing import Optional
try:
    from ..models import UserProfile, UpdateUserRequest
    from ..utils import verify_jwt_token, get_supabase_anon
except ImportError:
    from models import UserProfile, UpdateUserRequest
    from utils import verify_jwt_token, get_supabase_anon

router = APIRouter()

async def get_current_user(authorization: Optional[str] = Header(None)):
    """Extract and verify current user from JWT token"""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header"
        )
    
    try:
        token = authorization.replace("Bearer ", "")
        payload = verify_jwt_token(token)
        return payload["sub"]
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

@router.get("/me", response_model=UserProfile)
async def get_current_user_profile(user_id: str = Depends(get_current_user)):
    """Get current user profile"""
    try:
        supabase = get_supabase_anon()
        response = supabase.table("profiles").select("*").eq("id", user_id).single().execute()
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found"
        )

@router.put("/me", response_model=UserProfile)
async def update_current_user(
    request: UpdateUserRequest,
    user_id: str = Depends(get_current_user)
):
    """Update current user profile"""
    try:
        supabase = get_supabase_anon()
        update_data = {}
        if request.full_name:
            update_data["full_name"] = request.full_name
        if request.email:
            update_data["email"] = request.email
        
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No fields to update"
            )
        
        response = supabase.table("profiles").update(update_data).eq("id", user_id).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
