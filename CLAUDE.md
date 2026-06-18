# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Static HTML/CSS/JS website for Advantys AI — a Spanish-language B2B AI consulting company. No build system, no package manager, no framework. Files are served directly[cite: 1].

## Development & Guardrails
- **CRITICAL (Dev Env):** Every HTML page *must* contain `<meta name="robots" content="noindex, nofollow">` in the `<head>` during this phase[cite: 1].
- **SEO Link Constraint:** Never wrap entire feature/sector cards in an `<a>` tag[cite: 1]. Links go ONLY on titles (H2/H3), images, or CTA buttons to avoid anchor text dilution[cite: 1].
- **Double Audience Architecture:** Content must serve both CEO (skimmable, benefit-driven) and CTO (technical depth)[cite: 1]. Implement this via a reusable vanilla HTML/JS disclosure pattern (`.adv-disclosure-block`) using hidden technical panels toggled via a "Ver detalle técnico" button[cite: 1].
- **Local Server:** Open `index.html` directly or use `python -m http.server 8000`[cite: 1].

## Architecture

### Page structure
- `index.html` — homepage (root)[cite: 1]
- `pages/*.html` — inner pages (`soluciones-ia.html`, `iso-42001.html`, `sistema-advantys.html`, `partners.html`, `blog.html`)[cite: 1].
- `components/navigation/` — reusable HTML snippets (header, footer)[cite: 1]. **Not auto-included** — each page embeds them inline[cite: 1]. When updating, sync both the component file and every single HTML page[cite: 1].

### CSS architecture (`assets/css/`)
`main.css` is the single entry point and `@import`s in this fixed order[cite: 1]:
1. `base/variables.css` — custom properties[cite: 1]
2. `base/reset.css`[cite: 1]
3. `layout/` — grid, header, footer[cite: 1]
4. `components/` — buttons, cards, forms, badges, accordion, and disclosure blocks[cite: 1].

Page-specific styles live in `assets/css/pages/<page>.css`[cite: 1]. Do **not** put shared/reusable styles there[cite: 1].

### Design tokens (`variables.css`)
- **Brand Palette:** `--color-red: #FF3935`, `--color-coral: #FF6B43`, `--color-orange: #E49166`[cite: 1].
- **Búnker Digital (ISO 42001):** Alternative dark backgrounds `--bg-bunker: #0B1F3A` or `#1E293B`; Compliance green: `--color-success: #108981` (always accompany green status with check icons, never color alone)[cite: 1].
- **Main Background:** `--bg-main: #090d16`[cite: 1].
- **Typography:** Headings: `Space Grotesk`; Body: `Inter` (never use condensed fonts for long paragraphs); Data/Code: `JetBrains Mono`[cite: 1].

### JavaScript (`assets/js/`)
- `main.js` — nav glass-pill effects and mobile menu toggle[cite: 1]
- `accordion.js` — accordion & disclosure toggle logic[cite: 1]
- `partners-form.js` — conditional multi-step form logic[cite: 1]
- Scripts are loaded via `<script src="../assets/js/main.js">` at the bottom of pages[cite: 1].

### Path conventions & CSS Naming
- From root: `assets/...`, `pages/...`[cite: 1]
- From pages: `../assets/...`, `../index.html`[cite: 1]
- All custom classes must use the `adv-` prefix (e.g., `adv-card-sector`, `adv-disclosure-btn`)[cite: 1].
- Icons: Phosphor Icons via CDN (`ph ph-*`)[cite: 1]. **Strict rule:** No emojis for UI elements in production[cite: 1].