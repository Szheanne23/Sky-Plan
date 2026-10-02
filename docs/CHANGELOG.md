# SkyPlan — Changelog

All meaningful project changes should be recorded here.

## [0.4.5] — 2026-10-02 — UI/UX Improvement Using Stitch Design References

### Added
- **Weather Search Command Panel (`SearchPanel.jsx`):** Search input with instant location suggestion pills (Interlaken, Boulder, Kyoto, Reykjavík, Vancouver, Manila, Denver) and date selection pills.
- **Meteorological Micro-Telemetry Cards (`WeatherMetricCard.jsx`):** Atmospheric cards for Precipitation %, Wind & Gusts, UV Index (Optimal), Humidity %, Air Quality Index (AQI), and Barometric Pressure with progress gauges and condition badges.
- **7-Day Atmospheric Itinerary Ribbon (`ForecastCard.jsx`):** Interactive daily forecast cards with high/low visual temperature range bars and precipitation probability pills.
- **Smart Activity Recommendations (`RecommendationCard.jsx`):** Activity suggestions with suitability scoring (96% Optimal, 84% Suitable, 68% Caution, 98% Indoor Alt), time-of-day slots, and meteorological criteria tags.
- **Reusable System Primitives:** Added `EmptyState.jsx` and `LoadingSkeleton.jsx` to prevent layout shifts.
- **Unified Authentication & Profile UI:** Refactored `LoginPage.jsx`, `RegisterPage.jsx`, and `ProfilePage.jsx` to use the dark atmospheric frosted glass language (`#0a122a` / `#131a33`) with password visibility toggles and inline error handling.
- **Mobile Navigation Drawer:** Responsive slide-down menu in `MainLayout.jsx` with touch-friendly navigation pills ($44\text{px}+$ targets).

## [0.4.0] — 2026-10-02 — Phase 1 Supabase PostgreSQL Setup & End-to-End Verification

### Added
- Configured secure SSL connection pool for Supabase-hosted PostgreSQL in `server/src/config/db.js`.
- Successfully executed migration `001_create_auth_and_user_schema.sql` creating `users`, `profiles`, `interest_tags`, and `user_interests` tables directly in Supabase PostgreSQL.
- Verified end-to-end registration with atomic profile and interest associations (`POST /api/auth/register`).
- Verified bcrypt password hashing (10 salt rounds) and secret sanitization on real Supabase user records.
- Verified duplicate email protection (`409 Conflict`), login authentication (`200 OK` vs `401 Unauthorized`), profile modifications (`PUT /api/profile`), and atomic interest tag synchronization (`PUT /api/profile/interests`).
- Verified server-side role authorization guards (`requireRole('ADMIN')` returns `403 Forbidden` for standard users).
- Verified cookie-based session clearance and route protection (`401 Unauthorized` for unauthenticated requests).
- Configured GitHub remote `https://github.com/Szheanne23/Sky-Plan.git` on `main` branch.

## [0.3.5] — 2026-10-02 — Phase 0.5 Stitch UI/UX Design Audit & Design System Lock-in

### Added
- Comprehensive Stitch Reference Inventory (`docs/STITCH_REFERENCE_INVENTORY.md`) documenting all discovered screen prototypes, telemetry components, and UI layout patterns.
- Local SkyPlan Stitch Design System specification (`docs/STITCH_DESIGN_SYSTEM.md`) detailing the exact Deep Atmospheric dark palette, Plus Jakarta Sans & Inter typography system, stadium capsule geometry, glassmorphic elevation tokens, and condition badges.
- Stitch Implementation Audit (`docs/STITCH_IMPLEMENTATION_AUDIT.md`) cataloging differences between previous baseline and authentic Stitch visual source of truth.
- Google Fonts integration (`Plus Jakarta Sans` 400-800, `Inter` 400-700) and radial atmospheric background gradients in `client/index.html` and `client/src/styles/index.css`.
- Authentic Stitch 2-Tier Header in `client/src/layouts/MainLayout.jsx` with search capsule (`⌘K`), temperature unit toggle (`°C`/`°F`), live API beacon, navigation pill tabs, and quick saved location chips.
- Upgraded Stitch UI primitives:
  - `Button.jsx`: Stadium capsule pill shape (`rounded-full`) with vibrant Sky Azure / Solar Amber gradients and glassmorphism.
  - `Card.jsx`: Atmospheric frosted glass slab (`bg-surface-container-low/60 backdrop-blur-md border-outline-variant/30`) with optional ambient glow.
  - `Badge.jsx`: Stitch condition indicators (`optimal`, `caution`, `indoor`, `outdoor`) with live status pulsing beacon.
  - `Input.jsx`: Dark atmospheric pill input with focus cyan ring.
  - `HomePage.jsx`: Stitch hero weather panel archetype (7 cols), telemetry grid (5 cols), and recommendation card layout.

