# SkyPlan — Changelog

All meaningful project changes should be recorded here.

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
