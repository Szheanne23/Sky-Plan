---
name: Aetherial Aurora
colors:
  surface: '#121029'
  surface-dim: '#121029'
  surface-bright: '#383651'
  surface-container-lowest: '#0d0b24'
  surface-container-low: '#1a1832'
  surface-container: '#1e1d36'
  surface-container-high: '#292741'
  surface-container-highest: '#34324d'
  on-surface: '#e3dfff'
  on-surface-variant: '#c8c4d7'
  inverse-surface: '#e3dfff'
  inverse-on-surface: '#2f2d48'
  outline: '#928ea0'
  outline-variant: '#474554'
  surface-tint: '#c6bfff'
  primary: '#c6bfff'
  on-primary: '#2900a0'
  primary-container: '#6c5ce7'
  on-primary-container: '#faf6ff'
  inverse-primary: '#5847d2'
  secondary: '#43d7f7'
  on-secondary: '#003640'
  secondary-container: '#00bbda'
  on-secondary-container: '#004653'
  tertiary: '#c5c0ff'
  on-tertiary: '#2a1f7e'
  tertiary-container: '#6d66c4'
  on-tertiary-container: '#faf6ff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e4dfff'
  primary-fixed-dim: '#c6bfff'
  on-primary-fixed: '#160066'
  on-primary-fixed-variant: '#4029ba'
  secondary-fixed: '#abedff'
  secondary-fixed-dim: '#43d7f7'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#e3dfff'
  tertiary-fixed-dim: '#c5c0ff'
  on-tertiary-fixed: '#140067'
  on-tertiary-fixed-variant: '#413996'
  background: '#121029'
  on-background: '#e3dfff'
  surface-variant: '#34324d'
typography:
  display-hero:
    fontFamily: Outfit
    fontSize: 80px
    fontWeight: '200'
    lineHeight: 84px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Outfit
    fontSize: 56px
    fontWeight: '200'
    lineHeight: 60px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Outfit
    fontSize: 36px
    fontWeight: '400'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Outfit
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 30px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.08em
  metric-digit:
    fontFamily: Outfit
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.5rem
  gutter-desktop: 2rem
  margin: 1.25rem
  margin-tablet: 2rem
  margin-desktop: 3.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

This design system embodies celestial observation, diurnal transitions, and ambient atmospheric discovery. Designed for high-fidelity weather tracking, celestial event stargazing, and outdoor activity planning, it transports users into an immersive nocturnal-to-diurnal journey. The experience bridges the tranquil expanse of midnight mountain vistas with the revitalizing clarity of midday skies.

The aesthetic philosophy centers on **Frosted Celestial Glassmorphism**:
- Multi-layered frosted glass panels, capsule pills, and organic floating cards suspended above deep starlit gradients and alpine twilight sceneries.
- Soft, translucent depth enriched by micro-specular rim lighting, diffuse starlight glows, and tactile physical softness.
- A luminous, dreamy presence that avoids visual fatigue through deep violet-indigo low-light foundations paired with crisp starlight white typography and ethereal lilac-cyan status accents.

## Colors

The palette captures twilight-to-dawn transitions, banishing oversaturated alerts in favor of cosmic purples, luminous twilight indigos, and refreshing sky blues.

### Twilight Spectrum & Celestial Roles
- **Primary (`#6C5CE7` - Royal Twilight Violet):** Anchors primary actions, active capsule selections, primary metric accents, and dominant glowing indicators.
- **Secondary (`#48DBFB` - Celestial Daybreak Cyan):** Represents precipitation, active diurnal conditions, wind paths, and energetic secondary focal points.
- **Tertiary (`#A29BFE` - Starlight Lilac):** Used for ambient secondary states, sub-captions, subtle highlights, and soft gradient counterpoints.
- **Neutral Deep (`#0D0B24` - Cosmic Midnight Abyss):** The canvas floor for backdrop gradients, bottom sheets, and high-depth recessions.
- **Surface Elevation Tints:**
  - *Base Sky Canvas:* Linear gradient from `#0B0826` to `#1D174C` overlaid with subtle starry dust.
  - *Glass Frost (Elevated Card):* `rgba(32, 26, 75, 0.45)` with `backdrop-filter: blur(28px)`.
  - *Glass Frost (Floating Pill / Capsule):* `rgba(108, 92, 231, 0.22)` with `backdrop-filter: blur(16px)`.
- **Borders & Specular Highlights:** 1px rim stroke composed of a top-down linear gradient: `rgba(255, 255, 255, 0.28)` fading to `rgba(162, 155, 254, 0.06)`.
- **Text & Semantics:**
  - *Text High-Emphasis:* Starlight White (`#F8F9FE`).
  - *Text Medium-Emphasis:* Misty Celestial Silver (`#B4B9DC`).
  - *Text Low-Emphasis:* Nocturne Slate (`#787A9E`).
  - *Success / Good Air Quality:* Aurora Mint (`#00D2D3`).
  - *Attention / Advisory:* Twilight Rose Lilac (`#E056FD`).

## Typography

The type system blends the geometric grace and airy lightness of **Outfit** for celestial display numerals, temperatures, and location headlines with the legible, friendly clarity of **Plus Jakarta Sans** for telemetry metrics, observational subtext, and navigation.

- **Numerals & Temperature Displays:** Rendered in `display-hero` with an ultra-light weight (`200`) and slight negative tracking, evoking a refined, scientific elegance.
- **Capsule & Telemetry Labels:** Styled in `label-sm` with uppercase transformation and loose tracking (`0.08em`) to guarantee quick glances in outdoor or high-glare settings.
- **Content Hierarchy:** Starlight white is reserved strictly for current temperatures and primary headers; all accompanying data (wind speed, humidity labels, precipitation timestamps) adopts twilight silver to preserve visual layering.

