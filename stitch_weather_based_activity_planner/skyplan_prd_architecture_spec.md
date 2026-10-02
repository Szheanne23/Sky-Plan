# SkyPlan - Project Specification Document

## 1. Introduction & Overview
SkyPlan is an intelligent web-based weather and activity planning platform combining real-time OpenWeatherMap data with a rule-based activity recommendation engine. It bridges raw meteorological data with personalized lifestyle and outing planning (jogging, hiking, picnics, cycling, indoor museum visits, bouldering, dining, etc.).

## 2. Key Modules & Scope
1. **User Management**: Auth, role-based access (Registered User, Admin, Guest), Profile & personal interest tags (hiking, watersports, photography, family, culinary, indoor leisure).
2. **Core Weather & Forecast Engine**: City and date search, real-time metrics (temperature, precipitation probability, UV index, wind speed, air quality), 7-day multi-day outlook with hourly scrubbers.
3. **Smart Activity Recommendation Engine**: Matches meteorological thresholds (temp range, rain %, wind, sunlight) against user interest tags to score and curate "Optimal", "Fair", and "Indoor Alternative" activity cards with itinerary timelines.
4. **Saved Places & Search History**: Quick-switch favorite cities, comparison mode, and recent query logs.
5. **Admin Operations & Rules Engine**: Custom rule builder for weather conditions -> recommended activities, analytics dashboard for popular searched cities, active users, and system API health.
6. **Guest Mode**: Instant ad-hoc lookup with prompt to save profiles and custom interest tags.

## 3. Technology Stack & Design Direction
- Modern responsive desktop interface, clean layout, atmospheric elevation, crisp meteorological iconography, high-readability metrics.
