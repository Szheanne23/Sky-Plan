-- ==============================================================================
-- Migration: 001_create_auth_and_user_schema.sql
-- Purpose: Create users, profiles, interest_tags, and user_interests tables
-- ==============================================================================

-- Enable UUID extension if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_email_unique UNIQUE (email),
    CONSTRAINT users_role_check CHECK (role IN ('USER', 'ADMIN'))
);

-- Index for fast user lookup by email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT profiles_user_id_unique UNIQUE (user_id),
    CONSTRAINT fk_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Interest Tags Table
CREATE TABLE IF NOT EXISTS interest_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'GENERAL',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT interest_tags_name_unique UNIQUE (name)
);

-- 4. User Interests Table (Many-to-Many Relationship)
CREATE TABLE IF NOT EXISTS user_interests (
    user_id UUID NOT NULL,
    interest_tag_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, interest_tag_id),
    CONSTRAINT fk_user_interests_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_interests_tag FOREIGN KEY (interest_tag_id) REFERENCES interest_tags(id) ON DELETE CASCADE
);

-- Index for querying interests by user
CREATE INDEX IF NOT EXISTS idx_user_interests_user_id ON user_interests(user_id);

-- Seed System Default Interest Tags
INSERT INTO interest_tags (name, description, category, is_active)
VALUES
    ('Jogging & Running', 'Outdoor cardio and trail running in fair weather conditions', 'OUTDOOR', true),
    ('Hiking & Nature Trails', 'Scenic mountain and park hikes requiring clear or mild conditions', 'OUTDOOR', true),
    ('Picnics & Relaxation', 'Outdoor casual dining and park leisure requiring calm, dry weather', 'OUTDOOR', true),
    ('Cycling & Biking', 'Road or path cycling suitable in dry, moderate wind conditions', 'OUTDOOR', true),
    ('Tennis & Racquet Sports', 'Outdoor court games requiring dry surfaces and low precipitation', 'OUTDOOR', true),
    ('Outdoor Swimming', 'Open-air swimming and watersports during warm, sunny weather', 'OUTDOOR', true),
    ('Photography & Sightseeing', 'Urban and landscape photography favored by dynamic or clear skies', 'OUTDOOR', true),
    ('Indoor Gym & Fitness', 'Indoor strength and cardiovascular training unaffected by rain', 'INDOOR', true),
    ('Museums & Cultural Galleries', 'Indoor exhibits and historical tours ideal during wet or hot weather', 'INDOOR', true),
    ('Cafes & Reading', 'Cozy indoor reading and coffee spots ideal on rainy or chilly days', 'INDOOR', true),
    ('Board Games & Gaming', 'Indoor social and gaming activities during adverse weather', 'INDOOR', true),
    ('Cinema & Theater', 'Indoor movie watching and theatrical performances in any weather', 'INDOOR', true)
ON CONFLICT (name) DO NOTHING;
