from fastapi import APIRouter, HTTPException, status, Header, Depends, Request
import os
import stripe
from typing import Optional
try:
    from ..models import Subscription, SubscriptionUpdate
    from ..utils import verify_jwt_token, get_supabase_anon, get_supabase_admin
except ImportError:
    from models import Subscription, SubscriptionUpdate
    from utils import verify_jwt_token, get_supabase_anon, get_supabase_admin

router = APIRouter()

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

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

@router.post("/create-checkout-session")
async def create_checkout_session(
    product_id: str,
    user_id: str = Depends(get_current_user)
):
    """Create a Stripe checkout session for subscription"""
    try:
        supabase = get_supabase_anon()
        supabase_admin = get_supabase_admin()
        # Get product from database
        product_response = supabase.table("products").select("*").eq("id", product_id).single().execute()
        product = product_response.data
        
        # Get or create Stripe product
        if not product.get("stripe_price_id"):
            # Create Stripe product
            stripe_product = stripe.Product.create(
                name=product["name"],
                description=product["description"]
            )
            
            # Create Stripe price
            stripe_price = stripe.Price.create(
                product=stripe_product.id,
                unit_amount=int(product["price"] * 100),  # Convert to cents
                currency="usd",
                recurring={"interval": "month"}
            )
            
            # Update product with Stripe price ID
            supabase_admin.table("products").update({
                "stripe_price_id": stripe_price.id
            }).eq("id", product_id).execute()
            
            price_id = stripe_price.id
        else:
            price_id = product["stripe_price_id"]
        
        # Get user email
        user_profile = supabase.table("profiles").select("email").eq("id", user_id).single().execute()
        
        # Create checkout session
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price": price_id,
                    "quantity": 1,
                }
            ],
            mode="subscription",
            customer_email=user_profile.data["email"],
            success_url=f"{FRONTEND_URL}/dashboard/subscriptions?success=true",
            cancel_url=f"{FRONTEND_URL}/pricing?canceled=true",
            metadata={
                "user_id": user_id,
                "product_id": product_id
            }
        )
        
        return {"session_id": session.id, "url": session.url}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/webhook")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events"""
    try:
        supabase_admin = get_supabase_admin()
        payload = await request.body()
        sig_header = request.headers.get("stripe-signature")
        
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
        
        # Handle different event types
        if event["type"] == "customer.subscription.updated":
            subscription = event["data"]["object"]
            
            # Update subscription status in database
            if subscription["status"] == "active":
                status_update = "active"
            elif subscription["status"] == "canceled":
                status_update = "canceled"
            elif subscription["status"] == "past_due":
                status_update = "past_due"
            else:
                status_update = "inactive"
            
            supabase_admin.table("subscriptions").update({
                "status": status_update,
                "stripe_subscription_id": subscription["id"]
            }).eq("stripe_subscription_id", subscription["id"]).execute()
        
        elif event["type"] == "customer.subscription.deleted":
            subscription = event["data"]["object"]
            supabase_admin.table("subscriptions").update({
                "status": "canceled"
            }).eq("stripe_subscription_id", subscription["id"]).execute()
        
        return {"status": "success"}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
