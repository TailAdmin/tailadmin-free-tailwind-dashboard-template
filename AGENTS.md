# AGENTS.md — TailAdmin HTML Pro

> Static HTML admin dashboard template · Tailwind CSS v4 · Alpine.js v3 · Webpack 5

Deeper references live in `docs/` (`html-composition.md`, `js-initialization.md`, `styling.md`, `i18n.md`). This file is the authoritative summary.

## Commands

| Command                           | Purpose                                                      |
| --------------------------------- | ------------------------------------------------------------ |
| `npm start`                       | Dev server with HMR (serves `build/` + `src/`)               |
| `npm run build`                   | Build to `build/` — **must pass before you finish**          |
| `npm run lint` / `lint:fix`       | ESLint (`src/js/**/*.js`)                                    |
| `npm run format` / `format:check` | Prettier (with `prettier-plugin-tailwindcss` class sorting)  |
| `npm run preview` / `deploy`      | Wrangler dev / deploy of `build/` (Cloudflare static assets) |

Node >= 22.18 (Babel 8). Don't install new packages without asking.

## Stack

- **Tailwind CSS v4** — configured only in `src/css/style.css` (+ `@tailwindcss/forms`, `tw-animate-css`). No `tailwind.config.js`.
- **Alpine.js v3** with plugins `persist`, `focus`, `collapse`, `sort`. **@tanstack/alpine-table** powers several data tables.
- **i18next** + browser language detector (`en`, `ar` [RTL], `de`, `es`).
- **ApexCharts** (charts), **FullCalendar v7** (calendar; `temporal-polyfill` is its peer dep), **Swiper v14** (carousels).
- Maps: **jsvectormap** (most maps), **Leaflet** (`location-maps.js`), **MapLibre GL v6** (`location-maps-3.js`, ESM-only; worker files copied to build root by webpack).
- **flatpickr**, **Dropzone**, **Prism.js**, **Floating UI** (dropdown/tooltip/popover).

## Repo Map

```
src/
├── _redirects            # Cloudflare redirects (mirrored in webpack devServer — keep in sync)
├── pages/                # one output .html per file (102 pages)
│   ├── index.html        # eCommerce dashboard (home)
│   ├── (admin-layout)/   # sidebar + header pages
│   │   ├── (main)/       # (ai-assistant) (dashboard) (e-commerce) (empty-state) (forms) (pages) (tables) (task)
│   │   ├── (others)/     # (charts) (maps) (ui-elements)
│   │   └── (support)/    # (email) (support)
│   ├── (full-width-pages)/ # (auth) (error-pages)
│   └── (layouts)/        # alternative sidebar/header layout demos
├── partials/             # mirrors the page/nav structure — do not reorganize
│   ├── common/           # preloader, breadcrumb, card header, countdown, grid-shape, social links
│   ├── layout/           # app-layout/ (default sidebar + header) and layout-one … layout-six
│   ├── main/             # partials for (main) pages
│   ├── others/           # auth, charts, maps, ui-elements
│   └── support/          # chat, email, support-ticket
├── css/style.css         # @theme tokens, @utility classes, third-party overrides (bottom)
├── css/prism.css         # Prism theme
├── js/index.js           # single webpack entry
├── js/i18n.js            # i18next + Alpine integration
├── js/components/<domain>/ # analytics, crm, finance, hr, saas, sales, stocks, ai, ... + charts, maps, carousels, tables, ui
├── locales/<lang>/common.json
└── images/
```

Note: `components/ecommerce/` holds eCommerce **dashboard charts**; `components/e-commerce/` holds the e-commerce **page components** (product list, invoices, billing). Both are intentional.

## HTML Composition

```html
<include src="./partials/common/preloader.html"></include>
<include src="./partials/layout/app-layout/sidebar/index.html"></include>
<include src="./partials/layout/app-layout/header/index.html" />
```

- `src` resolves relative to the **file containing the include**; fallbacks: `src/partials/common/<basename>`, then `src/<src>`. Includes resolve recursively.
- Every `src/pages/**/*.html` becomes an output page; all share `bundle.js` and `style.css`.
- **Route groups**: only parenthesized segments are stripped. Plain folders stay in the URL:
  - `(admin-layout)/(main)/(dashboard)/analytics.html` → `analytics.html`
  - `(admin-layout)/(main)/(ai-assistant)/ai-chat/code.html` → `ai-chat/code.html`
- When renaming/moving a public page, add a 301 to **both** `src/_redirects` and the `redirects` array in `webpack.config.js` (`setupMiddlewares`).

### Page boilerplate

Copy `<head>` and `<body>` from a sibling page and set the `page` key (used by the sidebar for active state):