### Resolved Discrepancies
- Replaced light slate styling with authentic Stitch Deep Atmospheric midnight navy (`#0a122a` canvas, `#131a33` cards).
- Replaced standard rectangular cards with stadium capsule (`rounded-full`) and smooth 2xl rounded glass containers (`rounded-2xl`).
- Replaced 1-tier minimal navigation with Stitch 2-tier command header.

## [0.3.0] — 2026-10-02 — Phase 1 Authentication & User Foundation

### Added
- PostgreSQL schema migration `001_create_auth_and_user_schema.sql` defining `users`, `profiles`, `interest_tags`, and `user_interests` with UUIDs, indexes, constraints, and default seed tags.
- Transaction-safe migration runner (`server/src/db/migrate.js`).
- Password security utility (`server/src/utils/password.js`) utilizing `bcryptjs` with 10 salt rounds.
- JWT authentication utility (`server/src/utils/jwt.js`) using `jsonwebtoken` and `httpOnly` secure cookie helpers.
- Server-side authorization middleware (`server/src/middleware/auth.js`) supporting token authentication (`authenticateToken`) and role guards (`requireRole`).
- Authentication API endpoints:
  - `POST /api/auth/register` (user registration with atomic profile creation and token issuance)
  - `POST /api/auth/login` (credential verification and token issuance)
  - `POST /api/auth/logout` (session and cookie clearing)
  - `GET /api/auth/me` (authenticated user identity retrieval)
- Profile and user interest endpoints:
  - `GET /api/profile` and `PUT /api/profile` (display name modification)
  - `GET /api/interests` (public/authenticated system tag catalog)
  - `GET /api/profile/interests` and `PUT /api/profile/interests` (atomic tag selection sync)
- Frontend authentication state management via `AuthContext` and `useAuth` hook.
- Frontend route protection via `ProtectedRoute` component with automatic redirect to `/login`.
- Google Stitch styled views: `LoginPage`, `RegisterPage`, and `ProfilePage` with categorized outdoor and indoor interest tag toggle chips.
- Dynamic navigation bar in `MainLayout` with user dropdown, role badge, profile link, and sign-out action.

### Security Decisions
- JWT tokens are transported and stored via `httpOnly`, `SameSite=Lax/Strict` cookies with fallback to `Authorization: Bearer` headers.
- Passwords are never stored in plaintext and password hashes are excluded from all API response envelopes.
- Role modifications and profile foreign-key manipulations are strictly prevented server-side.

### Basis
- Strictly follows `IMPLEMENTATION_PLAN.md` Phase 1 requirements, `DATABASE_DESIGN.md`, and `API_SPECIFICATION.md`.

## [0.2.0] — 2026-10-02 — Phase 0 Project Initialization

### Added
- Monorepo full-stack architecture (`client/` for React + Tailwind, `server/` for Express + PostgreSQL).
- Backend Express application with centralized error handling, CORS middleware, and safe configuration loader.
- Backend health check route (`GET /api/health`) and database connection probe (`testConnection`).
- Centralized frontend API service layer (`apiClient.js` and `healthService.js`).
- Google Stitch UI design system tokens (palette, typography, elevation, glassmorphism, responsive breakpoints).
- Reusable UI component primitives (`Button`, `Card`, `Badge`, `Input`, `Spinner`, `Alert`).
- Application layout shell (`MainLayout`) with live backend status ping and navigation.
- Root configuration: `package.json`, `.gitignore`, `.env.example`, `README.md`.

### Basis
- Strictly follows `IMPLEMENTATION_PLAN.md` Phase 0 requirements and academic baseline.

### Important Notes
- No Phase 1+ business features (registration, login, JWT token issuance, OpenWeatherMap integration, rule evaluation) have been implemented yet.
- Database connection layer handles offline/unconfigured PostgreSQL gracefully without crashing the server.

## Change Entry Template

### [Version] — YYYY-MM-DD

#### Added
-

#### Changed
-

#### Fixed
-

#### Removed
-

#### Documentation
-

#### Scope Impact
- None / Describe impact

#### Proposal Impact
- None / Requires paper update
