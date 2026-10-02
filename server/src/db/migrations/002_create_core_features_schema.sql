-- ==============================================================================
-- Migration: 002_create_core_features_schema.sql
-- Purpose: Create favorite_cities, search_history, activities, activity_interest_tags,
--          and recommendation_rules tables with default seed data
-- ==============================================================================

-- 1. Favorite Cities Table
CREATE TABLE IF NOT EXISTS favorite_cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    city_name VARCHAR(150) NOT NULL,
    country_code VARCHAR(10),
    lat NUMERIC(9, 6),
    lon NUMERIC(9, 6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT favorite_cities_user_city_unique UNIQUE (user_id, city_name)
);

CREATE INDEX IF NOT EXISTS idx_favorite_cities_user ON favorite_cities(user_id);

-- 2. Search History Table (Logs both authenticated user searches and guest query analytics)
CREATE TABLE IF NOT EXISTS search_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    city_name VARCHAR(150) NOT NULL,
    requested_date VARCHAR(50) DEFAULT 'Today',
    weather_summary_json JSONB,
    is_guest BOOLEAN NOT NULL DEFAULT false,
    searched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_search_history_user ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_city ON search_history(city_name);
CREATE INDEX IF NOT EXISTS idx_search_history_searched_at ON search_history(searched_at DESC);

-- 3. Activities Catalog Table
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(20) NOT NULL CHECK (category IN ('OUTDOOR', 'INDOOR')),
    default_time_slot VARCHAR(50) DEFAULT '09:00 - 13:00',
    icon_name VARCHAR(50) DEFAULT 'Compass',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category);

-- 4. Activity to Interest Tags Mapping Table
CREATE TABLE IF NOT EXISTS activity_interest_tags (
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    interest_tag_id UUID NOT NULL REFERENCES interest_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (activity_id, interest_tag_id)
);

