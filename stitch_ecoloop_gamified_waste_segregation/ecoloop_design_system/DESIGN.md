---
name: EcoLoop Design System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3c4a42'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6c7a71'
  outline-variant: '#bbcabf'
  surface-tint: '#006c49'
  primary: '#006c49'
  on-primary: '#ffffff'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#4edea3'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#855300'
  on-tertiary: '#ffffff'
  tertiary-container: '#e29100'
  on-tertiary-container: '#523200'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 3rem
    fontWeight: '800'
    lineHeight: 3.5rem
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '800'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.625rem
    fontWeight: '700'
    lineHeight: 2.125rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.375rem
    fontWeight: '600'
    lineHeight: 1.875rem
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.625rem
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
  label-lg:
    fontFamily: Inter
    fontSize: 0.9375rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1.125rem
    letterSpacing: 0.015em
  label-sm:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 0.875rem
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

This design system drives a residential ecological habit platform that turns daily sorting into an intuitive, rewarding micro-routine. The visual identity establishes an environment that feels optimistic, trustworthy, scientifically grounded, and community-affirming. It balances the playful dopamine cues of gamified habit loops with the clarity and dependable rigor of high-grade environmental SaaS.

The aesthetic blends **Modern Corporate SaaS** with **Soft Tactile Humanism**:
- **Clarity over Clutter:** Surfaces prioritize quick camera verification, immediate glanceability, and decisive classification feedback.
- **Friendly Authority:** The interface welcomes users with rounded geometric headings and accessible microcopy while anchoring data points, streak metrics, and audit records with strict typographic order.
- **Ecological Purpose:** Greens and nature-evoking neutrals steer clear of muddy or weathered tones, leaning instead into vibrant, photogenic jewel greens and crisp slate planes that evoke cleanliness, renewed resources, and modern urban sustainability.

## Colors

The color palette centers on clean jewel tones balanced by cool, slate-tinted neutrals to maintain high contrast and compliance under outdoor mobile lighting conditions.

### Primary, Secondary, and Accent Roles
- **Primary (`#10B981`):** The signature emerald green represents biological renewal, accurate verification, and positive reinforcement. Used for primary CTAs, active indicators, and organic/wet waste classification.
- **Secondary (`#0F172A`):** Deep oceanic slate provides strong visual contrast, framing interactive controls, dominant typography, and grounded navigational anchors.
- **Tertiary / Gamification Accent (`#F59E0B`):** Warm solar gold triggers reward pathways; dedicated to streaks, tier milestones, badges, and verification review alerts.
- **Caution / Hazard (`#F43F5E`):** Clear soft coral reserved for contamination warnings, non-compliant photo detections, and hazardous waste markers.

### Functional Category Tokens
- **Category Wet/Organic:** Emerald `#10B981` (Surface container: `#ECFDF5`, Border: `#A7F3D0`)
- **Category Dry/Recyclable:** Sky Blue `#0284C7` (Surface container: `#F0F9FF`, Border: `#BAE6FD`)
- **Category Special/Hazardous:** Tangerine `#EA580C` (Surface container: `#FFF7ED`, Border: `#FFEDD5`)

### Surface & Mode Architecture
- **Light Mode (Default):**
  - Background Canvas: `#F8FAFC`
  - Surface Base: `#FFFFFF`
  - Surface Muted: `#F1F5F9`
  - Subtle Borders: `#E2E8F0`
  - Text Primary: `#0F172A`
  - Text Secondary: `#475569`
- **Dark Mode:**
  - Background Canvas: `#0B1120`
  - Surface Base: `#0F172A`
  - Surface Elevated: `#1E293B`
  - Subtle Borders: `#334155`
  - Text Primary: `#F8FAFC`
  - Text Secondary: `#94A3B8`
  - Never use pure black `#000000`; deep slate-navy preserves depth and minimizes eye fatigue.

## Typography

The typographic hierarchy pairs the friendly, organic geometry of **Plus Jakarta Sans** for titles, metric counters, and category tags with the pragmatic clarity of **Inter** for descriptions, AI confidence breakdowns, and status messaging.

- **Headlines (Plus Jakarta Sans):** Crafted with tight tracking and open apertures, bringing warmth and modern energy to milestones, impact stats, and verification conclusions.
- **Body & Data (Inter):** Highly legible at small scales on glass screens, ensuring instructions regarding contamination and material handling are easily parsed in low-light household sorting zones.
- **Labels & Microcopy:** Kept uppercase or title-cased with slight positive tracking for chips, status flags, and badge achievements.

## Layout & Spacing

The layout model adapts seamlessly from single-handed mobile scanning interactions to multi-column community dashboards.

