# SkyPlan — Stitch UI/UX Reference Inventory

## 1. Reference Folder Location
- **Path:** `c:\Users\markd\OneDrive\Desktop\Shanaha\stitch_weather_based_activity_planner`
- **Source:** Google Stitch Design System & UI Exports for *SkyPlan: Weather-Based Activity Planner*.

---

## 2. Discovered Files & Directory Structure

```text
stitch_weather_based_activity_planner/
├── skyplan_prd_architecture_spec.md
│
├── aetherial_aurora/
│   └── DESIGN.md                              # Starlight Lilac & Twilight Violet design specification
├── atmospheric_elevation/
│   └── DESIGN.md                              # Sky Azure & Atmospheric Slate design specification
├── skyplan_atmospheric_system/
│   └── DESIGN.md                              # Complete Avionics & Stratospheric design tokens
│
├── img_3805.jpeg/screen.png                   # Stitched mobile/tablet UI reference
├── img_3806.jpeg_1/screen.png                 # Stitched mobile/tablet UI reference
├── img_3806.jpeg_2/screen.png                 # Stitched mobile/tablet UI reference
├── img_3807.jpeg_1/screen.png                 # Stitched mobile/tablet UI reference
├── img_3807.jpeg_2/screen.png                 # Stitched mobile/tablet UI reference
├── img_3808.jpeg_1/screen.png                 # Stitched mobile/tablet UI reference
├── img_3808.jpeg_2/screen.png                 # Stitched mobile/tablet UI reference
├── img_3809.jpeg_1/screen.png                 # Stitched mobile/tablet UI reference
├── img_3809.jpeg_2/screen.png                 # Stitched mobile/tablet UI reference
│
├── skyplan_brand_logo/
│   ├── code.html                              # High-fidelity SVG & CSS Brand Logo implementation
│   └── screen.png
├── skyplan_weather_activity_planner/
│   ├── code.html                              # Core Weather & Activity Planner Desktop Screen
│   └── screen.png
├── skyplan_forecast_activity_planner_celestial_night/
│   ├── code.html                              # Celestial Night Mode variant of Core Planner
│   └── screen.png
├── skyplan_forecast_activity_planner_twilight_mode/
│   ├── code.html                              # Twilight Mode variant of Core Planner
│   └── screen.png
├── skyplan_multi_day_itinerary_7_day_forecast/
│   ├── code.html                              # Multi-Day Forecast & Itinerary Timeline Screen
│   └── screen.png
├── skyplan_multi_day_itinerary_celestial_night_mode/
│   ├── code.html                              # Night Mode Itinerary Timeline Screen
│   └── screen.png
├── skyplan_saved_places_city_comparison/
│   ├── code.html                              # Favorite Places & Multi-City Comparison Screen
│   └── screen.png
├── skyplan_saved_places_comparison_night_mode/
│   ├── code.html                              # Night Mode Comparison Screen
│   └── screen.png
├── skyplan_admin_analytics_usage_intelligence/
│   ├── code.html                              # Admin Analytics, Usage Metrics & OWM Quota Screen
│   └── screen.png
├── skyplan_admin_recommendation_rules_engine/
│   ├── code.html                              # Admin Recommendation Rules Builder Screen
│   └── screen.png
├── skyplan_interactive_night_day_preview/
│   ├── code.html                              # Interactive Diurnal Night/Day Transition Simulation
│   └── screen.png
├── skyplan_interactive_weather_particle_engine/
│   ├── code.html                              # Atmospheric Particle Canvas Simulation
│   └── screen.png
├── skyplan_interactive_weather_thunderstorm_simulation/
│   ├── code.html                              # Severe Weather & Thunderstorm Simulation Screen
│   └── screen.png
├── skyplan_altitude_lapse_rate_blizzard_simulation/
│   ├── code.html                              # Alpine Lapse Rate & Blizzard Simulator
│   └── screen.png
├── skyplan_f_hn_wind_thermal_inversion_simulator/
│   ├── code.html                              # Thermal Inversion & Föhn Wind Simulator
│   └── screen.png
└── skyplan_multi_regime_altitude_lapse_rate_engine/
    ├── code.html                              # Atmospheric Boundary Layer Simulation
    └── screen.png
```

