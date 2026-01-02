from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from typing import Optional
import jwt
from datetime import datetime, timedelta

# Import routers
try:
    from .api import auth, users, products, subscriptions, admin, stripe_integration
except ImportError:
    from api import auth, users, products, subscriptions, admin, stripe_integration

app = FastAPI(
    title="bilel SaaS API",
    description="Production-ready SaaS backend with Supabase",
    version="1.0.0"
)

# CORS middleware configuration
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    os.getenv("FRONTEND_URL", "http://localhost:3000"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(subscriptions.router, prefix="/api/subscriptions", tags=["subscriptions"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(stripe_integration.router, prefix="/api/stripe", tags=["stripe"])

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "bilel SaaS API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health():
    """Health check endpoint for deployment monitoring"""
    return {"status": "healthy", "timestamp": datetime.utcnow()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