### Responsive Breakpoints & Grid Model
- **Mobile (<640px):** 4-column fluid layout with `1rem` outer margins and `1rem` gutters. Touch targets maintain a minimum vertical clearance of `48px`. Bottom-sheet and sticky floating action containers preserve safe-area insets.
- **Tablet (640px - 1024px):** 8-column layout with `2rem` margins and `1rem` gutters. Splits camera capture previews and habit scorecards into dual modules.
- **Desktop (>1024px):** 12-column layout with `3rem` margins and `1.5rem` gutters, constrained to a maximum content container width of `1280px`.

### Spacing Principles
- Density adjusts dynamically: compact list layouts (`space-sm` to `space-md`) for audit histories, paired with airy presentation (`space-lg` to `space-2xl`) on verification success panels and streak showcases.

## Elevation & Depth

Visual hierarchy uses clean, translucent tonal layering and diffused emerald- or slate-tinted drop shadows rather than heavy, muddy dark blurs.

- **Level 0 (Flat Ground):** Background canvas (`#F8FAFC` in light mode; `#0B1120` in dark mode). Outlined elements sit flush with a 1px border (`#E2E8F0` / `#334155`).
- **Level 1 (Card & Content Blocks):** Resting state for cards, stats modules, and item rows. Uses 1px structural outline with an ambient glow: `0px 2px 8px -2px rgba(15, 23, 42, 0.05)`.
- **Level 2 (Interactive Floating & Badges):** Active states, dropdown menus, and gamified reward badges. Uses `0px 8px 24px -4px rgba(15, 23, 42, 0.08)`.
- **Level 3 (Modals, Camera HUD, & Drawers):** Critical action overlays and image inspection sheets. Uses `0px 20px 32px -8px rgba(15, 23, 42, 0.16)`.
- **Primary Action Glow:** Dedicated for primary camera snap actions and level-up claims: `0px 10px 20px -5px rgba(16, 185, 129, 0.35)`.

## Shapes

With a roundedness index of **2**, the interface creates an inviting, tactile environment while preserving internal structural order.

- **Base Corner Radius (`rounded-md` / 0.5rem / 8px):** Standard inputs, small buttons, notification banners, and micro-cards.
- **Container Corner Radius (`rounded-lg` / 1rem / 16px):** Primary cards, camera preview viewports, photo submission trays, and dashboard widgets.
- **Modal & Sheet Radius (`rounded-xl` / 1.5rem / 24px):** Bottom sheets, modal dialogues, and celebratory gamification popups.
- **Pill Radius (`rounded-full` / 9999px):** Applied to chips, streak counters, status tags, toggle indicators, and floating camera shutter triggers.

## Components

### Buttons
- **Primary Action:** Solid `#10B981` background, `#FFFFFF` bold text, roundedness of `0.5rem` or full pill (`rounded-full`) when used as a floating scan CTA. Elevated with an emerald tinted shadow; active state shifts to `#059669`.
- **Secondary Action:** `#0F172A` background with crisp white text, or 1.5px slate border (`#E2E8F0`) with `#0F172A` text on transparent base for neutral dismissals.
- **Ghost/Tertiary:** Zero background, primary or muted text, hover reveals 10% tint overlay.

### Chips & Classification Pills
- Height of 28px–32px with full pill rounding.
- Color pairings utilize an accessible 15% tint background, matching 1px border, and high-contrast text:
  - *Wet Waste:* Tint `#ECFDF5`, Border `#A7F3D0`, Text `#047857`.
  - *Dry Waste:* Tint `#F0F9FF`, Border `#BAE6FD`, Text `#0369A1`.
  - *Hazardous:* Tint `#FFF7ED`, Border `#FFEDD5`, Text `#C2410C`.

### Cards
- Built on `rounded-lg` (16px) with a 1px border (`#E2E8F0` in light, `#334155` in dark).
- Elevated via Level 1 ambient shadow.
- Interior cards (e.g., photo thumbnail side-by-side with classification score) sit inside with `0.5rem` rounded corners on a subtle neutral wash (`#F1F5F9`).

### Input Fields & Controls
- **Text & Select Fields:** 44px minimum touch height, `0.5rem` corner radius, light slate background `#FFFFFF` with `#E2E8F0` border. Active focus triggers a 2px outer ring in `#10B981` with zero border red-shift.
- **Checkboxes & Radios:** `0.375rem` rounded square for checks, circular for radios. Checked state fills with `#10B981` featuring crisp white vector marks.

### Specialized Platform Components
- **Camera Verification Viewfinder:** An elevated frame with `rounded-xl` borders, overlaid with crosshairs and dynamic bounding boxes that switch from neutral white to `#10B981` upon AI material detection.
- **Streak & Habit Badges:** Pill-shaped capsules containing a fire or leaf glyph, powered by solar gold `#F59E0B` with an illuminated warm glow, paired with bold numeric counters in `Plus Jakarta Sans`.
- **Contamination Alert Banners:** Surface container `#FFF1F2` paired with Coral `#F43F5E` accents, guiding users with constructive corrective microcopy without punitive visual treatment.