-- 5. Recommendation Rules Engine Table
CREATE TABLE IF NOT EXISTS recommendation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    min_temp NUMERIC(4, 1) DEFAULT 10.0,
    max_temp NUMERIC(4, 1) DEFAULT 35.0,
    max_precip_chance NUMERIC(4, 1) DEFAULT 30.0,
    max_wind_speed NUMERIC(5, 2) DEFAULT 30.0,
    allowed_weather_conditions TEXT[] DEFAULT ARRAY['Clear', 'Clouds', 'Few Clouds', 'Partly Cloudy'],
    priority INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_recommendation_rules_activity ON recommendation_rules(activity_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_rules_active ON recommendation_rules(is_active);

-- ==============================================================================
-- Default Seed Data for Activities & Recommendation Rules
-- ==============================================================================

-- Seed Activities
INSERT INTO activities (name, description, category, default_time_slot, icon_name)
VALUES
    ('Hiking & Nature Trails', 'Scenic mountain trekking, alpine foothill paths, and forested trail excursions.', 'OUTDOOR', '08:00 - 13:00', 'Compass'),
    ('Lake & River Kayaking', 'Paddling along tranquil lakes and gentle river currents.', 'OUTDOOR', '09:00 - 12:00', 'Droplets'),
    ('Outdoor Cycling & Biking', 'Road biking and countryside gravel trails with mild gradients.', 'OUTDOOR', '13:00 - 17:00', 'Activity'),
    ('Landscape Photography & Sightseeing', 'Capturing vistas, botanical vistas, and golden-hour architectural sights.', 'OUTDOOR', '07:00 - 10:30', 'Sun'),
    ('Open-Air Park Picnic & Relaxation', 'Casual park gathering with fresh breezes and mild sunshine.', 'OUTDOOR', '11:30 - 15:00', 'Sun'),
    ('Paragliding & Aerial Sports', 'Tandem paragliding and thermal air sports requiring clear visibility and steady winds.', 'OUTDOOR', '10:00 - 13:00', 'Wind'),
    ('Museum & Art Gallery Visit', 'Cultural exhibitions, heritage tours, and historical gallery visits in climate-controlled spaces.', 'INDOOR', '10:00 - 17:00', 'Sparkles'),
    ('Artisan Cafe & Bookstore Reading', 'Cozy reading and specialty coffee in an ambient indoor lounge.', 'INDOOR', '11:00 - 18:00', 'Sparkles'),
    ('Indoor Rock Climbing & Fitness Gym', 'Sport climbing and functional training in high-spec indoor arenas.', 'INDOOR', '08:00 - 20:00', 'Activity'),
    ('Cinema, Theater & Concerts', 'Performing arts, live theatre, and cinematic screenings.', 'INDOOR', '18:00 - 22:00', 'Sparkles')
ON CONFLICT (name) DO NOTHING;

-- Associate Activities with Interest Tags
INSERT INTO activity_interest_tags (activity_id, interest_tag_id)
SELECT a.id, it.id
FROM activities a, interest_tags it
WHERE 
    (a.name = 'Hiking & Nature Trails' AND it.name = 'Hiking & Nature Trails') OR
    (a.name = 'Lake & River Kayaking' AND it.name = 'Kayaking & Water Sports') OR
    (a.name = 'Outdoor Cycling & Biking' AND it.name = 'Cycling & Biking') OR
    (a.name = 'Landscape Photography & Sightseeing' AND it.name = 'Outdoor Photography') OR
    (a.name = 'Open-Air Park Picnic & Relaxation' AND it.name = 'Park Picnics & Strolling') OR
    (a.name = 'Paragliding & Aerial Sports' AND it.name = 'Hiking & Nature Trails') OR
    (a.name = 'Museum & Art Gallery Visit' AND it.name = 'Museums & Art Galleries') OR
    (a.name = 'Artisan Cafe & Bookstore Reading' AND it.name = 'Cafes & Reading') OR
    (a.name = 'Indoor Rock Climbing & Fitness Gym' AND it.name = 'Indoor Climbing & Bouldering') OR
    (a.name = 'Cinema, Theater & Concerts' AND it.name = 'Cinema & Theater')
ON CONFLICT DO NOTHING;

-- Seed Recommendation Rules
INSERT INTO recommendation_rules (activity_id, name, min_temp, max_temp, max_precip_chance, max_wind_speed, allowed_weather_conditions, priority)
SELECT 
    a.id,
    'Rule: ' || a.name,
    CASE 
        WHEN a.name = 'Hiking & Nature Trails' THEN 8.0
        WHEN a.name = 'Lake & River Kayaking' THEN 14.0
        WHEN a.name = 'Outdoor Cycling & Biking' THEN 10.0
        WHEN a.name = 'Paragliding & Aerial Sports' THEN 12.0
        WHEN a.category = 'INDOOR' THEN -20.0
        ELSE 10.0
    END,
    CASE 
        WHEN a.name = 'Hiking & Nature Trails' THEN 28.0
        WHEN a.name = 'Lake & River Kayaking' THEN 32.0
        WHEN a.name = 'Outdoor Cycling & Biking' THEN 30.0
        WHEN a.name = 'Paragliding & Aerial Sports' THEN 26.0
        WHEN a.category = 'INDOOR' THEN 50.0
        ELSE 35.0
    END,
    CASE 
        WHEN a.name = 'Hiking & Nature Trails' THEN 25.0
        WHEN a.name = 'Lake & River Kayaking' THEN 15.0
        WHEN a.name = 'Outdoor Cycling & Biking' THEN 20.0
        WHEN a.name = 'Paragliding & Aerial Sports' THEN 10.0
        WHEN a.category = 'INDOOR' THEN 100.0
        ELSE 30.0
    END,
    CASE 
        WHEN a.name = 'Hiking & Nature Trails' THEN 28.0
        WHEN a.name = 'Lake & River Kayaking' THEN 18.0
        WHEN a.name = 'Outdoor Cycling & Biking' THEN 25.0
        WHEN a.name = 'Paragliding & Aerial Sports' THEN 18.0
        WHEN a.category = 'INDOOR' THEN 150.0
        ELSE 35.0
    END,
    CASE 
        WHEN a.category = 'INDOOR' THEN ARRAY['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm', 'Snow', 'Mist', 'Fog']
        WHEN a.name = 'Paragliding & Aerial Sports' THEN ARRAY['Clear', 'Few Clouds']
        ELSE ARRAY['Clear', 'Clouds', 'Few Clouds', 'Partly Cloudy']
    END,
    CASE WHEN a.category = 'OUTDOOR' THEN 10 ELSE 5 END
FROM activities a
ON CONFLICT DO NOTHING;
