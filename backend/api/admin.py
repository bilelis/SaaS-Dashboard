from fastapi import APIRouter, HTTPException, status, Header, Depends
from typing import List, Optional
try:
    from ..models import UserProfile, ProductCreate, Product
    from ..utils import verify_jwt_token, get_supabase_admin
except ImportError:
    from models import UserProfile, ProductCreate, Product
    from utils import verify_jwt_token, get_supabase_admin

router = APIRouter()

async def get_admin_user(authorization: Optional[str] = Header(None)):
    """Verify admin access"""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header"
        )
    
    try:
        token = authorization.replace("Bearer ", "")
        payload = verify_jwt_token(token)
        user_id = payload["sub"]

        supabase_admin = get_supabase_admin()
        
        # Check if user is admin
        profile = supabase_admin.table("profiles").select("role").eq("id", user_id).single().execute()
        if profile.data["role"] != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )
        
        return user_id
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token or insufficient permissions"
        )

@router.get("/users", response_model=List[UserProfile])
async def list_all_users(admin_id: str = Depends(get_admin_user)):
    """List all users - admin only"""
    try:
        supabase_admin = get_supabase_admin()
        response = supabase_admin.table("profiles").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/products", response_model=Product)
async def create_product(
    request: ProductCreate,
    admin_id: str = Depends(get_admin_user)
):
    """Create a new product - admin only"""
    try:
        supabase_admin = get_supabase_admin()
        product_data = {
            "name": request.name,
            "description": request.description,
            "price": request.price,
            "features": request.features or []
        }
        
        response = supabase_admin.table("products").insert(product_data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.put("/products/{product_id}", response_model=Product)
async def update_product(
    product_id: str,
    request: ProductCreate,
    admin_id: str = Depends(get_admin_user)
):
    """Update a product - admin only"""
    try:
        supabase_admin = get_supabase_admin()
        update_data = {
            "name": request.name,
            "description": request.description,
            "price": request.price,
            "features": request.features or []
        }
        
        response = supabase_admin.table("products").update(update_data).eq("id", product_id).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.delete("/products/{product_id}")
async def delete_product(
    product_id: str,
    admin_id: str = Depends(get_admin_user)
):
    """Delete a product - admin only"""
    try:
        supabase_admin = get_supabase_admin()
        supabase_admin.table("products").delete().eq("id", product_id).execute()
        return {"message": "Product deleted successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
