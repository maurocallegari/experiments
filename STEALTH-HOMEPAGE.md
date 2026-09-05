# Stealth homepage — development contract

Status: NOT PRODUCTION READY. This branch is the development workspace, not a deployment source.

## Scope

Build a real WordPress plugin for the Stealth homepage within Enfold. Keep the existing theme header/footer. WordPress must expose editable text; plugin owns layout, isolated CSS, assets and motion. No automatic production deployment or replacement of v2 before integration verification.

## Binding feedback

- Remove the redundant hero preceding the accepted story; avoid repeated introductions.
- Coherent professional wireframe visuals throughout; no mixed photography, generic assets, mascots or whole-image slides.
- Animate individual elements with scrolling; polished horizontal transitions informed by Kortix, not a row of sticky cards.
- Redesign Excel / quotes / paper / handoffs compositions; previous dated card treatments are rejected.
- Make the Stealth introduction before CTA a central, carefully composed turning point.
- Mobile: approximately one viewport per scene when content fits; readable text without cropping, compact padding, accessible overflow for enlarged text.
- Preserve established brand typography and palette; no added green, numbered eyebrows or decorative bordered containers. Full-width sections.
- Concise concrete copy: work problems before services, build together, ongoing evolution, AI doing useful work.
- Keep all styles and DOM queries scoped; retain theme navigation, header, footer, and normal document scrolling.

## Implementation requirements

- Real plugin bootstrap; separate PHP templates, CSS, JS and content schema.
- Editable fields with permission checks, nonces, sanitization and output escaping.
- Enqueue assets only on the target page; no global body/main/section CSS and no embedded HTML document inside page content.
- Reduced-motion and no-JavaScript fallbacks keep content and CTA available.
- Responsive layout and keyboard-accessible interactions; no forced nested full-screen scrolling.
- Back up exact existing page content/settings before any later replacement. Prototype files are not WordPress revisions.

## Release gates

1. PHP syntax and real WordPress activation/rendering checked.
2. Editable content save/render checked; unauthorized writes rejected.
3. Desktop and mobile visual inspection of every scene, including horizontal motion and Stealth introduction.
4. Header/footer, content overflow, CTA, reduced motion and no-JS behavior checked.
5. Installable ZIP built from verified source. Archive validity alone is not integration testing.
6. Enfold on-site integration verified before calling the homepage production-ready.

## Known failures to avoid

Earlier ZIP was HTML only. Replacement plugin merely wrapped the prototype, used global CSS and did not offer editable text. The later claimed restore inserted a different preview rather than an exact previous revision. None of these artifacts is an approved production baseline.

## Synchronization

Commit incremental development and validation evidence to this branch during active work. Keep repository changes reviewable and preserve unrelated experiments. No credentials, client data or private chat exports in this public repository. Background work is not implied when the conversation is inactive.
