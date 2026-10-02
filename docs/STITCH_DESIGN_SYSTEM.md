# SkyPlan — Google Stitch Design System Specification

## 1. Design Philosophy: Atmospheric Elevation & Frosted Glassmorphism

The SkyPlan visual system embodies an **Atmospheric Elevation & Dynamic Weather Spectrum** design philosophy. It merges scientific meteorological precision with modern, tactile outdoor lifestyle aesthetics:
- **Depth & Atmosphere:** Multi-tiered frosted glass containers (`backdrop-blur: 16px–32px`) suspended over deep cosmic twilight and abyssal navy canvases (`#0a122a` / `#0e112a`).
- **Luminous Legibility:** Crisp, high-contrast typography (`Plus Jakarta Sans` for display numerals/headlines, `Inter` for data labels/body) illuminated by vibrant spectral status accents.
- **Aerodynamic Tactility:** Full capsule pills (`rounded-full` / `9999px`) for interactive triggers, filter chips, weather nodes, and search bars, paired with hyper-rounded cards (`rounded-xl` / `1.25rem–1.5rem`).

---

## 2. Color System Tokens

```css
:root {
  /* Canvas & Atmospheric Surfaces */
  --color-surface: #0a122a;                  /* Canvas Base / Abyssal Navy */
  --color-surface-dim: #0a122a;
  --color-surface-bright: #313852;
  --color-surface-container-lowest: #050d25;
  --color-surface-container-low: #131a33;    /* Primary Card & Module Background */
  --color-surface-container: #171e37;        /* Secondary Cards / Elevated Containers */
  --color-surface-container-high: #212942;   /* Search Input Container / Hover Surfaces */
  --color-surface-container-highest: #2c344d;

  /* Typography & Foreground */
  --color-on-surface: #dbe1ff;               /* Primary Text / Glacial Starlight White */
  --color-on-surface-variant: #bcc9ce;       /* Secondary Text / Misty Silver */
  --color-outline: #869398;                  /* Muted Labels / Inactive Borders */
  --color-outline-variant: #3d494d;          /* Subtle Hairline Dividers */

  /* Spectral Accents & Status */
  --color-primary: #4cd6fb;                  /* Sky Azure / Luminous Cyan */
  --color-primary-container: #00b4d8;        /* Active Pill Fill / Focus Highlights */
  --color-on-primary: #003642;
  --color-on-primary-container: #00414f;

  --color-secondary: #adc6ff;                /* Twilight Blue / Celestial Daybreak */
  --color-secondary-container: #006be3;
  --color-on-secondary: #002e69;

  --color-tertiary: #ffb781;                 /* Golden Hour Solar Amber / UV Warning */
  --color-tertiary-container: #fc8602;
  --color-on-tertiary: #4e2500;

  /* Semantic Activity Suitability Indicators */
  --color-optimal-jade: #06d6a0;             /* 90%+ Optimal Weather Suitability */
  --color-caution-amber: #fb8500;            /* Marginal / Weather Caution */
  --color-indoor-azure: #3a86ff;             /* Recommended Indoor Alternative */

  /* Errors & Severe Weather */
  --color-error: #ffb4ab;
  --color-error-container: #93000a;
}
```

---

## 3. Typography Hierarchy

| Role | Font Family | Size | Weight | Line Height | Letter Spacing | Purpose |
|---|---|---|:---:|---|---|---|
| **`display-xl`** | Plus Jakarta Sans | 56px | 800 | 64px | -0.03em | Hero Temperature & Primary Large Metrics |
| **`headline-lg`** | Plus Jakarta Sans | 36px | 700 | 44px | -0.02em | City / Location Titles & Page Headers |
| **`headline-md`** | Plus Jakarta Sans | 24px | 600 | 32px | -0.01em | Module & Section Titles |
| **`headline-sm`** | Plus Jakarta Sans | 20px | 600 | 28px | 0em | Card Titles & Condition Headlines |
| **`body-lg`** | Inter / Plus Jakarta Sans | 18px | 400 | 28px | 0em | Lead paragraphs & hero summaries |
| **`body-md`** | Inter | 15px | 400 | 22px | 0.005em | Activity descriptions & rationale |
| **`body-sm`** | Inter | 13px | 400 | 18px | 0.01em | Secondary metadata & station timestamps |
| **`label-md`** | Inter / Plus Jakarta Sans | 13px | 600 | 16px | 0.02em | Button text & telemetry subheadings |
| **`label-sm`** | Inter | 11px | 700 | 14px | 0.05em | Uppercase capsule labels & category tags |

*Configuration Note:* Numerical tables and charts must use `font-feature-settings: 'tnum' 1` for tabular numeral alignment without jitter.

---