```html
<body
  x-data="{ page: 'analytics', 'loaded': true, 'darkMode': false, 'stickyMenu': false, 'sidebarToggle': false, 'scrollTop': false }"
  x-init="
       darkMode = JSON.parse(localStorage.getItem('darkMode')) ?? false;
       $watch('darkMode', value => localStorage.setItem('darkMode', JSON.stringify(value)))"
  :class="{'dark bg-gray-900': darkMode === true}"
></body>
```

Never inline shared UI (sidebar, header, footer) — use `<include>`.

## JavaScript (`src/js/index.js`)

Order matters:

1. CSS imports (Dropzone, flatpickr, jsvectormap, Prism, `style.css`).
2. Theme IIFE — applies `.dark` + `data-color-scheme` on `<html>` from `localStorage.darkMode` (default light).
3. Module imports.
4. `Alpine.plugin(...)`, `setupI18n(Alpine)`, then all `Alpine.data(...)` registrations.
5. `Alpine.start()` — **exactly once**.
6. flatpickr (`.datepicker`, `.datepickerTwo`) and Dropzone (`#demo-upload`, length-guarded) at module level.
7. Chart / map / carousel init functions called inside the `DOMContentLoaded` listener.

`calendar/calendar-init.js` is a side-effect import (no call needed).

### Adding components

| Kind                     | Location                                            | Wire-up in `index.js`                                      |
| ------------------------ | --------------------------------------------------- | ---------------------------------------------------------- |
| Dashboard chart          | `components/<domain>/<name>-chart.js`               | import + call in `DOMContentLoaded`                        |
| Showcase chart           | `components/charts/<type>-chart/<type>-chart-NN.js` | import + call in `DOMContentLoaded`                        |
| Map                      | `components/maps/vector/<name>.js`                  | import + call in `DOMContentLoaded`                        |
| Carousel (Swiper)        | `components/carousels/carousel-NN.js`               | import + call in `DOMContentLoaded`                        |
| Table / Alpine component | `components/tables/` or `components/<domain>/`      | import + `Alpine.data("name", fn)` before `Alpine.start()` |

Init functions must no-op when their element is absent (every page loads the same bundle):

```js
import ApexCharts from "apexcharts";

export default function acquisitionChannelChart() {
  const el = document.querySelector("#acquisitionChannelChart");
  if (!el) return;
  new ApexCharts(el, {/* options */}).render();
}
```

Never define Alpine components in inline `<script>` tags.

## Styling

- `@theme` in `src/css/style.css` is the single source of truth. Use its tokens:
  - Colors: `brand-50`…`brand-950` + Tailwind defaults (`gray`, `green`, `amber`, `red`, `blue`, `sky`). No `success`/`warning`/`error`/`info`/`blue-light` tokens.
  - Type: `font-outfit` (only font), `text-heading-one`…`text-heading-six`, `text-title-sm`, `text-title-lg`.
  - Shadows: `shadow-theme-xs|sm|md|lg|xl`, `shadow-focus-ring`, `shadow-slider-navigation`, `shadow-tooltip`, `shadow-datepicker`, `drop-shadow-4xl`.
  - Breakpoints: `2xsm` (375), `xsm` (425), `sm`–`2xl`, `3xl` (2000).
  - Z-index: `z-1`, `z-9`, `z-99` … `z-999999`.
- Dark mode is class-based (`@custom-variant dark (&:is(.dark *))`). Every styled element needs its `dark:` variant.
- Reuse existing `@utility` classes before adding new ones: `menu-item*`, `menu-dropdown-item*`, `menu-dropdown-badge*`, `docs-menu-item*`, `docs-border-item*`, `nav-icon-item*`, `no-scrollbar`, `custom-scrollbar`.
- Third-party overrides (ApexCharts, jsvectormap, flatpickr, Swiper, FullCalendar, Prism, Dropzone) go at the **bottom** of `style.css`, using `@apply` with theme tokens.
- No hex colors, arbitrary pixel values, `<style>` blocks, or inline `style=""` in markup. Exception: ApexCharts option objects use hex copied from `@theme` (e.g. `#465fff` = brand-500).
- Image paths must be relative (to the HTML file or `src/images/`), never absolute.

## i18n

- `setupI18n(Alpine)` registers `Alpine.store("i18n")` (language, `dir`, `locales`), the `$t` magic, and the `x-i18n` directive; it also sets `<html lang/dir>` (RTL for `ar`).
- Use `x-text="$t('section.key')"` in markup. Add keys to **all four** `src/locales/<lang>/common.json` files, grouped by feature/page.
- New languages: add to `supportedLocales` in `src/js/i18n.js` plus a locale folder.

## Before finishing

1. `npm run build` passes.
2. `npm run lint` and `npm run format:check` are clean for files you touched.
3. Any new JS module is imported (and called/registered) in `src/js/index.js`.

## Boundaries

- Ask before installing packages.
