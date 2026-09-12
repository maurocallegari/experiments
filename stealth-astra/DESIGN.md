---
name: Stealth Astra
description: Precise editorial typography and realistic work objects for custom software.
colors:
  ink: "#172126"
  muted: "#56636b"
  blue: "#bceaff"
  blue-strong: "#78ccee"
  blue-wash: "#eaf7fc"
  line: "#cdd7dc"
  surface: "#f5f7f8"
  paper: "#fff"
  button-hover: "#314b58"
  focus: "#0877a5"
  window-border: "#9eafb9"
  window-bar: "#f2f5f7"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(38px, 10.1vw, 58px)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(33px, 8.5vw, 48px)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "16px"
    lineHeight: 1.6
  copy:
    fontFamily: "Manrope, sans-serif"
    fontSize: "17px"
    lineHeight: 1.75
  button:
    fontFamily: "Manrope, sans-serif"
    fontSize: "14px"
    fontWeight: 600
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: "11px"
    letterSpacing: "0.01em"
rounded:
  window: "7px"
  button-status: "3px"
  phone: "25px"
spacing:
  page: "24px"
  section: "88px"
  copy-gap: "25px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.button-status}"
    padding: "17px 23px"
  button-primary-hover:
    backgroundColor: "{colors.button-hover}"
  window:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.window}"
  status:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button-status}"
    padding: "4px 7px"
---

# Design System: Stealth Astra

## Overview

**Creative North Star: "Precisione nel lavoro quotidiano"**

Precisione nel lavoro quotidiano: white space, confident editorial type and recognizable work objects express competence, order and directness. Cold cyan identifies useful information and deliberate emphasis. Realistic documents and interfaces are built from HTML, CSS and SVG.

This is a scan of the standalone implementation, not a new visual brief. ASTRA-BRIEF.md remains authoritative; the name above summarizes its existing direction. PRODUCT.md holds product truth. The current homepage is a Persuade surface; its story and section sequence remain in the brief. No approved raster composition or authenticated external canvas is a source of authority.

**Key Characteristics:**

- Locally hosted Manrope throughout.
- White and near-black with one cold cyan accent family.
- Bounded work compositions; readable copy in normal mobile flow.

## Colors

The accent family is cold light cyan; pale gray surfaces and thin blue-gray lines keep work objects recognizable.

- Primary: blue marks annotations, selection, outgoing messages, status and the closing contact surface. Blue-strong supplies smaller emphasis; blue-wash supplies pale section and workflow backgrounds.
- Neutral: paper is the dominant canvas; ink carries headlines and actions; muted carries supporting prose. Line divides records. Surface and window-bar separate tool chrome from content.
- Interaction: button-hover deepens the action surface; focus is a clearly visible blue outline. These are functional shades within the incumbent palette, not additional brand accents.

## Typography

Manrope is locally served from `assets/manrope-latin.woff2`, with a sans-serif fallback, variable weights 200–800 and `font-display: swap`. Headlines use balanced wrapping, tight tracking and semibold weight; bold records use 700 and the wordmark uses 800. There is no separate serif or monospace family and no mathematical type scale.

Frontmatter records mobile defaults. At 1000px, the hero becomes `clamp(52px, 5.55vw, 86px)` and standard section headlines become `clamp(44px, 4.25vw, 65px)`. Copy usually stays within 42ch, narrowing to 33ch in desktop friction sections. Object annotations are deliberately denser than reading copy and use component-specific responsive sizes; consult the final overrides in style.css before extending them.

## Layout

A centered container is capped at 1536px, including its padding. Page padding and section spacing are 24/88px by default, 40/105px from 600px, 64/130px from 1000px and 80/145px from 1400px. Left and right safe-area insets are applied independently; header top spacing also accounts for the safe area.

Mobile hero rows are copy, bounded desk composition, then footnote. The desk is 298px tall by default and 310px from 600px. At 1000px the centered copy occupies the middle of a three-column composition; tools frame it in the bounded scene. Desktop hero minimum height uses `calc(100svh - 112px)` and the desk has its own minimum height. At 1400px the side columns widen from 200px to 220px.

Friction sections become alternating equal columns from 1000px, with a 65px gap. Below desktop, copy and visuals occupy separate flow regions. The AI flow becomes three columns on desktop. The software example changes from a wrapping navigation strip to a 180px sidebar; below 600px, work records stack their status below their content. Visual compositions use local absolute positioning; page navigation and reading remain in native document flow.

Existing review evidence: seven Chromium viewport checks and no-JavaScript/reduced-motion checks passed. Physical iPhone Safari remains untested; do not describe Chromium evidence as Safari certification.

## Elevation & Depth

Page sections are flat. Bounded objects receive thin borders, slight rotation and selective shadows to distinguish overlapping paper, phones and windows. The main object shadow is `0 16px 36px -18px #17212645`; notes use `0 12px 20px -16px #17212670`. The desk and software frame use separate restrained shadows recorded in the sidecar. Do not turn the page into a repeated elevated-card grid.

## Shapes

Windows use the window radius token, one-pixel borders and clipped contents; buttons and statuses have tighter corners. Phones use a three-pixel ink outline and the phone radius. Documents remain rectangular. The final contact arrow is circular. SVG strokes are generally 1.5px with round caps and joins; underline accents use a narrow gradient band behind the text rather than extra illustrated assets.

## Components

- Primary action: an anchor styled as a near-black button, white label and inline arrow; minimum height 54px. Hover changes background over 200ms. Links receive a 3px focus outline with 6px offset.
- Navigation: wordmark and contact link share a static flex header. Contact has a 44px minimum target; the additional story link appears at wider widths. Hover underlines navigation links.
- Work window: a restrained frame with a pale title bar and thin dividers. Body content is a meaningful document, table or message, not a generic feature card.
- Status: small cyan labels describe illustrative workflow state. They are text, not controls; no fabricated hover, disabled or error behavior.
- Fields and dashboard: visual examples with accessible scene descriptions, not functioning inputs or a live application. Preserve illustrative labels and human review in the AI workflow.
- Contact arrow: a mail link with an outlined circle, pale hover fill and restrained rotation; it grows from 85px to 190px at desktop.

Optional JavaScript animates selected visual scenes once on entry: 16px upward travel, opacity 0.72 to 1, 650ms, `cubic-bezier(0.16, 1, 0.3, 1)`. Content starts visible. Missing observer/animation support leaves it intact; reduced motion skips and cancels animation. CSS reduced-motion rules remove transition and animation durations.

## Do's and Don'ts

- Do preserve ASTRA-BRIEF.md as the authority for this homepage.
- Do keep short Italian copy and label illustrative workflows as examples.
- Do recompose wireframes at narrow widths and keep all reading available without JavaScript.
- Don't import sibling experiment CSS or JavaScript.
- Don't introduce raster screenshots, stock illustrations, mascots or green brand accents.
- Don't add fixed or sticky choreography, scroll-jacking or mandatory horizontal scrolling.
