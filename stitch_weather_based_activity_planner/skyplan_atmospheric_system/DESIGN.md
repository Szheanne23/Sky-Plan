---
name: SkyPlan Atmospheric System
colors:
  surface: '#0e112a'
  surface-dim: '#0e112a'
  surface-bright: '#343752'
  surface-container-lowest: '#090c25'
  surface-container-low: '#161933'
  surface-container: '#1b1e37'
  surface-container-high: '#252842'
  surface-container-highest: '#30334d'
  on-surface: '#dfe0ff'
  on-surface-variant: '#ccc3d8'
  inverse-surface: '#dfe0ff'
  inverse-on-surface: '#2c2e49'
  outline: '#958da1'
  outline-variant: '#4a4455'
  surface-tint: '#d2bbff'
  primary: '#d2bbff'
  on-primary: '#3f008e'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#732ee4'
  secondary: '#ffb694'
  on-secondary: '#571f00'
  secondary-container: '#923900'
  on-secondary-container: '#ffba9b'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#007650'
  on-tertiary-container: '#76ffc2'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#ffdbcc'
  secondary-fixed-dim: '#ffb694'
  on-secondary-fixed: '#351000'
  on-secondary-fixed-variant: '#7b2f00'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0e112a'
  on-background: '#dfe0ff'
  surface-variant: '#30334d'
typography:
  display-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
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
    letterSpacing: 0em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.005em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.03em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

The design system embodies an atmospheric, cinematic, and deeply tactile experience. Conceived for advanced sky navigation, meteorological planning, and spatial flight intelligence, the interface merges the serenity of nocturnal cosmic skies with the precise luminous clarity of modern avionics and cockpit instrumentation.

### Emotional Disposition & Personality
- **Cosmic Immersion:** The feeling of ascending into the upper stratosphere during twilight—deep, infinite, and reassuringly stable.
- **Precision Tactility:** Physical, soft-molded glass panels with subtle inner highlights that feel crafted and touchable, grounding abstract atmospheric data into tangible instruments.
- **Electric Legibility:** High-contrast, crisp typography and glowing data meters that cut through deep midnight indigo layers like runway approach lights.

### Aesthetic Movement
A hybrid blend of **Refined Glassmorphism** and **Tactile Neomorphism**:
- Semi-transparent, layered glass containers with intense background diffusion (`backdrop-blur: 24px–32px`).
- Fine specular highlights along top container perimeters (`1px inset border` simulating light caught on beveled glass).
- Pill-shaped interaction points and continuous smooth curves that eliminate harsh visual friction.

## Colors

The system is constructed around a dark-first color hierarchy representing stages of twilight and cosmic night, illuminated by active instrument glows.

### Color Palette Strategy

- **Cosmic Canvas & Deep Base (Neutrals):**
  - Cosmic Void (Canvas): `#0A0D1F`
  - Night Sky Base (Primary Canvas): `#0F122B`
  - Elevated Container / Midnight Surface: `#171B3E`
  - Frosted Substratum: `rgba(23, 27, 62, 0.65)`

- **Twilight Purples (Primary & Focal Action):**
  - Radiant Violet (Primary Active): `#7C3AED`
  - Luminous Iris (Hover & Focus): `#8B5CF6`
  - Deep Twilight (Pressed / Subdued Fill): `#6358DC`
  - Violet Beacon Glow: `rgba(124, 58, 237, 0.35)`

- **Sunset Amber & Solar Flare (Secondary & Warnings):**
  - Horizon Amber: `#FF8A50`
  - Solar Amber Core: `#FFAE42`
  - Radiant Gold: `#F59E0B`
  - Thermal Alert Glow: `rgba(255, 138, 80, 0.30)`

- **Alpine Jade & Stratospheric Cyan (Tertiary & Environmental Data):**
  - Alpine Jade (Normal Conditions / Optimal Status): `#10B981`
  - Stratospheric Cyan (Altitude / Pressure Gauges): `#06B6D4`
  - Environmental Glow: `rgba(16, 185, 129, 0.25)`

