# SkyPlan — API Specification

## 1. Purpose

This document defines the proposed backend API surface needed to implement SkyPlan.

The proposal identifies Node.js + Express as the backend/API technology and OpenWeatherMap as the external API.

Endpoint names below are **proposed implementation contracts**, not endpoints stated in the academic paper.

## 2. API Conventions

Suggested base path:

```text
/api
```

Suggested response structure:

```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

Error structure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

The exact response envelope can be changed if the team establishes a consistent alternative.

## 3. Authentication Endpoints

### POST `/api/auth/register`
Create a registered user account.

### POST `/api/auth/login`
Authenticate a registered user.

### POST `/api/auth/logout`
End the authenticated session/token flow.

### GET `/api/auth/me`
Return the authenticated user's identity and role.

## 4. Profile Endpoints

### GET `/api/profile`
Retrieve the current user's profile.

### PUT `/api/profile`
Update the current user's profile.

### GET `/api/profile/interests`
Retrieve the current user's interest tags.

### PUT `/api/profile/interests`
Replace/update the current user's interest preferences.

## 5. Weather Endpoints

### GET `/api/weather/search`
Retrieve weather information for a requested city/date.

Suggested query parameters:
- `city`
- `date`

The backend communicates with OpenWeatherMap.

### GET `/api/weather/forecast`
Retrieve multi-day forecast information.

The exact OpenWeatherMap endpoint and response mapping should be selected during implementation based on the available API plan and documented capabilities.

## 6. Favorites

### GET `/api/favorites`
List the authenticated user's favorite cities.

### POST `/api/favorites`
Save a city.

### DELETE `/api/favorites/:id`
Remove a favorite.

## 7. Search History

### GET `/api/history`
List the authenticated user's search history.

### DELETE `/api/history/:id`
Optional implementation endpoint for deleting an individual history record if the project decides to support it.

The proposal requires viewing history but does not explicitly require deletion.

## 8. Recommendations

### GET `/api/recommendations`
Generate recommendations using:
- requested weather data;
- user interests;
- active recommendation rules.

Possible query/input values depend on the final weather-search flow.

## 9. Admin Endpoints

All admin endpoints require server-side admin authorization.

### GET `/api/admin/users`
List/manage user accounts.

### GET `/api/admin/statistics`
Return usage statistics.

### GET `/api/admin/search-logs`
Return search logs.

### GET `/api/admin/popular-searches`
Return popular search information.

### GET `/api/admin/recommendation-rules`
List configured rules.

### POST `/api/admin/recommendation-rules`
Create a recommendation rule.

### PUT `/api/admin/recommendation-rules/:id`
Update a recommendation rule.

### DELETE `/api/admin/recommendation-rules/:id`
Delete/deactivate a recommendation rule.

## 10. OpenWeatherMap Integration

The backend should:
1. receive a city/date request;
2. validate the request;
3. call OpenWeatherMap;
4. normalize the relevant response fields;
5. return only the data required by SkyPlan;
6. handle external API errors safely.

The browser should not directly receive or expose the OpenWeatherMap API key.

## 11. API Validation

Validate:
- required parameters;
- date format;
- city input;
- authenticated ownership;
- admin role for administrative routes.

## 12. API Security

- Require authentication for protected endpoints.
- Enforce admin authorization on admin endpoints.
- Do not trust role information supplied only by the frontend.
- Do not expose passwords or password hashes.
- Do not expose API secrets.
- Handle malformed requests without server crashes.

## 13. API Testing

Postman is identified by the proposal as an API-testing tool. API tests should cover:
- successful requests;
- invalid input;
- unauthenticated requests;
- unauthorized role access;
- external API failures;
- persistence operations.
