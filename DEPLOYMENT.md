# Deployment Guide for bilel SaaS Platform

## Prerequisites

- Vercel account (frontend)
- Supabase project
- Stripe account
- GitHub repository

## Step-by-Step Deployment

### 1. Frontend Deployment on Vercel

#### Via Git Integration (Recommended)

1. Push your code to GitHub
2. Go to vercel.com and sign in
3. Click "New Project"
4. Select your GitHub repository
5. Configure build settings:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_API_URL=https://your-api.vercel.app
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```
7. Click "Deploy"

### 2. Backend Deployment

Choose one option:

#### Option A: Vercel (Python Support via Serverless Functions)

Note: FastAPI on Vercel has limitations. Recommended for smaller deployments.

#### Option B: Railway (Recommended for FastAPI)

1. Go to railway.app
2. Create new project
3. Deploy from GitHub
4. Set up environment variables
5. Update `FRONTEND_URL` to your Vercel domain

#### Option C: Render

1. Go to render.com
2. Create new Web Service
3. Connect GitHub repository
4. Set Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port 8000`
5. Add environment variables
6. Deploy

### 3. Update Database Connections

1. Replace local Supabase URL with production URL
2. Update JWT_SECRET from Supabase
3. Enable HTTPS for all connections

### 4. Configure Stripe for Production

1. Get live Stripe keys from dashboard
2. Update `.env` variables with live keys
3. Configure webhook endpoint with production URL
4. Enable HTTPS for webhooks

### 5. Update CORS Settings

In `backend/main.py`, update origins:

```python
origins = [
    "https://your-vercel-domain.vercel.app",
    "https://your-custom-domain.com"
]
```

### 6. Enable Custom Domain (Optional)

On Vercel:
1. Go to Settings → Domains
2. Add custom domain
3. Update DNS records
4. Wait for SSL certificate generation

### 7. Set Up Monitoring

- Vercel: Built-in analytics and error tracking
- Sentry: For advanced error tracking
- LogRocket: Session replay and debugging

## Environment Variables Summary

### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-live-anon-key
NEXT_PUBLIC_API_URL=https://your-api.vercel.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Backend (.env)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-live-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-live-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_live_...
FRONTEND_URL=https://your-vercel-domain.vercel.app
ENVIRONMENT=production
```

## Post-Deployment Checklist

- [ ] Test registration and login
- [ ] Verify Stripe checkout flow
- [ ] Test subscription creation
- [ ] Verify admin panel access
- [ ] Check email notifications (if configured)
- [ ] Monitor error logs
- [ ] Set up automated backups
- [ ] Configure monitoring alerts
- [ ] Test webhook endpoints
- [ ] Verify HTTPS everywhere
- [ ] Check database RLS policies
- [ ] Test user authentication flows

## Troubleshooting

### 404 on API Endpoints

Check that `NEXT_PUBLIC_API_URL` matches your backend domain.

### CORS Errors

Ensure backend CORS origins include your Vercel domain.

### Stripe Webhooks Not Working

1. Verify webhook signing secret
2. Check endpoint is HTTPS
3. Monitor webhook logs in Stripe dashboard

### Database Permissions Denied

1. Verify Supabase JWT secret
2. Check RLS policies
3. Ensure correct role is set in profiles

## Rollback Procedure

### On Vercel
1. Go to Deployments
2. Click the previous successful deployment
3. Click "Redeploy"

### On Railway/Render
1. Stop current deployment
2. Deploy previous working commit
3. Verify functionality

## Performance Optimization

1. Enable Vercel caching
2. Optimize images with Next.js Image component
3. Use API route caching headers
4. Enable compression on backend
5. Set appropriate database indexes

## Security Hardening

1. Enable HTTPS everywhere
2. Set secure cookie flags
3. Configure CORS properly
4. Rotate API keys regularly
5. Monitor for unusual activity
6. Enable database backups
7. Set up rate limiting

---

For support, refer to:
- Vercel Docs: vercel.com/docs
- Supabase Docs: supabase.com/docs
- FastAPI Docs: fastapi.tiangolo.com