## 4. Spacing System & Grid

- **Base Rhythm:** 4px / 8px modular cadence.
- **Tokens:**
  - `space-xs`: `0.25rem` (4px) — Metric icon to label gaps
  - `space-sm`: `0.5rem` (8px) — Micro-item spacing
  - `space-md`: `1rem` (16px) — Standard inner padding
  - `space-lg`: `1.5rem` (24px) — Structural card padding
  - `space-xl`: `2rem`–`2.5rem` (32px–40px) — Major section gaps
  - `space-2xl`: `3rem` (48px) — Page hero headroom
- **Responsive Layout Grid:**
  - **Desktop (1024px+):** 12-column grid, max width `1360px`, `gutter: 1.5rem`, `margin: 2rem`–`3rem`.
  - **Tablet (768px–1023px):** 8-column grid, `gutter: 1.25rem`, `margin: 2rem`.
  - **Mobile (<768px):** 4-column grid, `gutter: 0.75rem`–`1rem`, `margin: 1rem`–`1.25rem`.

---

## 5. Elevation, Shadows & Glassmorphism

```css
/* Glassmorphic Layer Tokens */
.stitch-glass-base {
  background: rgba(19, 26, 51, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 16px 36px -10px rgba(5, 7, 20, 0.65);
}

.stitch-glass-elevated {
  background: rgba(27, 34, 66, 0.85);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 48px -12px rgba(5, 7, 20, 0.75);
}

.stitch-pill-interactive {
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.15);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.stitch-pill-interactive:hover {
  box-shadow: 0 0 16px rgba(76, 214, 251, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}
```

---

## 6. Component Primitives

### 6.1 Buttons
- **Primary Pill:** Background linear gradient `135deg, #00b4d8, #006be3`, text `#ffffff`, `rounded-full`, specular top rim `inset 0 1px 1px rgba(255,255,255,0.3)`.
- **Secondary Glass Pill:** Background `rgba(255,255,255,0.08)`, border `1px solid rgba(255,255,255,0.15)`, text `#dbe1ff`.
- **Destructive Pill:** Background `rgba(251, 133, 0, 0.15)`, border `1px solid rgba(251, 133, 0, 0.4)`, text `#ffb781`.

### 6.2 Condition Badges & Suitability Chips
- **Optimal (`98% Optimal`):** Background `rgba(6, 214, 160, 0.15)`, border `1px solid rgba(6, 214, 160, 0.35)`, text `#06d6a0`, with pulsing green live dot.
- **Caution (`Caution: Gusts`):** Background `rgba(251, 133, 0, 0.15)`, border `1px solid rgba(251, 133, 0, 0.4)`, text `#ffb781`.
- **Indoor Alternative:** Background `rgba(58, 134, 255, 0.15)`, border `1px solid rgba(58, 134, 255, 0.35)`, text `#adc6ff`.

### 6.3 Form Controls & Search Capsule
- Height: `48px`, `rounded-full` / `rounded-xl`.
- Background: `rgba(23, 30, 55, 0.75)` with `backdrop-blur: 16px`.
- Border: `1px solid rgba(255, 255, 255, 0.12)`.
- Focus State: `ring-2 ring-primary/40 border-primary shadow-[0_0_16px_rgba(76,214,251,0.3)]`.

### 6.4 Hourly Horizon Capsules (Forecast Nodes)
- Vertical pill geometry (`w-16`, `h-28`, `rounded-full`).
- Top timestamp, weather glyph, rain probability, bottom temperature.
- Active "Now" capsule highlighted in luminous radiant cyan/violet with outer halo glow.

---

## 7. Reusable Screen Patterns

1. **Two-Tier Header Navigation:**
   - Fixed top `h-28` with `bg-surface-dim/80 backdrop-blur-xl`.
   - Upper deck: Brand mark + Global Search Bar (`⌘K`) + Unit Toggle (`°C`/`°F`) + Notifications + User Avatar.
   - Lower deck: Horizontal navigation tabs with pill indicator + Quick saved city chips (`Interlaken 19°C ⛅`, `Boulder 22°C ☀️`).
2. **Dashboard / Weather Hero:**
   - 7-col hero card with dual radial glows (`bg-primary/10`, `bg-tertiary/10`) + 5-col telemetry grid (Precipitation, UV Index, Wind Vector, Humidity, Air Quality).
3. **Activity Recommendation Deck:**
   - Filter chips bar $\rightarrow$ 3-column responsive card grid displaying suitability badge, rationale, time window, and optimal conditions breakdown.
4. **Admin Intelligence Console:**
   - Quota gauge $\rightarrow$ 4 KPI Metric tiles $\rightarrow$ Chart.js throughput canvas $\rightarrow$ Paginated telemetry table.
