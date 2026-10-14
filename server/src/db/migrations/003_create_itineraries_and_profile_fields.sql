-- ========================================================
-- Migration: 003_create_itineraries_and_profile_fields.sql
-- Adds profile avatar & bio, multi-destination itineraries,
-- timeline activities, and sharing capabilities.
-- ========================================================

-- 1. Extend profiles table with avatar_url, bio, and home_city
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS home_city VARCHAR(100);

-- 2. Itineraries Table
CREATE TABLE IF NOT EXISTS itineraries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    destination_city VARCHAR(150) NOT NULL,
    country_code VARCHAR(10),
    occasion VARCHAR(100) DEFAULT 'Vacation',
    start_date DATE,
    end_date DATE,
    description TEXT,
    share_code VARCHAR(64) UNIQUE,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast user itinerary lookups and share link lookups
CREATE INDEX IF NOT EXISTS idx_itineraries_user_id ON itineraries(user_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_share_code ON itineraries(share_code);
CREATE INDEX IF NOT EXISTS idx_itineraries_city ON itineraries(destination_city);

-- 3. Itinerary Activities / Timeline Items Table
CREATE TABLE IF NOT EXISTS itinerary_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    time_slot VARCHAR(50) DEFAULT 'Morning',
    target_date DATE,
    category VARCHAR(50) DEFAULT 'OUTDOOR',
    suitability VARCHAR(50) DEFAULT 'OPTIMAL',
    notes TEXT,
    location_name VARCHAR(255),
    estimated_duration VARCHAR(50),
    order_index INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for ordering activities by itinerary
CREATE INDEX IF NOT EXISTS idx_itinerary_activities_itinerary_id ON itinerary_activities(itinerary_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_activities_order ON itinerary_activities(itinerary_id, order_index ASC);
