# bilel SaaS Platform

A production-ready SaaS platform built with Next.js, FastAPI, Supabase, and Stripe integration. Complete with authentication, subscription management, and admin dashboard.

## Features

- **User Authentication**: Email/password registration and login via Supabase
- **Subscription Management**: Multiple pricing tiers with Stripe integration
- **Protected Routes**: Role-based access control (user/admin)
- **Dashboard**: Real-time user data and subscription management
- **Admin Panel**: Manage users and products
- **Responsive Design**: Mobile-first UI with Tailwind CSS

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/UI Components
- Supabase Client SDK

### Backend
- FastAPI (Python 3.11+)
- PostgreSQL (via Supabase)
- JWT Authentication
- Stripe API

### Database
- Supabase PostgreSQL
- Row Level Security (RLS)
- Real-time subscriptions

## Project Structure

```
.
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page
│   ├── login/page.tsx            # Login page
│   ├── signup/page.tsx           # Registration page
│   ├── pricing/page.tsx          # Pricing page with products
│   ├── dashboard/
│   │   ├── page.tsx              # Dashboard home
│   │   ├── subscriptions/page.tsx # Subscription management
│   │   └── users/page.tsx        # User management
│   ├── settings/page.tsx         # Account settings
│   └── layout.tsx                # Root layout
├── components/
│   ├── ui/                       # Shadcn UI components
│   ├── dashboard-nav.tsx         # Navigation component
│   └── auth-forms/               # Auth components
├── lib/
│   ├── auth-context.tsx          # Auth state management
│   ├── supabase/                 # Supabase clients
│   └── api-client.ts             # API utilities
├── backend/
│   ├── main.py                   # FastAPI application
│   ├── models.py                 # Pydantic models
│   ├── utils.py                  # Utility functions
│   ├── api/
│   │   ├── auth.py               # Authentication endpoints
│   │   ├── users.py              # User endpoints
│   │   ├── products.py           # Product endpoints
│   │   ├── subscriptions.py       # Subscription endpoints
│   │   ├── admin.py              # Admin endpoints
│   │   └── stripe_integration.py # Stripe endpoints
│   └── requirements.txt           # Python dependencies
└── scripts/
    ├── 01_create_tables.sql      # Database schema
    └── 02_insert_sample_products.sql # Sample data

```

## Setup Instructions

### Prerequisites

- Node.js 18+
- Python 3.11+
- Supabase account
- Stripe account

### 1. Clone and Install

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Create a `backend/.env` file:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
FRONTEND_URL=http://localhost:3000
ENVIRONMENT=development
```

### 3. Setup Supabase Database

1. Go to your Supabase project
2. Open the SQL editor
3. Run the SQL scripts from `scripts/01_create_tables.sql`
4. Run `scripts/02_insert_sample_products.sql` for sample data

### 4. Run Locally

**Frontend (Terminal 1):**
```bash
npm run dev
# Runs on http://localhost:3000
```

**Backend (Terminal 2):**
```bash
cd backend
python -m uvicorn main:app --reload
# Runs on http://localhost:8000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

### Products (Public)
- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get product details

### Subscriptions (Auth Required)
- `GET /api/subscriptions` - List user subscriptions
- `POST /api/subscriptions` - Create subscription
- `PATCH /api/subscriptions/{id}` - Update subscription status

### Stripe Integration
- `POST /api/stripe/create-checkout-session` - Create Stripe checkout
- `POST /api/stripe/webhook` - Handle Stripe webhooks

### Admin Only
- `GET /api/admin/users` - List all users
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/{id}` - Update product
- `DELETE /api/admin/products/{id}` - Delete product

## Authentication Flow

1. User registers with email/password
2. Supabase Auth creates user and returns user ID
3. User profile created in `profiles` table
4. JWT token generated for API requests
5. Token stored in localStorage (client-side)
6. All API requests include JWT in Authorization header

## Database Schema

### profiles
- `id` (UUID, PK) - References auth.users
- `email` (TEXT, unique)
- `full_name` (TEXT)
- `role` (TEXT) - 'user' or 'admin'
- `created_at` (TIMESTAMP)

### products
- `id` (UUID, PK)
- `name` (TEXT)
- `description` (TEXT)
- `price` (DECIMAL)
- `stripe_price_id` (TEXT)
- `features` (JSONB array)
- `created_at` (TIMESTAMP)

### subscriptions
- `id` (UUID, PK)
- `user_id` (UUID, FK → profiles)
- `product_id` (UUID, FK → products)
- `stripe_subscription_id` (TEXT)
- `status` (TEXT) - 'active', 'canceled', 'past_due'
- `start_date` (TIMESTAMP)
- `end_date` (TIMESTAMP)
- `created_at` (TIMESTAMP)

## Stripe Integration

### Setup Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select events: `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy webhook signing secret to `.env`

### Testing

Use Stripe test keys:
- Publishable Key: `pk_test_...`
- Secret Key: `sk_test_...`

Test card: `4242 4242 4242 4242`

## Deployment

### Vercel (Frontend + Backend)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy Frontend**
- Go to vercel.com
- Import GitHub repository
- Add environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_API_URL` (backend URL)
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

3. **Deploy Backend**
- Backend can be deployed on Vercel, Railway, or Render
- Set all environment variables in deployment platform
- Update `FRONTEND_URL` to your Vercel domain

### Environment Variables Checklist

**Frontend (.env.local)**
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] NEXT_PUBLIC_API_URL
- [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

**Backend (.env)**
- [ ] SUPABASE_URL
- [ ] SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] SUPABASE_JWT_SECRET
- [ ] STRIPE_SECRET_KEY
- [ ] STRIPE_WEBHOOK_SECRET
- [ ] FRONTEND_URL

## Security Considerations

1. **Row Level Security (RLS)**: All tables have RLS enabled
2. **JWT Tokens**: All API endpoints require valid JWT token
3. **Password Hashing**: Handled by Supabase Auth
4. **HTTPS Only**: All cookies are secure in production
5. **CORS**: Configured to allow only frontend domain
6. **Input Validation**: Pydantic models validate all inputs

## Development

### Create Admin User

```python
# Run this in your backend
from utils import supabase_admin

supabase_admin.table("profiles").update({
    "role": "admin"
}).eq("email", "admin@example.com").execute()
```

### Test API with curl

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Password123","full_name":"Test User"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Password123"}'

# Get profile
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/users/me
```

## Troubleshooting

### Supabase Connection Issues
- Verify `SUPABASE_URL` and keys in `.env`
- Check that database tables are created
- Enable RLS policies on tables

### API 401 Unauthorized
- Token might be expired, try refreshing
- Check `Authorization` header format: `Bearer TOKEN`
- Verify `SUPABASE_JWT_SECRET` matches in frontend/backend

### Stripe Not Working
- Verify webhook secret is correct
- Check Stripe test/live mode matches keys
- Ensure webhook events are being triggered

## Contributing

1. Create feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [link to repo]
- Email: support@bilelsaas.com
- Documentation: [link to docs]

---

Built with Next.js, FastAPI, and Supabase
