---
name: EcoLoop Design System
colors:
  surface: '#0f131b'
  surface-dim: '#0f131b'
  surface-bright: '#353941'
  surface-container-lowest: '#0a0e15'
  surface-container-low: '#181c23'
  surface-container: '#1c2027'
  surface-container-high: '#262a32'
  surface-container-highest: '#31353d'
  on-surface: '#dfe2ed'
  on-surface-variant: '#bcc9c6'
  inverse-surface: '#dfe2ed'
  inverse-on-surface: '#2d3038'
  outline: '#879391'
  outline-variant: '#3d4947'
  surface-tint: '#6bd8cb'
  primary: '#6bd8cb'
  on-primary: '#003732'
  primary-container: '#29a195'
  on-primary-container: '#00302b'
  inverse-primary: '#006a61'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#4cd7f6'
  on-tertiary: '#003640'
  tertiary-container: '#009eb9'
  on-tertiary-container: '#002f38'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#0f131b'
  on-background: '#dfe2ed'
  surface-variant: '#31353d'
  surface-charcoal: '#0F172A'
  surface-glass-border: rgba(255, 255, 255, 0.08)
  surface-glass-fill: rgba(15, 23, 42, 0.65)
  glow-cyan: rgba(6, 182, 212, 0.18)
  glow-emerald: rgba(16, 185, 129, 0.15)
  text-muted: '#94A3B8'
typography:
  display-hero:
    fontFamily: Sora
    fontSize: 4rem
    fontWeight: '700'
    lineHeight: 4.5rem
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Sora
    fontSize: 2.5rem
    fontWeight: '700'
    lineHeight: 3rem
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Sora
    fontSize: 3rem
    fontWeight: '600'
    lineHeight: 3.5rem
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Sora
    fontSize: 2rem
    fontWeight: '600'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 2rem
    fontWeight: '600'
    lineHeight: 2.5rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Sora
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Sora
    fontSize: 1.25rem
    fontWeight: '500'
    lineHeight: 1.75rem
  body-xl:
    fontFamily: Manrope
    fontSize: 1.25rem
    fontWeight: '400'
    lineHeight: 1.875rem
  body-md:
    fontFamily: Manrope
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.6rem
  body-sm:
    fontFamily: Manrope
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.4rem
  label-md:
    fontFamily: Sora
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Sora
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.04em
  code-mono:
    fontFamily: JetBrains Mono
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
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
  margin: 4rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
  space-2xl: 4rem
  space-3xl: 6rem
---

## Brand & Style

This design system expresses a forward-looking, high-precision climate tech vision. It merges the analytical rigor of next-generation enterprise software with the organic vitality of environmental circularity. The aesthetic balances glassmorphism, crisp hairline boundaries, and luminous radial glows to instill optimism, technological authority, and institutional trust.

Targeted at eco-conscious enterprises, modern urban consumers, and sustainability teams, the interface must evoke clarity, high craft, and actionable intelligence. The design movement pairs deep dark-mode slate architecture with spectral cyan-to-emerald light leaks, micro-frosted card surfaces, and pristine geometric typography.

## Colors

The palette is engineered around dark surfaces punctuated by biological luminescence. Deep slate-black `#090D14` establishes foundational contrast, allowing chromatic light to guide navigational focus without visual noise.

- **Primary (`#0D9488`):** Deep energetic teal representing operational balance and circular data flows. Used for core interactions, key actions, and dominant progress indicators.
- **Secondary (`#10B981`):** Luminous emerald denoting active renewal, high-efficiency benchmarks, and positive environmental metrics.
- **Tertiary (`#06B6D4`):** Electric cyan used strictly for ambient atmospheric blooms, focal glows, and forward-looking data insights.
- **Neutral (`#090D14`):** Ultra-dark slate black preventing true-black OLED clipping while preserving deep cinematic value.
- **Glass & Accent Tokens:** Subdued translucencies (`rgba(15, 23, 42, 0.65)`) paired with ultra-thin white border matrices (`rgba(255, 255, 255, 0.08)`) to establish spatial layering without heavy shadows.

## Typography

Typography establishes an intentional dynamic: technical authority through the architectural geometry of `Sora` paired with the organic rhythm and high legibility of `Manrope` for body prose.

Headlines employ tight, negative letter-spacing to present a locked, engineered quality suited for enterprise SaaS declarations. Body levels in `Manrope` provide ample x-height and open apertures, preserving readability across semi-translucent glass panels. Micro-labels, metrics, and pill captions leverage uppercase tracking in `Sora` to convey scientific certainty.