- **Text & Foreground Metrics:**
  - Pristine Glacial White (High-Contrast Primary Text): `#FFFFFF`
  - Starlight Mauve (Secondary Text): `#C4C8E2`
  - Muted Exosphere (Tertiary Text / Disables): `#8288AF`

## Typography

The design system relies on **Plus Jakarta Sans** across all roles to achieve a clean, geometry-forward aesthetic with crisp legibility against dark, atmospheric backgrounds.

### Typographic Hierarchy Rules
- **Numerical & Meter Readouts:** Numbers representing critical flight and weather values (e.g., temperature, barometric pressure, crosswind velocity) utilize `display-xl` or `headline-lg` with `fontWeight: 800` to deliver instant, glanceable cognition.
- **Caps & Micro-Instrumentation:** Sub-labels, sensor indicators, and secondary navigation elements use `label-sm` or `label-md` with `letterSpacing: 0.05em` and `text-transform: uppercase` to maintain crisp readability on small glass tiles.
- **Anti-Halation Rendering:** Set `-webkit-font-smoothing: antialiased` across all views. To prevent optical bloom against dark indigo backgrounds, white text over frosted glass avoids pure bold weights where regular or medium achieves optimal optical clarity.

## Layout & Spacing

The layout is built on a responsive 12-column fluid grid system engineered to support flight telemetry decks, atmospheric map canvases, and floating forecast capsules.

### Grid & Responsive Specifications
- **Desktop (>= 1200px):** 12 columns, `margin: 2rem`, `gutter: 1.5rem`. Glass capsules span proportional modules (3, 4, 6, or 12 columns).
- **Tablet (768px – 1199px):** 8 columns, `margin: 1.5rem`, `gutter: 1rem`. Side navigation docks fold into a bottom floating pill dock.
- **Mobile (< 768px):** 4 columns, `margin-mobile: 1rem`, `gutter-mobile: 0.75rem`. Widgets collapse into full-width stacked capsules or horizontally swipeable carousels.

### Spacing Principles
- **Atmospheric Breathing Room:** Dense data readouts must always be framed within generous interior container padding (`space-lg` to `space-xl`) to prevent visual claustrophobia.
- **Component Tightness:** Related telemetry points (e.g., an icon paired with an air quality index) rely on strict micro-spacings (`space-xs` and `space-sm`) to form unified visual instruments.

## Elevation & Depth

Elevation is established via physical light simulation: translucent frosted glass layering, specular rim highlights, and ambient colored back-glows that emanate from active data states.

### Surface Tiers & Translucency
1. **Base Surface (Level 0):** Cosmic night backdrop (`#0F122B` gradient shifting downward to `#171B3E`).
2. **Floated Glass Cards (Level 1):** Background `rgba(23, 27, 62, 0.55)` paired with `backdrop-filter: blur(28px) saturate(160%)`. Outlined with a top-lit perimeter stroke: `1px solid rgba(255, 255, 255, 0.12)`.
3. **Elevated Floating Controls & Active Modals (Level 2):** Background `rgba(32, 38, 82, 0.75)` with `backdrop-filter: blur(36px)`. Border: `1px solid rgba(255, 255, 255, 0.22)`.
4. **Focused / Critical Overlays (Level 3):** Solidified semi-translucent tiles surrounded by an outer aura glow matching the functional state (violet, amber, or jade).

### Shadows and Luminescence
- **Ambient Floor Shadow:** `0 16px 36px -10px rgba(5, 7, 20, 0.65)` for deep natural grounding.
- **Violet Telemetry Aura:** `0 8px 24px -4px rgba(124, 58, 237, 0.40)`.
- **Thermal Amber Aura:** `0 8px 24px -4px rgba(255, 138, 80, 0.35)`.
- **Specular Edge Highlight (Inset):** `inset 0 1px 1px 0 rgba(255, 255, 255, 0.20)` placed on interactive pills to render physical glass refraction.

## Shapes

The design system adopts a tactile, pill-dominated shape language (Level 3). Sharp 90-degree corners are avoided across interactive touchpoints.

