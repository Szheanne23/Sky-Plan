# SkyPlan — Production Deployment Guide

This document outlines the complete steps to deploy **SkyPlan: Weather-Based Activity Planner** to production cloud platforms.

---

## 1. System Architecture Overview

```text
┌───────────────────────────────────────┐
│     Client (React 18 + Vite)          │
│   Deployed on: Vercel / Netlify       │
│   Domain: https://skyplan.example.com │
└──────────────────┬────────────────────┘
                   │ HTTPS / JSON API
                   │ Credentials / Bearer Token
┌──────────────────▼────────────────────┐
│      Server (Node.js + Express)       │
│   Deployed on: Render / Railway       │
│   Domain: https://api.skyplan.example │
└──────────────────┬────────────────────┘
                   │ SSL / Pooled Connection
┌──────────────────▼────────────────────┐
│     Database (PostgreSQL 15+)         │
│   Hosted on: Supabase PostgreSQL      │
│   Connection: Pooled (Port 5432/6543) │
└───────────────────────────────────────┘
```

---

## 2. Environment Variables Matrix

### Client (`client/.env`)
| Variable | Required | Production Example | Description |
|---|:---:|---|---|
| `VITE_API_URL` | **Yes** | `https://skyplan-api.onrender.com/api` | Base URL of the deployed Express backend service |

### Server (`server/.env`)
| Variable | Required | Production Example | Description |
|---|:---:|---|---|
| `PORT` | Optional | `5000` (auto-assigned by cloud host) | Web server listener port |
| `NODE_ENV` | **Yes** | `production` | Enables production security flags |
| `DATABASE_URL` | **Yes** | `postgresql://postgres.xxx:pass@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres` | Supabase pooled connection string with SSL |
| `JWT_SECRET` | **Yes** | `64_char_cryptographically_secure_random_string` | Secret key for signing user session JWTs |
| `JWT_EXPIRES_IN` | Optional | `24h` | JWT validity lifetime |
| `CLIENT_ORIGIN` | **Yes** | `https://skyplan.vercel.app` | Allowed CORS origins (supports comma-separated list) |
| `COOKIE_SAMESITE` | Optional | `none` (default in production) | Cookie SameSite policy (`none` for cross-origin HTTPS) |
| `OPENWEATHERMAP_API_KEY` | Optional | `your_live_openweathermap_api_key` | OpenWeatherMap key (falls back to deterministic telemetry if omitted) |

---

## 3. Database Deployment & Supabase Restoration

1. **Unpausing Inactive Projects:**
   - Supabase free-tier projects automatically pause after 7 days of inactivity.
   - If you encounter `(ENOTFOUND) tenant/user ... not found`, log in to the [Supabase Dashboard](https://supabase.com/dashboard), select your project, and click **"Restore project"**.
2. **Applying Migrations:**
   - Run migrations before starting the application:
     ```bash
     cd server
     npm run migrate
     ```
   - This executes `001_create_auth_and_user_schema.sql` and `002_create_core_features_schema.sql` inside transactional boundaries.

---

## 4. Frontend Deployment (Vercel / Netlify)

### Option A: Vercel
1. Link your GitHub repository in Vercel.
2. Configure project settings:
   - **Root Directory:** `client`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Environment Variable:
   - `VITE_API_URL`: `https://<your-backend-domain>/api`
4. The repository already includes `client/vercel.json` and `client/public/_redirects` to handle Single Page Application (SPA) routing without 404 errors on page refresh.

### Option B: Netlify
1. Link the repository in Netlify.
2. Set **Base directory** to `client`, **Build command** to `npm run build`, and **Publish directory** to `dist`.
3. Set `VITE_API_URL` under Site configuration > Environment variables.

---

## 5. Backend Deployment (Render / Railway)

### Option A: Render
1. Create a new **Web Service** from your GitHub repository.
2. Configure settings:
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: Your Supabase PostgreSQL pooled URI
   - `JWT_SECRET`: A secure random string
   - `CLIENT_ORIGIN`: Your deployed frontend URL (e.g., `https://skyplan.vercel.app`)
   - `OPENWEATHERMAP_API_KEY`: Your OpenWeatherMap key

---

## 6. Pre-Flight Verification Checklist

- [x] Client production build succeeds (`npm run build` with zero errors).
- [x] SPA routing fallbacks configured (`vercel.json` and `_redirects`).
- [x] Sensitive credentials excluded from Git tracking (`.env` files in `.gitignore`).
- [x] Cross-origin cookie handling configured (`sameSite: 'none'`, `secure: true` in production).
- [x] Dual-authentication support (HTTP-only cookie + fallback `Authorization: Bearer` header).
- [x] Health check endpoint active at `/api/health`.
- [x] Automated database migration runner configured (`npm run migrate`).
- [x] OpenWeatherMap integration with graceful deterministic fallback.
