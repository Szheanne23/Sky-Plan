---
name: Atmospheric Elevation
colors:
  surface: '#0a122a'
  surface-dim: '#0a122a'
  surface-bright: '#313852'
  surface-container-lowest: '#050d25'
  surface-container-low: '#131a33'
  surface-container: '#171e37'
  surface-container-high: '#212942'
  surface-container-highest: '#2c344d'
  on-surface: '#dbe1ff'
  on-surface-variant: '#bcc9ce'
  inverse-surface: '#dbe1ff'
  inverse-on-surface: '#282f49'
  outline: '#869398'
  outline-variant: '#3d494d'
  surface-tint: '#4cd6fb'
  primary: '#4cd6fb'
  on-primary: '#003642'
  primary-container: '#00b4d8'
  on-primary-container: '#00414f'
  inverse-primary: '#00677d'
  secondary: '#adc6ff'
  on-secondary: '#002e69'
  secondary-container: '#006be3'
  on-secondary-container: '#f2f4ff'
  tertiary: '#ffb781'
  on-tertiary: '#4e2500'
  tertiary-container: '#fc8602'
  on-tertiary-container: '#5e2e00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#b3ebff'
  primary-fixed-dim: '#4cd6fb'
  on-primary-fixed: '#001f27'
  on-primary-fixed-variant: '#004e5f'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a41'
  on-secondary-fixed-variant: '#004494'
  tertiary-fixed: '#ffdcc4'
  tertiary-fixed-dim: '#ffb781'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#703800'
  background: '#0a122a'
  on-background: '#dbe1ff'
  surface-variant: '#2c344d'
typography:
  display-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.05em
  metric-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies an **Atmospheric Elevation & Dynamic Weather Spectrum** design philosophy. It balances scientific meteorology with outdoor human experience. Rather than defaulting to stark, clinical data tables or aggressive deep-dark gamified screens, the UI evokes twilight skylines, morning mist, and golden hour clarity.

### Personality & Emotional Response
- **Vibrant & Lucid:** Information feels alive. Micro-gradients and luminous accents reflect shifting atmospheric states without causing cognitive fatigue.
- **Authoritative & Trustworthy:** Precision numerical readings, tabular metrics, and unambiguous conditions reassure planners, adventurers, and casual explorers alike.
- **Tactile Atmospheric Depth:** Frosted glass panels (glassmorphism), deep atmospheric slate foundations, and translucent layered membranes mirror the physical layers of the troposphere.

### Design Movement
A fusion of **Refined Glassmorphism** and **Modern Functional Utility**. Frosted surfaces layered over rich twilight navy tones provide structural depth, while luminous color accents signal activity suitability and imminent weather shifts.

## Colors

The palette is rooted in the natural cycle of the atmosphere—from nautical twilight to midday sun and golden dusk.

### Primary Spectrum & Functional Roles
- **Primary (`#00B4D8` / Sky Azure):** Drives key interactive controls, selected states, forecast wave peaks, and live status beacons.
- **Secondary (`#3A86FF` / Twilight Royal):** Anchors navigation anchors, primary action buttons, and active tabs.
- **Tertiary (`#FB8500` / Golden Hour Amber):** Highlights UV hazards, thermal warnings, sunset timings, and warning pill highlights.
- **Condition Emerald (`#06D6A0`):** Dedicated token for "Optimal", "Peak Condition", and safe outdoor windows.
- **Neutral Deep Base (`#0B132B` / Abyssal Navy):** Root canvas layer.
- **Neutral Elevated Tier (`#1C2541` / Atmospheric Slate):** Base card backgrounds and persistent container panels.
- **Neutral Surface White (`#F8F9FA` / Cloud Pearl):** High-contrast typography and icon glyphs.

### Application Rules
- Use multi-stop translucent linear gradients (`rgba(28, 37, 65, 0.7)` to `rgba(11, 19, 43, 0.85)`) on frosted cards to prevent visual flatness.
- Accent colors (`#06D6A0`, `#FB8500`, `#00B4D8`) must never occupy more than 15% of any viewport to preserve readability.

## Typography

Typography establishes an instant hierarchy between narrative context, categorical labels, and dynamic numerical data.

- **Headlines (`Plus Jakarta Sans`):** Warm geometric construction with smooth terminals. Sets a contemporary, premium tone for place names, condition overviews, and hero cards.
- **Body & Data (`Inter`):** Selected for high legibility at micro scales. Essential configuration: `font-feature-settings: 'tnum' 1, 'cv05' 1` must be applied platform-wide to guarantee that weather charts, timeline bars, and decimal readings (wind speeds, coordinates, barometer readings) align without jitter.
- **Metric Displays:** Designed specifically for temperature readouts, UV index scores, and percentage badges.

## Layout & Spacing

The layout is built on a **12-column responsive grid** engineered for a primary desktop target of 1440px (max container width: 1360px), scaling fluidly down to tablet and mobile.

### Grid Architecture
- **Desktop (1024px+):** 12 columns, `1.5rem` (24px) gutters, `3rem` (48px) margins. Typical split: 4 columns for sticky location search & diurnal timeline; 8 columns for activity suitability matrix, interactive radar canvas, and hourly forecast plots.
- **Tablet (768px - 1023px):** 8 columns, `1.25rem` (20px) gutters, `2rem` (32px) margins. Side-by-side modules fold into stacked vertical cards.
- **Mobile (< 768px):** 4 columns, `1rem` (16px) gutters, `1.25rem` (20px) margins. Horizontal scrolling feeds for hourly curves and category interest chips.

