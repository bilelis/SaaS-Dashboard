from fastapi import APIRouter, HTTPException, status, Header
from typing import List, Optional
try:
    from ..models import Product, ProductCreate
    from ..utils import verify_jwt_token, get_supabase_anon, get_supabase_admin
except ImportError:
    from models import Product, ProductCreate
    from utils import verify_jwt_token, get_supabase_anon, get_supabase_admin

router = APIRouter()

@router.get("/", response_model=List[Product])
async def list_products():
    """List all products - public endpoint"""
    try:
        supabase = get_supabase_anon()
        response = supabase.table("products").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Get product by ID - public endpoint"""
    try:
        supabase = get_supabase_anon()
        response = supabase.table("products").select("*").eq("id", product_id).single().execute()
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