### Shape Geometry Rules
- **Buttons, Badges, and Micro-Toggles:** Full continuous pill curvature (`border-radius: 9999px`).
- **Telemetry & Meteorological Cards:** Outer radius set to `rounded-xl` (`2rem` to `2.5rem`), matching the smooth aerodynamic profiles shown in high-altitude navigational instrumentation.
- **Inner Nested Containers:** Nested pill items (e.g., hourly forecast capsules inside a weather card) follow the proportional radius rule (`R_outer - Padding = R_inner`) with a minimum of `1rem` radius.

## Components

### Buttons
- **Primary Pill Action:**
  - Gradient background: Linear 135deg from `#7C3AED` to `#6358DC`.
  - Border: `1px solid rgba(255, 255, 255, 0.25)`.
  - Text: `#FFFFFF`, `label-lg`, center-aligned.
  - Shadow: `0 8px 20px -4px rgba(124, 58, 237, 0.45)`, with an inset rim `inset 0 1px 1px rgba(255, 255, 255, 0.3)`.
  - Hover: Background escalates to `#8B5CF6`, scale `1.02`.
- **Secondary Atmospheric Pill:**
  - Background: `rgba(255, 255, 255, 0.08)`, `backdrop-blur: 16px`.
  - Border: `1px solid rgba(255, 255, 255, 0.15)`.
  - Text: `#C4C8E2`. Hover: `#FFFFFF`, border `rgba(255, 255, 255, 0.30)`.

### Chips & Sensor Badges
- Compact capsules (`height: 28px` to `32px`, `padding: 0 12px`, `border-radius: 9999px`).
- Inactive: Frosted obsidian (`rgba(23, 27, 62, 0.6)`) with muted mauve typography (`#8288AF`).
- Active / Warning (Sunset Amber): Fill `rgba(255, 138, 80, 0.15)`, border `1px solid rgba(255, 138, 80, 0.5)`, text `#FFAE42`.
- Active / Normal (Alpine Jade): Fill `rgba(16, 185, 129, 0.15)`, border `1px solid rgba(16, 185, 129, 0.5)`, text `#10B981`.

### Cards & Modules
- Structured frosted slabs with high-radius corners (`rounded-xl`).
- Background: Linear gradient from `rgba(23, 27, 62, 0.70)` to `rgba(15, 18, 43, 0.85)`.
- Border: `1px solid rgba(255, 255, 255, 0.10)`. Top edge highlight reinforced with an internal CSS radial highlight for ambient refraction.
- Internal hierarchy: Header title in `label-md` (uppercase, starlight mauve), metric display in `display-xl` (glacial white), and contextual status pinned in an amber or jade mini-chip.

### Input Fields
- Enclosed frosted capsules (`height: 48px`, `border-radius: 9999px`).
- Background: `rgba(15, 18, 43, 0.65)`.
- Border: `1px solid rgba(255, 255, 255, 0.12)`.
- Placeholder: `#8288AF`, body text `#FFFFFF`.
- Leading icon: Muted purple icon aligned 16px from left edge.
- Focus: Border switches to `1px solid #7C3AED`, box-shadow `0 0 16px rgba(124, 58, 237, 0.35)`.

### Checkboxes, Switches & Radio Controls
- **Switches:** Rounded slider channel in `rgba(255, 255, 255, 0.12)`. Thumb is a luminous glacial white orb with an active slide into `#7C3AED` coupled with a localized halo (`rgba(124, 58, 237, 0.5)`).
- **Checkboxes:** Smooth squircle (`border-radius: 6px`) in `rgba(255, 255, 255, 0.10)`. Active state triggers `#7C3AED` solid fill with a sharp white checkmark.

### Domain-Specific: Telemetry Pillar (Hourly Forecast)
- Vertical pill capsule (`width: 64px`, `padding: 16px 8px`, `border-radius: 9999px`).
- Top-to-bottom layout: Timestamp label (`label-sm`), 3D weather glyph (cloud/rain/sun), probability percentage (`label-xs`, cyan), and bottom temperature readout (`label-md`, bold white).
- Active/Current hour pill: Illuminated by an all-encompassing gradient (`#7C3AED` into `#6358DC`) with an outer atmospheric glow.