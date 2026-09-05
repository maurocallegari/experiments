---
name: Stealth homepage
description: Everyday work made visible through precise wireframe fragments.
colors:
  ink: "#171717"
  muted: "#595e60"
  cyan: "#a0cdd2"
  white: "#ffffff"
  soft: "#f5f7f7"
  ai-surface: "#f2f7f8"
typography:
  display:
    fontFamily: "inherit"
    fontSize: "clamp(44px,5.7vw,88px)"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "inherit"
    fontSize: "clamp(38px,4.5vw,72px)"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  body:
    fontFamily: "inherit"
    fontSize: "clamp(17px,1.35vw,21px)"
    lineHeight: 1.55
---

# Design System: Stealth homepage

## Overview

The implemented world is a clear white workspace with large inherited type, light cyan, and individual wireframe documents. Overlapping requests, quotes, reports, and data express everyday administrative friction. Software appears as an illustrative working interface. There is no photography, mascot, or decorative card grid.

This document records the implemented preview, not an approved visual comp. The user authorized direct code development and pinned the existing Enfold typography and header/footer. The preview explicitly simulates its header; actual Enfold appearance and integration remain outside this visual review.

## Colors

White carries the main narrative. Ink provides primary text and the closing contact surface. Cyan marks the Stealth introduction, with dark cyan-tinted secondary text. Soft neutral and cool AI surfaces separate later sections without adding a second accent. Wireframe strokes use pale blue-gray; decorative document detail is deliberately quieter than the readable narrative.

## Typography

All page typography inherits from the active theme. Do not introduce a new font family. The preview's inherited font is a simulation, not evidence of the Enfold font. Headings use balanced wrapping, restrained weight, tight tracking, and short lines. Body paragraphs generally stay within 42 characters; the centered introduction expands to 56 characters. Special introduction and contact displays are capped at 96px. Mobile body type is 17px, falling to 16px at the smallest breakpoint.

## Layout

Desktop panels pair text and a free composition in two columns with a 4vw gap and generous outer gutters. The opening belongs to the first four-panel horizontal story; no additional hero precedes it. Ordinary document scroll drives the translation. Subsequent AI, Stealth introduction, build, evolution, and contact sections remain vertical.

At 900px and below, panels stack text above their compositions. At 380px and below, typography, gutters, and the illustrative workspace simplify further. Above 1700px, wider gutters constrain the narrative. Horizontal enhancement activates only when every panel fits the available height; short screens, reduced-motion preference, and no JavaScript retain readable vertical flow. The plugin measures fixed or sticky theme header/admin-bar geometry to reserve space, subject to verification in the actual theme.

## Elevation & Depth

Depth comes from overlapping documents, small rotations, pale strokes, and soft offset shadows. Large page surfaces remain flat. Edge fading is restricted to decorative compositions; the workspace excludes it so navigation labels and status text stay visible. Do not add elevation to the page structure itself.

## Shapes

Documents and workspace panels use crisp rectangular forms. Thin curves connect information; phone and AI representations use their own rounded silhouettes. Icons use consistent, authored SVG strokes. Decorative composition overflow can be cropped, while narrative text and controls must remain fully accessible.

## Components

The chapter navigation uses small text links, a thin underline for the current scene, and a linear progress indicator. It appears only with the horizontal enhancement. Native document scrolling remains available; keyboard-visible links receive a two-pixel outline with generous offset.

Wireframe fragments are individual assets and elements, rather than flattened section screenshots. The opening fragments respond to scroll. AI flow and the connecting system use restrained progress-driven movement. Reduced motion removes the horizontal treatment and animated flow marker.

The contact action is a large underlined text link with an authored diagonal arrow. Hover changes the accent and arrow spacing. A skip link leads directly to the contact section. Illustrative interface actions are noninteractive, hidden from assistive technology with the rest of the decoration, and explicitly labeled as examples outside the illustration.

WordPress settings expose narrative copy, the destination URL, and optional replacement visual URLs. Rendering escapes substitutions. Original page content is preserved by the plugin's template selection. Actual WordPress execution and Enfold behavior require separate runtime validation.

## Do's and Don'ts

- Do preserve the inherited theme type and white/cyan/ink palette.
- Do keep the meaningful Stealth introduction and illustrative workflow labels.
- Do preserve individual wireframe elements and readable vertical fallbacks.
- Do test edited copy at narrow widths and increased text sizes.
- Don't add a separate opening hero, photographs, mascots, or invented customer proof.
- Don't wash out workspace labels with decorative edge masks.
- Don't treat a simulated header as verification of the Enfold integration.

Finish review: **SHIP at PREVIEW scope** after the workspace fade and contact display-size fixes. Updated desktop build/contact screenshots visibly resolve both findings. The recorded desktop, mobile, small, tablet, reduced-motion, and no-JavaScript checks report no page overflow, missing assets, or browser errors. The review does not certify the unavailable Enfold runtime or arbitrary future copy and asset replacements.
