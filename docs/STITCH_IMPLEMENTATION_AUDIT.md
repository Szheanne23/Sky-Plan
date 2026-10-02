# SkyPlan — Stitch Implementation Audit

## 1. Matching Elements
- **Full-Stack Separation:** Clean frontend/backend decoupling with React, Tailwind CSS, and Express.
- **Component Architecture:** Reusable component directory structure (`Button`, `Card`, `Badge`, `Input`, `Spinner`, `Alert`).
- **Standardized Communication:** Centralized API client layer handling normalized responses.
- **Semantic Classification:** Support for Outdoor vs. Indoor categorical tagging and suitability statuses.

---

## 2. Visual Differences Between Stitch & Current Implementation

| Dimension | Previous Initial Implementation | Stitch Visual Source of Truth |
|---|---|---|
| **Theme & Canvas** | Light slate canvas (`bg-slate-50`, white panels) | Deep Cosmic & Atmospheric Twilight Canvas (`#0a122a` / `#0e112a`) with layered dark glass containers (`#131a33`, `#171e37`). |
| **Typography System** | `Inter` only | Dual pairing: **`Plus Jakarta Sans`** for Display Numerals, Temperatures, and Section Titles; **`Inter`** for Telemetry, Metrics, and Body. |
| **Geometry & Corner Radii** | Standard `rounded-xl` (12px) | **Aerodynamic Capsule Pills (`rounded-full` / `9999px`)** for buttons, search inputs, tags, and hourly nodes; **`rounded-xl` (24px)** for cards. |
| **Header Navigation** | Single 64px (`h-16`) bar | **Signature 2-Tier Header (`h-28`)**: Top deck with search capsule & user avatar; Bottom deck with pill nav tabs & saved city chips. |
| **Color Spectrum** | Generic Sky Blue (`#0284c7`) | **Luminous Sky Azure (`#4cd6fb` / `#00b4d8`)**, **Twilight Blue (`#006be3`)**, **Golden Hour Amber (`#fc8602` / `#ffb781`)**, and **Condition Jade (`#06d6a0`)**. |
| **Elevation / Glass** | Simple border stroke with drop shadow | **Multi-tier atmospheric glassmorphism** with backdrop blur (`16px–28px`), specular inset top rim (`inset 0 1px 1px rgba(255,255,255,0.15)`), and ambient colored radial glows. |

---

## 3. Missing Foundation Components
1. **Two-Tier Atmospheric Header:** Top search/controls tier + lower navigation & saved places tier.
2. **Capsule Pill Search Input:** Stadium pill with search icon, placeholder styling, and focus glow ring.
3. **Pill Unit Toggle:** Segmented `°C` / `°F` switcher primitive with active pill slide.
4. **Vertical Hourly Horizon Capsule Primitive:** Stadium pill container (`w-16`, `h-28`) for diurnal timelines.
5. **Atmospheric Background Canvas:** Radial gradient glows simulating tropospheric light scatter.

---

## 4. Incorrect Design Assumptions
- Defaulting to a standard bright corporate dashboard template instead of the atmospheric, dark-first aviation/meteorological aesthetic specified by Google Stitch.
- Using generic box-shadow tokens instead of frosted glassmorphism with specular rim lighting and translucent indigo surfaces.

---

## 5. Required Foundation Corrections
1. **`client/index.html`:** Add Google Font preconnects and stylesheets for `Plus Jakarta Sans` (weights 400–800) alongside `Inter`.
2. **`client/tailwind.config.js`:** Map exact Stitch tokens (`surface`, `surface-container-low`, `primary`, `secondary`, `tertiary`, `on-surface`, `outline`, spacing, and font families).
3. **`client/src/styles/index.css`:** Define atmospheric canvas gradients, glassmorphism utilities (`.stitch-glass-base`, `.stitch-glass-elevated`), and custom scrollbar rules.
4. **`client/src/components/common/`:**
   - [Button.jsx](file:///c:/Users/markd/OneDrive/Desktop/Shanaha/client/src/components/common/Button.jsx): Update to pill geometry with specular rim highlights and cyan/violet active glows.
   - [Card.jsx](file:///c:/Users/markd/OneDrive/Desktop/Shanaha/client/src/components/common/Card.jsx): Update to dark atmospheric glass containers with ambient radial backdrops.
   - [Badge.jsx](file:///c:/Users/markd/OneDrive/Desktop/Shanaha/client/src/components/common/Badge.jsx): Add Stitch condition pill variants (`optimal-jade`, `caution-amber`, `indoor-azure`).
   - [Input.jsx](file:///c:/Users/markd/OneDrive/Desktop/Shanaha/client/src/components/common/Input.jsx): Add stadium pill styling, dark translucent surface, and cyan focus rings.
   - [Alert.jsx](file:///c:/Users/markd/OneDrive/Desktop/Shanaha/client/src/components/common/Alert.jsx) & [Spinner.jsx](file:///c:/Users/markd/OneDrive/Desktop/Shanaha/client/src/components/common/Spinner.jsx): Align with dark atmospheric surfaces.
5. **`client/src/layouts/MainLayout.jsx`:** Implement the 2-Tier Google Stitch Atmospheric Header with live API health indicator, search capsule, navigation pill tabs, and saved city chips.
6. **`client/src/pages/HomePage.jsx`:** Showcase the locked Stitch design tokens, atmospheric cards, and diagnostic monitors.

---

## 6. Items That Cannot Be Determined From the References
- **Exact Cloud Particle Simulation Engine:** Some simulation references contain complex three.js particle shaders; these will serve as visual inspiration for lightweight CSS/Canvas effects rather than heavy 3D engine requirements.
- **Third-Party Social Auth:** Stitch header displays profile avatars without prescribing OAuth providers; we adhere strictly to the proposal baseline of JWT + email/password authentication.

---

## 7. UI/UX Refinement & Component Upgrades
- **Interactive Weather Search Command Panel:** Reusable `SearchPanel` with city input, date pill switcher ("Today", "Tomorrow", "Weekend", "7-Day"), and popular location chips.
- **Micro-Telemetry Grid Components:** Specialized `WeatherMetricCard` with live progress gauges and status badges.
- **7-Day Atmospheric Itinerary:** Interactive `ForecastCard` with active day state and high/low temperature visual range bars.
- **Smart Activity Recommendations:** Reusable `RecommendationCard` with category filters (Outdoor, Caution, Indoor Alt), suitability scores (e.g. 96%), time windows, and meteorological criteria tags.
- **Authentication & Profile Views:** Fully unified `LoginPage`, `RegisterPage`, and `ProfilePage` using dark frosted glass cards (`bg-surface-container-low/80`), password toggles, and live tag synchronization.
- **Mobile Navigation Drawer:** Responsive slide-down drawer menu on small screens with touch-friendly pill targets.
- **Reusable System Primitives:** Added `EmptyState` and `LoadingSkeleton` to prevent layout shifts.
