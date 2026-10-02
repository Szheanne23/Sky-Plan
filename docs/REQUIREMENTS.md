# SkyPlan — Requirements Specification

## 1. Purpose

This document converts the SkyPlan proposal into testable system requirements.

Requirements marked **PROPOSAL** are directly derived from the paper. Requirements marked **IMPLEMENTATION** are technical interpretations needed to build the system and may be refined during development.

## 2. Functional Requirements

### FR-001 — Registration
**Source:** Proposal  
The system shall allow users to create an account.

### FR-002 — Login
**Source:** Proposal  
The system shall allow registered users to securely log in.

### FR-003 — Role-Based Access
**Source:** Proposal  
The system shall support user, admin, and guest access levels.

### FR-004 — Profile
**Source:** Proposal  
Registered users shall be able to view and update personal information.

### FR-005 — Interest Tags
**Source:** Proposal  
Registered users shall be able to maintain activity-interest preferences.

### FR-006 — City Search
**Source:** Proposal  
Users shall be able to enter a city for weather retrieval.

### FR-007 — Date Search
**Source:** Proposal  
Users shall be able to specify a date for weather/activity planning.

### FR-008 — Weather Forecast
**Source:** Proposal  
The system shall retrieve and display weather information through OpenWeatherMap.

### FR-009 — Multi-Day Forecast
**Source:** Proposal  
The system shall display multi-day forecast information for planning ahead.

### FR-010 — Activity Recommendations
**Source:** Proposal  
The system shall recommend indoor or outdoor activities using weather conditions and selected interests.

### FR-011 — Favorites
**Source:** Proposal  
Registered users shall be able to save favorite cities.

### FR-012 — Search History
**Source:** Proposal  
Registered users shall be able to view previous searches.

### FR-013 — Guest Search
**Source:** Proposal  
Guests shall be able to perform limited weather searches without saving favorites or history.

### FR-014 — Recommendation Rule Configuration
**Source:** Proposal  
Admins shall be able to configure activity-recommendation rules.

### FR-015 — Usage Statistics
**Source:** Proposal  
Admins shall be able to view system usage statistics.

### FR-016 — Search Logs
**Source:** Proposal  
Admins shall be able to review search activity/logs.

### FR-017 — Popular Searches
**Source:** Proposal  
The admin dashboard shall provide information about popular searches.

### FR-018 — User/System Management
**Source:** Proposal  
The administration area shall support management of user accounts and system parameters.

### FR-019 — Responsive Interface
**Source:** Proposal  
The web interface shall be responsive and user-friendly.

## 3. Non-Functional Requirements

### NFR-001 — Security
The implementation shall protect authenticated functionality and enforce role-based authorization.

### NFR-002 — API Protection
**IMPLEMENTATION:** External API credentials shall not be exposed in browser-side source code. Weather requests should pass through the backend/API layer.

### NFR-003 — Validation
**IMPLEMENTATION:** User input shall be validated before processing.

### NFR-004 — Error Handling
**IMPLEMENTATION:** API failures, invalid searches, authentication failures, and unavailable weather data shall produce understandable user-facing errors.

### NFR-005 — Maintainability
**IMPLEMENTATION:** Frontend, backend, database, authentication, and recommendation logic should remain logically separated.

### NFR-006 — Responsiveness
The interface should remain usable across desktop and mobile viewport sizes.

### NFR-007 — API Dependency Awareness
The application must handle unavailable or failed OpenWeatherMap responses without crashing.

## 4. Requirement Traceability

| Requirement Area | Proposal Section |
|---|---|
| Authentication | Objectives 3.2; User Management |
| Profile/Interests | Scope; User Management |
| Weather | Objectives; Core Module |
| Forecast | Objectives; Core Module |
| Recommendations | Objectives; Core Module |
| Favorites/History | Objectives; Core Module |
| Guest Mode | Scope; Core Module |
| Admin Dashboard | Objectives; Reporting |
| Rule Configuration | Objectives; Administration |
| Responsive UI | Objectives; Scope |
| Technology | Technology Stack |

## 5. Acceptance Principle

A feature is not considered complete merely because its screen exists. It should have:
- working frontend behavior;
- working backend/API behavior where applicable;
- appropriate persistence where required;
- authorization where required;
- error handling;
- basic validation; and
- integration with related modules.
