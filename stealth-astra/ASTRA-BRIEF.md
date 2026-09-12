# Stealth homepage — Astra rebuild brief

## Objective
Build a completely new homepage for Stealth SRL from scratch. This is a parallel experiment, not a refactor of `stealth-editorial`, `stealth-clean`, `stealth-gpt`, or any other existing implementation.

The result must feel like a premium digital studio / product company website: highly professional, distinctive, confident, modern, and conversion-oriented. It must work exceptionally well on iPhone Safari and desktop.

## Non-negotiable technical rules
- New standalone folder: `stealth-astra/`.
- Do not import or reuse CSS or JavaScript from any other Stealth experiment.
- Do not copy global layout rules from earlier implementations.
- Native browser scrolling only. No Lenis or custom smooth-scroll library.
- Progressive enhancement: page must remain visually correct with JavaScript disabled.
- Mobile-first responsive CSS.
- Prefer CSS Grid/Flex and normal document flow over fragile absolute positioning.
- Absolute positioning is allowed only inside self-contained visual compositions.
- Avoid `!important` unless absolutely unavoidable.
- Avoid scroll-jacking.
- Respect `prefers-reduced-motion`.
- Support Safari iOS viewport behavior (`svh`/`dvh`, safe-area insets).
- No element may overlap readable copy on mobile.
- No horizontal page overflow on mobile.
- Every visual must be built with HTML/CSS/SVG, not raster screenshots.
- Keep the implementation production-quality and maintainable.

## Brand / visual language
- Background primarily white.
- Text black / near-black.
- Accent: cold light blue / cyan only.
- No green as brand accent.
- No dark SaaS aesthetic as the dominant look.
- No mascots.
- No generic stock illustrations.
- No endless rounded SaaS cards.
- Strong editorial typography and composition.
- Wireframe-realistic work objects: email, Excel-like table, Word/preventivo, PDF, paper report, phone/WhatsApp, signatures, dashboard.
- Visuals should look recognizably like real work tools while remaining stylized and brand-consistent.
- The design should communicate competence, order, precision, and directness rather than AI hype.

## Positioning
Stealth works alongside small companies and understands how work actually happens before building software.

Core values:
- direct relationship;
- technical competence without jargon;
- practical results;
- proactive evolution of the system;
- not a consultancy that delivers a report and disappears;
- software should adapt to the company, not force the company to adapt to software.

Target audience: micro and small companies, especially in Veneto, often working across paper, Excel, Word, email, WhatsApp, legacy management systems, SAP/Sistemi/FileMaker, duplicated data and manual processes.

## Canonical narrative — preserve these intents
Do not replace this story with a generic agency process.

### Hero
Main idea:
**Il tuo lavoro dovrebbe essere più semplice.**

The hero should be centered horizontally. Visual work objects can surround or frame the idea on desktop, but must never cover copy. On mobile, preserve the same visual language while recomposing assets safely.

### Problem
Core message:
**Quanto tempo perdi in cose inutili, invece di concentrarti sul tuo lavoro?**

Show the multiplication of tools and hand-offs, e.g.:
RICHIESTA → EMAIL → EXCEL → WORD → PDF → FIRMA → GESTIONALE

The point is not that these individual tools are bad. The problem is the manual work required to hold them together.

### Frictions / real examples
Preserve all four concepts:
1. **Ogni preventivo parte da un Word diverso.**
2. **La carta funziona. Finché non si perde.**
3. **Il dato esiste già. Perché copiarlo ancora?**
4. **Una richiesta non dovrebbe fare cinque giri.**

Each should have one strong, realistic wireframe composition rather than many generic cards.

### AI
AI must not be presented as magic or spectacle.

Intent:
- chaotic real input arrives: email, PDF, photo, badly written message;
- AI reads/extracts/organizes it;
- it prepares a useful next action;
- the human checks what matters.

AI should visibly reduce work, not replace judgment.

### Approach
Canonical message:
**Prima ci sediamo accanto a te.**

Stealth observes the real workflow: people, paper, calls, spreadsheets, software, duplicated steps, bottlenecks.

Do not turn this into a generic three-step agency methodology such as “discover / design / build”.

### Build
Canonical message:
**Poi lo costruiamo.**

Show a convincing custom software/dashboard wireframe. It should feel like software that already belongs inside the client company, not a generic SaaS dashboard template.

### Evolution
Canonical message:
**E lo facciamo evolvere con te.**

The system grows as the company and workflow change. Relationship continues after delivery.

### Final CTA
**Raccontaci come lavori.**

Start from one concrete thing that wastes time today.

## Copy rules
- Italian.
- Short, direct sentences.
- Avoid agency jargon and marketing fluff.
- Avoid over-explaining.
- Avoid repeated section numbers / eyebrows on every viewport.
- Avoid language that sounds like a consultancy report.
- AI should be visible but never the entire positioning.

## Interaction / motion
Impact should come primarily from design, typography, scale and composition.

Allowed motion:
- subtle reveal on entry;
- small object translation/scale;
- restrained stagger inside visual compositions.

Avoid building the concept around fragile scroll choreography. No mandatory horizontal scrolling section. If any advanced scroll behavior is used, it must degrade perfectly and be proven safe on iOS.

## Mobile acceptance criteria
Test at representative iPhone widths (~375, 390, 430 px):
- no horizontal overflow;
- no visual overlaps copy;
- readable type without awkward wraps;
- minimum viewport sections remain deliberate and visually balanced;
- wireframes are recomposed, not merely scaled down;
- header and CTA remain usable with safe areas;
- Safari dynamic bars do not create giant blank areas;
- no sticky/fixed artifact while scrolling;
- animations remain smooth and optional.

## Desktop acceptance criteria
- Strong first-screen impact at 1440×900 and 1920×1080.
- Layout should not feel like a stretched mobile page.
- Use negative space and scale intentionally.
- Wireframe compositions should be large enough to read as real work interfaces.

## Deliverable
Create the complete standalone implementation in `stealth-astra/` with at least:
- `index.html`
- `style.css`
- `script.js` only if needed

Do not modify the other Stealth experiment folders. Do not overwrite `stealth-editorial`.

Before declaring completion, inspect the whole page at desktop and mobile sizes and correct layout failures rather than documenting them as known issues.
