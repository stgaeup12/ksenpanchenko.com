# ABOUT PAGE — CONTENT & PERSONAL PORTRAIT INVESTIGATION REPORT

**Date:** 2026-11-25  
**Project:** Portfolio Website Personalisation (`ksenpanchenko.com`)  
**Target Page:** About Page (`about.html`, `about/index.html`)  
**Status:** Phase 1 Investigation Complete — No files modified.

---

## Executive Summary

This report covers the technical reverse-engineering of the About page across four key areas:
1. **Main Introduction**
2. **Character-Based Portrait Architecture**
3. **"Why Glyphs" Section & Particle FX**
4. **"Try It" Interactive Glyph Generator**

The findings demonstrate that the written content and the character-based portrait can be updated cleanly with **zero visual regressions, zero hydration mismatches, and 100% preservation of all animations and interactive physics**.

---

## 1. Main Introduction Section

### 1.1 Existing Implementation
Located in the `<div class="ab__intro">` container immediately following the portrait element.

```html
<div class="ab__intro">
  <h1 class="ab__lead">
    I’m Ksen — a UX/UI &amp; Product Designer. I design websites, products and design systems that make complex things feel obvious.
  </h1>
  <p class="ab__lead ab__lead--2">
    I work independently with FinTech, SaaS and web teams. If it needs explaining, it needs redesigning — so I start with research, build systems rather than screens, and stay with developers until the final QA.
  </p>
</div>
```

### 1.2 Inspection Findings
- **Static HTML**: Server-rendered in both `about.html` and `about/index.html`.
- **RSC Payload**: Present in React Server Component push chunk `7:` (`self.__next_f.push([1, "7:..."])`) in both HTML files.
- **JavaScript & Config**: Not hardcoded in client JavaScript bundles; not present in `js/config.js` or `js/main.js`.
- **Typography & Styling**:
  - Desktop: Font size `36px`, line-height `43.2px` (`1.2em`), controlled by `.ab__lead` and `.ab__lead--2` in `_next/static/css/e737e5eb2693d48e.css`.
  - Mobile: Responsive font size drops to `18px` (`line-height: 23.4px`) on viewports `<768px`.
  - Structure: Clean semantic HTML without inline formatting or nested tags.

---

## 2. Character-Based Portrait Architecture

### 2.1 Technical Discovery
The portrait is **not** an image, video, CSS filter, or WebGL shader. It is rendered using an **interactive procedural 2D Canvas particle scatter system (`GlyphScatter`)**.

```
┌────────────────────────────────┐
│   glyphs/portrait.json         │ (cols: 92, rows: 79, aspect: 1.22, cells: 2265)
└───────────────┬────────────────┘
                │ fetch()
                ▼
┌────────────────────────────────┐
│   <AboutPortrait>              │ (_next/static/chunks/app/about/page-724d1072c57998b0.js)
└───────────────┬────────────────┘
                │ passes props: color="accent", box={...}
                ▼
┌────────────────────────────────┐
│   GlyphScatter Engine          │ (_next/static/chunks/973-f6f1bebae9947e93.js: Module 6973)
└───────────────┬────────────────┘
                │ requestAnimationFrame 2D Canvas pipeline
                ▼
┌────────────────────────────────┐
│   <canvas class="ab__pglyph">  │ Dynamic interactive render
└────────────────────────────────┘
```

### 2.2 Portrait Data Schema (`glyphs/portrait.json`)
The asset is a JSON object with dimensions:
- `cols`: `92`
- `rows`: `79`
- `aspect`: `1.22`
- `cells`: Array of `2265` items.

Each cell in the array is a 5-tuple: `[col, row, character, layer, intensity]`
- `col`: Integer (`0` to `91`) — horizontal grid coordinate.
- `row`: Integer (`0` to `78`) — vertical grid coordinate.
- `character`: Selected from a fixed 13-character glyph set:
  `['▓', '#', '%', '*', '+', '=', '-', ':', '.', '·', '/', '\\', '|']`
- `layer`: Integer (`0`, `1`, `2`) — depth sorting for parallax.
- `intensity`: Integer (`1` to `9`) — opacity / brightness weighting.

### 2.3 Visual Treatment & Colors
- Rendered using CSS variable `var(--color-accent-default)` (`#FF5C2E` / brand orange) for highlighted features and `var(--color-text-primary)` (`#141414` / dark graphite) for shadows.
- Typography: Rendered using monospace font `var(--font-family-mono)` (`JetBrains Mono`).

### 2.4 Animations & Physics
1. **Scroll-Driven Scatter**: Glyphs disperse outwards in 3D radial space as the user scrolls (`scrollY / (0.9 * innerHeight)`).
2. **Cursor Proximity Repulsion**: Glyphs within 70px of the cursor deflect away gently and spring back.
3. **Ambient Micro-Twinkle**: Approximately 0.4% of glyphs periodically scramble through symbols before returning to resting state.
4. **Reduced Motion**: Respects `prefers-reduced-motion: reduce` by freezing particles in place.

