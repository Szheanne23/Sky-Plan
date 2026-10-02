# SkyPlan — Project Context

## 1. Project Identity

**Project Name:** SkyPlan: Weather-Based Activity Planner  
**Platform:** Web Application  
**Academic Basis:** IPT2 System Proposal  
**Proposal Date:** September 19, 2026

SkyPlan is proposed as a web-based weather and activity planning application. Its central purpose is to combine weather information with an activity recommendation engine so users can make activity-planning decisions using forecast conditions and their selected interests.

## 2. Proposal Problem

Weather conditions influence decisions about outdoor activities such as jogging, hiking, picnics, and sports. The proposal identifies a fragmented process in which users check weather information on one platform and separately decide which activities are appropriate.

SkyPlan addresses this process by combining weather forecasts and activity recommendations in one web application.

## 3. Purpose

The project aims to:
- streamline weather-based activity planning;
- provide forecast information;
- provide personalized activity recommendations;
- support general users, travelers, and outdoor enthusiasts; and
- demonstrate meaningful third-party API integration through OpenWeatherMap.

## 4. General Objective

To design and develop a web-based weather and activity planning system that provides users with accurate forecasts and personalized activity recommendations.

## 5. Specific Objectives

The proposal specifies the following objectives:
1. Develop secure, role-based user registration and authentication.
2. Retrieve real-time weather data from OpenWeatherMap.
3. Provide multi-day forecast viewing.
4. Automate activity recommendations using weather conditions and user-selected interest tags.
5. Allow registered users to save favorite cities and view search history.
6. Allow administrators to configure activity-recommendation rules.
7. Provide an administrative dashboard of usage statistics and popular searches.
8. Develop a responsive and user-friendly web interface.

## 6. Target Users

### Registered User
General users, travelers, and outdoor enthusiasts who search weather, receive activity suggestions, and save favorites.

### Guest
An unregistered visitor who can perform limited weather searches without saving favorites or search history.

### Admin
The system administrator who manages users, recommendation rules, and reports.

## 7. Scope Baseline

### In Scope
- Registration and login with user/admin/guest role access
- Profile and interest-tag preferences
- City and date weather search
- Multi-day forecast
- Rule-based activity recommendations
- Favorite cities
- Search history
- Guest limited search
- Admin usage statistics and search logs
- Admin activity-rule configuration
- Responsive web interface

### Out of Scope
- Native iOS/Android application
- Hardware procurement
- IoT weather sensors
- Paid third-party API subscriptions
- Content migration from other weather platforms
- SMS or push notifications
- Real-time GPS tracking
- Activity booking/reservation integration

## 8. Proposal Technology Baseline

| Layer | Proposal Technology | Purpose |
|---|---|---|
| Frontend | React.js + Tailwind CSS | Web interface |
| Backend/API | Node.js + Express | Business logic and server processing |
| Database | PostgreSQL | Data storage |
| External API | OpenWeatherMap API | Weather data |
| Authentication | JWT | Authentication and role-based authorization |
| Charts | Chart.js | Weather trends and admin usage statistics |
| Hosting | Vercel + Render | Deployment |
| Version Control | Git / GitHub | Source control |
| Project Management | Trello | Task tracking |
| Other | Figma, Postman | UI/UX design and API testing |

These technologies are the proposal baseline. The final implementation should not change them without an explicit project decision.

## 9. Source-of-Truth Rule

This document and the other initial specification files translate the uploaded proposal into technical documentation. They do not replace the proposal.

When implementation reveals a need for an additional feature or a change in technical design:
1. document the change;
2. identify whether it affects project scope;
3. update the relevant specification;
4. determine whether the academic paper should also be updated.

Do not silently introduce features that materially expand the proposal.
