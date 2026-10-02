# SkyPlan — System Architecture

## 1. Architecture Goal

SkyPlan will use a web application architecture separating the user interface, backend/business logic, persistent data, authentication, and external weather service.

## 2. Proposal Architecture Baseline

The proposal identifies:
- React.js + Tailwind CSS for frontend;
- Node.js + Express for backend/API;
- PostgreSQL for database;
- OpenWeatherMap API for external weather data;
- JWT for authentication and role-based authorization;
- Chart.js for charts.

## 3. Logical Architecture

```text
+-----------------------------+
|          User / Guest       |
+--------------+--------------+
               |
               v
+-----------------------------+
| React.js + Tailwind CSS     |
| Web Application             |
+--------------+--------------+
               |
               v
+-----------------------------+
| Node.js + Express API       |
| - Authentication            |
| - Authorization             |
| - Weather Proxy             |
| - Search                    |
| - Favorites                 |
| - History                   |
| - Recommendations           |
| - Admin                     |
+------+----------------+-----+
       |                |
       v                v
+-------------+   +--------------------+
| PostgreSQL  |   | OpenWeatherMap API |
| Database    |   | External Weather   |
+-------------+   +--------------------+
```

## 4. Frontend Layer

Responsibilities:
- render pages and components;
- collect user input;
- display weather;
- display recommendations;
- display favorites/history;
- provide admin views;
- manage authenticated client state;
- communicate with backend endpoints.

The frontend should not contain secrets.

## 5. Backend Layer

Responsibilities:
- authentication;
- JWT verification;
- role authorization;
- request validation;
- business logic;
- weather API integration;
- recommendation evaluation;
- database access;
- administrative aggregation;
- error handling.

## 6. Database Layer

PostgreSQL stores persistent application data such as:
- user accounts;
- profiles;
- interest preferences;
- favorites;
- search history;
- recommendation rules;
- administrative/search data required for reporting.

The exact schema is specified separately in `DATABASE_DESIGN.md`.

## 7. External API Layer

OpenWeatherMap is used for real-time and multi-day weather information.

The backend should act as the controlled integration point so API credentials are not exposed to the browser.

## 8. Authentication Architecture

JWT is the proposal's authentication mechanism.

The final implementation should define:
- token creation;
- token validation;
- token expiry;
- secure client storage/transport;
- role claims or server-side role lookup;
- logout/session invalidation behavior.

These details are implementation decisions and should be finalized before coding authentication.

## 9. Authorization

Authorization must be enforced server-side.

Frontend route hiding is not sufficient protection.

## 10. Deployment Baseline

The proposal identifies:
- Vercel for frontend;
- Render for backend.

The database hosting provider is not specified in the proposal and therefore should be selected during implementation planning.

## 11. Architectural Principles

1. Keep external API credentials server-side.
2. Keep authentication and authorization logic centralized.
3. Keep recommendation rules independent from presentation components.
4. Keep database operations separate from frontend components.
5. Return consistent API responses.
6. Handle external API failure gracefully.
7. Avoid unnecessary architectural complexity for the project scope.