## Layout & Spacing

Layouts follow an airy 8pt base grid rhythm, balancing dense informational telemetry (UV index, barometric pressure, wind bearing) with unhurried celestial headroom.

### Grid & Responsiveness
- **Mobile (Base):** 4-column fluid layout with dynamic margins (`1.25rem`) and compact gutters (`1rem`). Emphasizes single-column vertical weather stories with horizontal-scrolling hourly capsules.
- **Tablet:** 8-column layout with 24px gutters. Dual-pane presentation with persistent atmospheric status on the left and activity planning/forecast cards on the right.
- **Desktop:** 12-column layout (maximum container width `1280px`). Multi-metric telemetry dashboards featuring modular glass cards, interactive celestial radial dials, and expanded mountain vista viewports.
- **Breathing Room:** Major screen headers receive expansive vertical top spacing (`space-xl` to `3rem`) to showcase sky backdrops and starry nightscapes unobstructed.

## Elevation & Depth

Visual hierarchy does not rely on opaque shadows. Instead, it leverages atmospheric multi-tier glassmorphism, varying blur radii, and specular edge reflections:

1. **Backdrop Canvas (Ground Level):**
   Continuous deep violet-to-indigo radial gradient (`radial-gradient(circle at 50% 20%, #2A1F62 0%, #0D0A24 100%)`) sprinkled with delicate starlight noise layers.

2. **Base Atmospheric Tier (Bottom Sheet & Structural Modules):**
   - Background: `rgba(24, 19, 58, 0.65)`
   - Backdrop Blur: `24px`
   - Border: `1px solid rgba(255, 255, 255, 0.12)`
   - Inner Glow: `inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)`

3. **Floating Glass Capsules & Telemetry Cells (Mid-Level):**
   - Background: `rgba(45, 36, 102, 0.45)`
   - Backdrop Blur: `18px`
   - Shadow: `0 8px 32px -4px rgba(6, 4, 20, 0.5)`
   - Border: `1px solid rgba(255, 255, 255, 0.22)`
   - Dynamic Interaction: Glows softly on touch/hover (`box-shadow: 0 0 20px 2px rgba(108, 92, 231, 0.35)`).

4. **Floating Action Hub & Navigation (Top Level):**
   - High-luminance circular pill buttons with an iridescent edge highlight and `backdrop-filter: blur(32px)`.
   - Elevated float offset: `0 16px 40px rgba(0, 0, 0, 0.45)`.

## Shapes

The system embraces a **Pill-Shaped** (level `3`) aesthetic. Rounded curves mimic atmospheric bubbles, droplet contours, and the celestial sweep of planetary horizons.

- **Capsules & Chips:** Fully radiused stadium pills (`rounded-full` / `9999px`) used for hourly weather nodes, toggles, filter chips, and primary floating action buttons.
- **Telemetry & Information Cards:** Hyper-rounded corners (`rounded-xl` / `24px` to `32px` on mobile, scaling up to `40px` for bottom drawer sheets).
- **Asymmetric Dynamic Slopes:** Weather condition list items utilize organic fluid curves and diagonal sweeps (as seen in stylized weather condition list cards) to convey atmospheric drift and wind movement.

## Components

### Buttons & Action Triggers
- **Primary Celestial Action:** Fully pill-shaped (`9999px`). Filled with a luminous linear gradient (`135deg, #7C3AED 0%, #6C5CE7 100%`) bordered by a `1px` starlight-white specular top rim. Hover/active states invoke a diffuse lilac halo (`box-shadow: 0 0 24px rgba(124, 58, 237, 0.5)`).
- **Glass Floating Action (FAB):** Circular (`48px` or `56px`), pure frosted glass (`rgba(255, 255, 255, 0.15)`) with an embossed centered glyph, hovering effortlessly over content.

### Weather Horizon Capsules (Hourly Forecast)
- Vertical pill containers (`width: 64px`, `height: 120px`, `border-radius: 32px`).
- Inactive state: Deep twilight glass (`rgba(255, 255, 255, 0.05)`).
- Active state ("Now"): Luminous violet-indigo tint (`rgba(108, 92, 231, 0.4)`), surrounded by a vibrant cyan/lilac rim indicator and soft inner ambient light.

### Telemetry & Activity Cards
- Modular grid tiles (e.g., UV Index, Sunrise Arc, Wind Bearing, Humidity).
- Built with multi-layer frosted glass panels featuring a subtle inner light bounce.
- Dial graphics (like the sunrise horizon arc or compass) use ultra-thin vector tracks in translucent starlight silver, highlighted by neon cyan marker nodes.

### Input & Search Fields
- Fully rounded stadium pill (`height: 48px`).
- Background: Translucent midnight violet (`rgba(25, 20, 56, 0.6)`) with high-blur backdrop filtering.
- Placeholder styled in muted lilac silver (`#787A9E`). Active focus brings a crisp `1px` electric sky-blue rim highlight.

### Segmented Forecast Controls
- Recessed pill base containing an active sliding glass bubble that smoothly glides between options (e.g., "Hourly Forecast" vs "Weekly Forecast").
- Smooth physical easing with soft starlight contrast for the selected label.

### Form Controls (Checkboxes & Switches)
- **Switches:** Pill tracks with a thumb that emits an ambient violet drop glow when active.
- **Checkboxes:** Rounded squares (`8px` corner radius) with starlight lilac checkmarks on cyan/violet filled gradients.