### 2.5 Screen Adaptation
- **Desktop (≥1024px)**: Rendered in a sticky left sidebar (`width: 324px`) tracking with the about container.
- **Mobile (<768px)**: Rendered full-width above the introduction (`width: 343px`, `height: 359px`, `aspect-ratio: 92 / 96.38`).

### 2.6 Safe Replacement Strategy
To replace the portrait with Salman Saifi's likeness:
1. Re-encode the reference photograph into `glyphs/portrait.json` matching the exact grid (`cols: 92, rows: 79, aspect: 1.22`) and 13-glyph alphabet.
2. Update the accessibility `aria-label` from `"Ksen Panchenko — portrait drawn in glyphs"` to `"Salman Saifi — portrait drawn in glyphs"`.
3. **Zero code modifications** to the renderer engine are required, ensuring 100% preservation of all animations, interactions, and physics.

---

## 3. "Why Glyphs" Section

### 3.1 Existing Implementation
Found in `<section class="ab__story" aria-label="Why glyphs">`:
```html
<section class="ab__story" aria-label="Why glyphs">
  <span class="tag text-label-tag ab__tag">Why glyphs</span>
  <div class="ab__storybody">
    <p class="text-body-lead">Every interface starts as characters — letters, numbers, a blinking cursor. So every drawing here is live text: the thorn garland, my portrait, the 404 zero. Each one assembles from random symbols, the way a product comes together from research, notes and rough flows — until it clicks.</p>
    <p class="text-body-lead">FinTech and SaaS are full of noise: fees, limits, compliance, five steps where two would do. My job is to turn it into something you understand at a glance.</p>
  </div>
</section>
```

### 3.2 Dynamic Letter Scatter Animation (`AboutFx`)
- Driven by Module `4998` in `_next/static/chunks/app/about/page-724d1072c57998b0.js`.
- At runtime, `AboutFx` queries `.ab__storybody p`, extracts `textContent`, and splits each character into a `<span class="ab-us__c">` with random 3D scatter offsets (`--dx`, `--dy`, `--r`, `--s`).
- As the user scrolls into view, `--p` animates from `0.000` to `1.000`, snapping all scattered characters back into readable text.
- **Crucial finding**: `AboutFx` has **no hardcoded strings**. It operates dynamically on whatever text is present in the DOM. Replacing the text in the HTML/RSC payload will automatically inherit this animation.

---

## 4. "Try It" Section

### 4.1 Existing Implementation
Found in `<section class="ab__try" aria-label="Type in glyphs">`:
- Static instructional text: `<p class="text-body-lead ab__tryt">Type a word — it assembles from glyphs the way every drawing here does. Click it to send a ripple, save it if you like it.</p>`
- Interactive canvas `<canvas class="gt__cv">` driven by component `GlyphType` (Module `8337`).
- Text input `#gt-in` with placeholder `"Type a word"` and initial value `"click"`.
- "Save image" action button (`.gt__save`).

### 4.2 Functionality Verification
- Updating the instructional copy `<p class="ab__tryt">` in the HTML and RSC payload does not affect `GlyphType`.
- The live canvas text rasterizer, ripple click waves, and image export functionality remain completely intact.

---

## 5. File Inventory & Modification Map

| Target File | Category | Scope of Phase 2/3 Edits |
|---|---|---|
| `about.html` | Static HTML | Section 1 Introduction H1/P2<br>Section 2 Why Glyphs P1/P2<br>Section 3 Try It instructional text<br>Portrait `aria-label`<br>Synchronous RSC payload chunk `7:` |
| `about/index.html` | Static HTML | Identical updates to `about.html` |
| `glyphs/portrait.json` | Data Asset | Replace matrix with Salman Saifi facial feature encoding (`92 cols × 79 rows`) |
| `_next/static/chunks/app/about/page-724d1072c57998b0.js` | JS Bundle | Update fallback `label` prop in `<AboutPortrait>` (Module 4369) |

---

## 6. Approved Content Reference for Phase 2

### Section 1 — Introduction
> "I'm Salman — a Product Designer focused on B2B SaaS, enterprise experiences and AI-powered products. I turn complex workflows into clear, intuitive experiences.
> 
> I approach design beyond individual screens — understanding problems through research, simplifying interactions, and building scalable design systems. I work closely with developers to bring thoughtful experiences to life, from the first idea to the final implementation."

### Section 2 — Why Glyphs
> "Every product begins with small building blocks — information, decisions, interactions and flows. The drawings here are made from live text: the thorn garland, this portrait, even the 404 zero. Each one takes shape from individual symbols, much like a product takes shape through research, ideas, iterations and thoughtful decisions — until everything clicks.
> 
> Complex products often hide important decisions behind dense information, unclear states and unnecessary steps. My approach is to bring clarity to that complexity, making experiences easier to understand, navigate and use."

### Section 3 — Try It
> "Enter a word and watch it take shape from individual glyphs, just like the drawings above. Click the result to create a ripple, or save it if you like."
