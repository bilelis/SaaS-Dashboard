from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum
import uuid

# Enums
class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"

class SubscriptionStatus(str, Enum):
    ACTIVE = "active"
    CANCELED = "canceled"
    PAST_DUE = "past_due"
    INACTIVE = "inactive"

# Auth Models
class AuthRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str

class AuthLoginRequest(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    user_id: str
    email: str
    full_name: str
    role: UserRole
    access_token: str
    token_type: str = "bearer"

# User Models
class UserProfile(BaseModel):
    id: str
    email: str
    full_name: str
    role: UserRole
    created_at: datetime

    class Config:
        from_attributes = True

class UpdateUserRequest(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None

# Product Models
class ProductFeature(BaseModel):
    name: str
    included: bool

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    features: Optional[List[str]] = None

class Product(ProductCreate):
    id: str
    stripe_price_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Subscription Models
class SubscriptionCreate(BaseModel):
    product_id: str

class Subscription(BaseModel):
    id: str
    user_id: str
    product_id: str
    status: SubscriptionStatus
    start_date: datetime
    end_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    stripe_subscription_id: Optional[str] = None

    class Config:
        from_attributes = True

class SubscriptionUpdate(BaseModel):
    status: SubscriptionStatus

# Error response
class ErrorResponse(BaseModel):
    detail: str
    error_code: Optional[str] = None