### Spacing Rhythm
Component layouts follow a strict 4px/8px modular cadence. Tight data pairings (e.g., metric label to value) use `space-xs` (4px) or `space-sm` (8px). Structural padding inside weather cards relies exclusively on `space-lg` (24px) to sustain an airy, uncrowded feel.

## Elevation & Depth

Visual hierarchy uses **atmospheric layering** rather than opaque drop shadows. Elevation corresponds directly to physical altitude metaphors:

1. **Troposphere Level 0 (Canvas Base):**
   - Solid `#0B132B` tinted with soft atmospheric radial glows (`rgba(58, 134, 255, 0.08)` top-right; `rgba(0, 180, 216, 0.05)` bottom-left).
2. **Strato Level 1 (Primary Dashboards & Weather Cards):**
   - Translucent background: `rgba(28, 37, 65, 0.65)`
   - Backdrop blur: `16px`
   - Border: 1px continuous hairline `rgba(248, 249, 250, 0.08)`
   - Subtle ambient shadow: `0 8px 32px -4px rgba(0, 0, 0, 0.35)`
3. **Meso Level 2 (Floating Popovers, Activity Modals, Hour Tooltips):**
   - Translucent background: `rgba(37, 50, 85, 0.85)`
   - Backdrop blur: `24px`
   - Border: 1px hairline `rgba(72, 202, 228, 0.25)`
   - Dynamic shadow: `0 16px 40px -8px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(72, 202, 228, 0.15)`
4. **Exo Level 3 (Active Indicators & Glowing Pointers):**
   - Luminous neon edge bleeding using box-shadow glows: `0 0 12px rgba(0, 180, 216, 0.45)`.

## Shapes

The geometric signature uses **Curved Aerodynamic Radii** (Level 2). This creates soft aerodynamic forms reminiscent of weather balloons, wind streamlines, and natural cloud forms, avoiding rigid enterprise corners.

- **Primary Cards & Containers:** `rounded-lg` (16px / 1rem) for structural harmony and balanced content framing.
- **Interactive Modals & Feature Banners:** `rounded-xl` (24px / 1.5rem) to reinforce floating elevation.
- **Pills, Activity Chips, & Condition Badges:** Fully circular/capsule geometry (`border-radius: 9999px`) to emphasize them as discrete, clickable objects.

## Components

### Buttons
- **Primary:** Filled gradient from `#3A86FF` to `#00B4D8`, white bold text, `rounded-lg` (16px) or pill. Hover triggers a subtle expansion glow: `box-shadow: 0 4px 20px rgba(0, 180, 216, 0.4)`.
- **Secondary / Glass Button:** Background `rgba(255, 255, 255, 0.06)`, border `1px solid rgba(255, 255, 255, 0.15)`, text `#F8F9FA`. On hover, surface shifts to `rgba(255, 255, 255, 0.12)`.
- **Destructive / Caution:** Background `rgba(251, 133, 0, 0.15)`, border `1px solid rgba(251, 133, 0, 0.4)`, text `#FFB703`.

### Weather Condition Badges & Suitability Pills
- **Optimal (e.g., "98% Optimal"):** Fully rounded capsule. Background `rgba(6, 214, 160, 0.15)`, border `1px solid rgba(6, 214, 160, 0.35)`, text `#06D6A0`. Includes a 6px breathing pulse dot indicator.
- **Caution (e.g., "Caution: Gusts"):** Background `rgba(251, 133, 0, 0.15)`, border `1px solid rgba(251, 133, 0, 0.4)`, text `#FB8500`.
- **Alternative (e.g., "Indoor Alternative"):** Background `rgba(58, 134, 255, 0.12)`, border `1px solid rgba(58, 134, 255, 0.3)`, text `#48CAE4`.

### Category Interest Chips
- Horizontal interactive filter pills (Hiking, Bouldering, Photography, Cycling, Museum, Cafe).
- **Default:** Background `rgba(28, 37, 65, 0.8)`, border `1px solid rgba(255, 255, 255, 0.08)`, text `#EDF2F7`, inline micro-icon.
- **Selected:** Background `#00B4D8`, border `1px solid #48CAE4`, text `#0B132B` with semi-bold typography.

### Input Fields & Location Search
- Input container: Height 48px, background `rgba(17, 24, 49, 0.7)`, border `1px solid rgba(255, 255, 255, 0.12)`, rounded `12px`.
- Typography: `#F8F9FA` with placeholder in `rgba(248, 249, 250, 0.4)`.
- Active focus state: Replaces border with luminous ring `0 0 0 2px rgba(0, 180, 216, 0.5)` and subtle inner background lightening.

### Cards & Atmospheric Modules
- Root glass treatment with internal padding `space-lg` (24px).
- Internal divider lines: 1px hairline `rgba(255, 255, 255, 0.06)`.
- Card Header: Flex row with `headline-sm` title on the left and condition chip / metric pill aligned to the right.

### Hourly Temperature Curve & Timeline
- An interactive SVG spline curve plotting temperature and precipitation probability.
- Line stroke: 3px gradient transitioning from `#00B4D8` (cool/morning) to `#FB8500` (peak midday solar thermal).
- Fill: Vertical linear gradient from `rgba(0, 180, 216, 0.25)` to `rgba(0, 180, 216, 0.0)`.
- Scrubbing cursor: Glowing white vertical line with floating Meso Level 2 tooltip showing activity index score and wind vector.