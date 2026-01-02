from fastapi import APIRouter, HTTPException, status, Header, Depends
from typing import List, Optional
try:
    from ..models import Subscription, SubscriptionCreate, SubscriptionUpdate
    from ..utils import verify_jwt_token, get_supabase_admin
except ImportError:
    from models import Subscription, SubscriptionCreate, SubscriptionUpdate
    from utils import verify_jwt_token, get_supabase_admin
from datetime import datetime, timedelta

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

@router.get("/", response_model=List[Subscription])
async def list_user_subscriptions(user_id: str = Depends(get_current_user)):
    """List subscriptions for current user"""
    try:
        supabase = get_supabase_admin()
        response = supabase.table("subscriptions").select("*").eq("user_id", user_id).execute()
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/", response_model=Subscription)
async def create_subscription(
    request: SubscriptionCreate,
    user_id: str = Depends(get_current_user)
):
    """Create a new subscription"""
    try:
        supabase = get_supabase_admin()
        subscription_data = {
            "user_id": user_id,
            "product_id": request.product_id,
            "status": "active",
            "start_date": datetime.utcnow().isoformat(),
            "end_date": (datetime.utcnow() + timedelta(days=30)).isoformat()
        }
        
        response = supabase.table("subscriptions").insert(subscription_data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.patch("/{subscription_id}", response_model=Subscription)
async def update_subscription(
    subscription_id: str,
    request: SubscriptionUpdate,
    user_id: str = Depends(get_current_user)
):
    """Update a subscription (cancel, etc.)"""
    try:
        supabase = get_supabase_admin()
        # Verify ownership
        subscription = supabase.table("subscriptions").select("*").eq("id", subscription_id).single().execute()
        
        if subscription.data["user_id"] != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this subscription"
            )
        
        update_data = {"status": request.status}
        if request.status == "canceled":
            update_data["end_date"] = datetime.utcnow().isoformat()
        
        response = supabase.table("subscriptions").update(update_data).eq("id", subscription_id).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