---

## 3. Identifiable Screens & Functional Alignment

| Reference Screen Name | Target Academic Module | Visual Role & Layout Structure |
|---|---|---|
| **`skyplan_weather_activity_planner`** | Core Module: Weather Search & Recommendations | 2-Tier Header (Search + Nav + Quick-Cities) $\rightarrow$ Location Bar $\rightarrow$ Hero Weather Card (7 cols) + Metric Grid (5 cols) $\rightarrow$ Hourly Horizon Pills $\rightarrow$ Activity Suitability Matrix (Optimal / Fair / Alternative Cards). |
| **`skyplan_multi_day_itinerary_7_day_forecast`** | Core Module: Multi-Day Forecast | Extended 7-Day interactive cards $\rightarrow$ Diurnal thermal curve $\rightarrow$ Daily scheduled activity timeline blocks. |
| **`skyplan_saved_places_city_comparison`** | Core Module: Favorites & Saved Cities | Side-by-side comparative cards with differential temperature, precipitation delta, and suitability matrix. |
| **`skyplan_admin_analytics_usage_intelligence`** | Reporting: Admin Dashboard & Search Logs | Top Operational Console $\rightarrow$ OpenWeatherMap Quota Ring $\rightarrow$ 4 KPI Metric Cards $\rightarrow$ Hourly Traffic Plot $\rightarrow$ Popular Searched Cities Table. |
| **`skyplan_admin_recommendation_rules_engine`** | Administration: Rule Configuration | Rule Builder Canvas $\rightarrow$ Condition Matrix (Temp, Wind, Rain %) $\rightarrow$ Activity Type Binding $\rightarrow$ Active/Disabled switches $\rightarrow$ Rule Execution Log. |
| **`skyplan_brand_logo`** | Branding & Layout Header | Gradient sun/cloud atmospheric mark $\rightarrow$ `Plus Jakarta Sans` bold logotype $\rightarrow$ Pill tag. |

---

## 4. Identifiable Reusable Design Patterns

1. **Two-Tier Header Navigation:**
   - Top Tier: Brand logo, search capsule (`⌘K`), temperature unit toggle (`°C` / `°F`), notification pill, user profile avatar.
   - Bottom Tier: Navigation pill tabs with active indicator (`bg-primary-container`), quick-access saved city chips with inline weather emojis and temperatures.
2. **Hero Atmospheric Snapshot Card:**
   - 7-column frosted container with background ambient radial glows (`bg-primary/10`, `bg-tertiary/10`).
   - Glacial white `display-xl` temperature readout, feels-like indicator, high/low badges, barometric pressure.
3. **Telemetry & Metric Pills (Hourly Horizon):**
   - Vertical capsule pill containers (`w-16`, `h-28`, `rounded-full`) showing hour, weather icon, precipitation %, and temperature.
   - "Now" / Active hour highlighted with radiant violet/cyan glow.
4. **Activity Suitability Cards:**
   - Category tag (e.g. `Hiking`, `Indoor Climbing`, `Museum`), suitability pill (`98% Optimal` in Jade / `Caution: Gusts` in Amber / `Indoor Alternative` in Azure), suitability score bar, rationale description, and itinerary time slot.
5. **Interactive Filter Chips:**
   - Stadium pill chips (`Outdoor Recreation`, `Indoor Cultural`, `Water Sports`, `High Altitude`) with check icons and active color shifts.

---

## 5. Summary of Ambiguities / Non-Standard Features
- Several simulation screens (`altitude_lapse_rate`, `f_hn_wind_thermal_inversion`) represent advanced meteorological research visualizations created during design exploration. These visual treatments will inform the chart styling for the 7-day forecast and admin charts without expanding the core academic proposal scope.
