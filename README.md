# SkyPlan — Weather-Based Activity Planner

[![Status](https://img.shields.io/badge/Status-Phase%200%20Foundation%20Ready-success)]()
[![Platform](https://img.shields.io/badge/Platform-Web%20Application-blue)]()
[![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Express%20%7C%20PostgreSQL-indigo)]()

SkyPlan is a full-stack web application designed to integrate real-time weather retrieval and multi-day forecasts with an automated, rule-based activity recommendation engine.

---

## 1. Project Baseline

- **Frontend:** React.js, Tailwind CSS, Vite, Chart.js, Lucide Icons
- **Backend:** Node.js, Express REST API
- **Database:** PostgreSQL
- **External Weather API:** OpenWeatherMap API
- **Authentication:** JWT (JSON Web Tokens)
- **Deployment:** Vercel (Frontend) + Render (Backend)

---

## 2. Directory Structure

```text
Shanaha/
├── client/                     # React + Tailwind frontend application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/common/  # Reusable Google Stitch design primitives
│   │   ├── layouts/            # Application layout shells & navigation
│   │   ├── pages/              # Route views & screens
│   │   ├── services/           # Centralized API clients & endpoints
│   │   ├── styles/             # Tailwind CSS & global design tokens
│   │   └── lib/                # Utility helpers
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Express REST API backend
│   ├── src/
│   │   ├── config/             # Database & environment configuration
│   │   ├── middleware/         # CORS & centralized error handling
│   │   ├── routes/             # API route handlers (/api/health, etc.)
│   │   ├── app.js              # Express application assembly
│   │   └── server.js           # Server entrypoint
│   └── package.json
│
├── docs/                       # System documentation & specifications
│   ├── REQUIREMENTS.md
│   ├── FEATURE_SPECIFICATION.md
│   ├── SYSTEM_ARCHITECTURE.md
│   ├── DATABASE_DESIGN.md
│   ├── API_SPECIFICATION.md
│   ├── RECOMMENDATION_ENGINE.md
│   ├── AUTHORIZATION_MATRIX.md
│   ├── UI_UX_SPECIFICATION.md
│   ├── IMPLEMENTATION_PLAN.md
│   └── CHANGELOG.md
│
├── .gitignore
├── .env.example
├── package.json
└── README.md
```

---

## 3. Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- PostgreSQL (v14+)

### 1. Install Dependencies
```bash
# Install root, backend, and frontend dependencies
npm run install:all
```

### 2. Environment Configuration
Copy `.env.example` templates to `.env` in both `server/` and `client/`:
```bash
cp .env.example server/.env
cp client/.env.example client/.env
```

### 3. Run Development Servers
In separate terminals or concurrently:

```bash
# Terminal 1: Start Express Backend API (Port 5000)
npm run dev:server

# Terminal 2: Start React Frontend Client (Port 5173)
npm run dev:client
```

---

## 4. Verification Endpoints

- **Frontend Application:** `http://localhost:5173`
- **Backend Root:** `http://localhost:5000`
- **Backend Health Check:** `http://localhost:5000/api/health`

---

## 5. Implementation Roadmap

- [x] **Phase 0:** Project Scaffolding, Google Stitch UI Tokens & Health Check
- [ ] **Phase 1:** Authentication, Roles & Profile Preferences (JWT)
- [ ] **Phase 2:** OpenWeatherMap API Integration & City Search
- [ ] **Phase 3:** Multi-Day Forecast Display
- [ ] **Phase 4:** Rule-Based Activity Recommendation Engine Core
- [ ] **Phase 5:** Favorites & Search History Management
- [ ] **Phase 6:** Guest Limitations & Quotas
- [ ] **Phase 7:** Admin Dashboard, Usage Analytics & Rule Configuration
- [ ] **Phase 8:** UI/UX Polish, Accessibility & Animations
- [ ] **Phase 9:** Testing, QA & Verification
- [ ] **Phase 10:** Production Deployment (Vercel + Render)
