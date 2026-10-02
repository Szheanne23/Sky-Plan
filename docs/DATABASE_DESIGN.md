# SkyPlan — Database Design

## 1. Purpose

This document defines the PostgreSQL data model supporting the SkyPlan application. 

The application utilizes **Supabase-hosted PostgreSQL** connected securely via Node.js `pg` pool over encrypted SSL connections. Database migrations are managed via the transaction-safe runner in `server/src/db/migrate.js`. Application authentication is handled independently via bcrypt hashing and JWT tokens.

## 2. Proposed Core Entities

### 2.1 users

Purpose: authentication and account identity.

Proposed fields:
- `id`
- `email`
- `password_hash`
- `role`
- `created_at`
- `updated_at`

Suggested roles:
- USER
- ADMIN

Guest users do not need persistent accounts.

### 2.2 profiles

Purpose: registered-user profile information.

Proposed fields:
- `id`
- `user_id`
- `display_name` or equivalent profile fields
- `created_at`
- `updated_at`

### 2.3 interest_tags

Purpose: controlled set of activity interests.

Proposed fields:
- `id`
- `name`
- `description`
- `is_active`

### 2.4 user_interests

Purpose: many-to-many relationship between users and interest tags.

Proposed fields:
- `user_id`
- `interest_tag_id`

Suggested composite uniqueness:
- `(user_id, interest_tag_id)`

### 2.5 favorite_cities

Purpose: saved cities belonging to registered users.

Proposed fields:
- `id`
- `user_id`
- `city_name`
- `country_code` where available
- optional normalized location identifier
- `created_at`

### 2.6 search_history

Purpose: registered-user search records.

Proposed fields:
- `id`
- `user_id`
- `city_name`
- requested forecast date
- searched_at
- optional API/location identifier

### 2.7 recommendation_rules

Purpose: configurable rules used by the recommendation engine.

Potential fields:
- `id`
- weather condition/category
- minimum/maximum threshold where applicable
- activity identifier or activity name
- indoor/outdoor classification
- interest tag association where applicable
- priority
- enabled/disabled state
- `created_at`
- `updated_at`

The exact condition model should be finalized after reviewing OpenWeatherMap response fields and recommendation requirements.

### 2.8 activities

Purpose: structured activity catalog.

Potential fields:
- `id`
- `name`
- `description`
- `activity_type`
- `is_active`

This entity is proposed because a normalized activity catalog makes rule configuration more maintainable.

### 2.9 activity_interest_tags

Purpose: associates activities with interest categories.

Potential fields:
- `activity_id`
- `interest_tag_id`

### 2.10 search_events / analytics data

The proposal requires usage statistics and search logs. These may be implemented using `search_history` plus administrative aggregation, or through a separate event/log table.

The final design should avoid storing duplicate analytics data unless necessary.

## 3. Relationship Overview

```text
users
  |
  +---- profiles
  |
  +---- user_interests ---- interest_tags
  |
  +---- favorite_cities
  |
  +---- search_history

activities ---- activity_interest_tags ---- interest_tags
activities ---- recommendation_rules

recommendation_rules ---- weather conditions
```

## 4. Database Principles

- Use primary keys for persistent entities.
- Use foreign keys for ownership/relationships.
- Add indexes to frequently searched fields.
- Enforce uniqueness where duplicate records should not exist.
- Store passwords only as secure password hashes.
- Avoid storing external API credentials in the database.
- Use timestamps consistently.

## 5. Data Retention

The proposal does not specify retention periods for search history or logs. Do not invent a retention policy until the project decides one.

## 6. Migration Strategy

**IMPLEMENTATION:** Database changes should be managed through versioned migrations rather than manually editing production tables.

The migration tooling is not specified in the proposal and should be selected during implementation.