## Layout & Spacing

The spatial architecture is grounded in a 12-column responsive grid framed by generous exterior boundaries to create an airy, premium stance. 

- **Desktop (1280px+):** 12 columns, 1.5rem gutters, 4rem canvas margins, max content width capped at 1200px to maintain optical alignment.
- **Tablet (768px - 1024px):** 8 columns, 1.25rem gutters, 2.5rem margins.
- **Mobile (320px - 767px):** 4 columns, 1rem gutters, 1.25rem margins. Multi-column cards stack vertically into unified streams.

Generous vertical section spacing (`space-2xl` and `space-3xl`) isolates major value propositions, letting subtle background gradient conics emerge naturally between product modules.

## Elevation & Depth

Depth is established via layered glassmorphism and luminescent diffusion rather than traditional cast drop-shadows.

1. **Base Plane:** Solid `#090D14` with persistent radial gradients of `#06B6D4` and `#10B981` blurred up to 160px at low opacity (12-18%).
2. **Surface Tier 1 (Cards, Modules):** Translucent backdrop `rgba(15, 23, 42, 0.65)` layered with `backdrop-filter: blur(16px)` and a crisp 1px stroke of `rgba(255, 255, 255, 0.08)`.
3. **Surface Tier 2 (Floating Nav, Dialogs):** Translucent backdrop `rgba(15, 23, 42, 0.85)` with `backdrop-filter: blur(24px)` and a dual-border highlight: `rgba(255, 255, 255, 0.12)` on the top edge tapering to `rgba(255, 255, 255, 0.02)` on the bottom.
4. **Interactive Glow Elevation:** Hover states and focused components project directional glow halos via `box-shadow: 0 0 24px -4px rgba(13, 148, 136, 0.35)`.

## Shapes

With a roundedness index of `2`, the shape language pairs industrial precision with organic ergonomics. Standard containers, cards, and modal dialogs adopt an 8px (`0.5rem`) to 16px (`1rem` for large panels) curvature. 

Interactive tags, pill badges, and primary action buttons diverge into complete 9999px pill radii. This purposeful contrast separates functional structural frames from lively, clickable UI indicators.

## Components

### Buttons
- **Primary Action:** Pill-shaped (`rounded-full`), filled with a linear gradient from `#0D9488` to `#10B981`. Text is set in `Sora` label-md (bold, white). Layered with a subtle inset top highlight (`inset 0 1px 0 rgba(255, 255, 255, 0.25)`). On hover, generates a 20px teal ambient outer glow.
- **Secondary Action:** Pill-shaped, semi-transparent slate backing (`rgba(255, 255, 255, 0.05)`), 1px border `rgba(255, 255, 255, 0.12)`. On hover, background shifts to `rgba(255, 255, 255, 0.1)` and border adopts the primary teal tint.

### Pill Badges & Chips
- Ultra-compact tags using `label-sm` with an accompanying glowing status bullet (4px emerald sphere with ping animation).
- Background: `rgba(13, 148, 136, 0.12)`, border: `1px solid rgba(13, 148, 136, 0.3)`. Text color in vibrant `#06B6D4` or `#10B981`.

### Navigation Bar
- Fixed floating island centered at the top viewport. Radiused at `1rem`, background `rgba(9, 13, 20, 0.75)` with `backdrop-filter: blur(20px)`.
- Border: `1px solid rgba(255, 255, 255, 0.08)`. Links transition from `text-muted` to crisp `#FFFFFF` with an active emerald dot underneath.

### Cards & Metrics Modules
- Background: `rgba(15, 23, 42, 0.6)`. Corner radius: 1rem (`rounded-lg`).
- Edge treatment: 1px hairline border `rgba(255, 255, 255, 0.07)` that transitions to `rgba(13, 148, 136, 0.4)` on hover.
- Internal layout: Generous `space-lg` padding, with metric numerals rendered in `Sora` headline-xl utilizing gradient text clip (white to subtle cyan).

### Form Controls & Inputs
- Height: 44px. Background: `rgba(15, 23, 42, 0.8)`. Corner radius: `0.5rem`.
- Inactive state: Border `1px solid rgba(255, 255, 255, 0.1)`. Placeholder text in `text-muted`.
- Focus state: Border transitions to `#0D9488` with a tight `0 0 0 3px rgba(13, 148, 136, 0.2)` ring.
- Checkboxes: 18px rounded squares (`roundedness: 0.25rem`), checked state filled with `#0D9488` showing a sharp white micro checkmark.