# SkyPlan — Changelog

All meaningful project changes should be recorded here.

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
