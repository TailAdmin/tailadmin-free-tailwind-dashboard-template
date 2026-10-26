# AGENTS.md — TailAdmin HTML Pro

> Static HTML admin dashboard template · Tailwind CSS v4 · Alpine.js · ApexCharts · FullCalendar · Swiper · jsvectormap

## Repo Map

```
src/
├── pages/                # page templates, grouped by route groups
│   ├── index.html        # eCommerce dashboard (also the home page)
│   ├── (admin-layout)/   # pages with the main sidebar + header layout
│   ├── (full-width-pages)/ # auth, error, and full-width marketing pages
│   └── (layouts)/        # layout demo pages (alternative sidebars/headers)
├── partials/             # reusable HTML snippets
│   ├── common/           # preloader, countdown timer, shared helpers
│   ├── layout/           # sidebar and header variants
│   ├── main/             # page-domain partials (dashboard, e-commerce, forms, etc.)
│   ├── others/           # auth, error, and full-width page partials
│   └── support/          # chat, email, and support-ticket partials
├── css/
│   ├── style.css         # main stylesheet: @theme tokens, @utility classes, third-party overrides
│   └── prism.css         # Prism.js syntax-highlighting theme
├── js/
│   ├── index.js          # single webpack entry point — see "JavaScript Initialization Pattern"
│   ├── i18n.js           # i18next setup and locale metadata
│   └── components/       # chart, map, carousel, table, and UI initializations
│       ├── ai-assistant/
│       ├── ai/
│       ├── analytics/
│       ├── calendar/
│       ├── carousels/
│       ├── charts/
│       ├── chat/
│       ├── crm/
│       ├── e-commerce/
│       ├── ecommerce/
│       ├── email/
│       ├── finance/
│       ├── hr/
│       ├── logistics/
│       ├── maps/
│       ├── marketing/
│       ├── pages/
│       ├── saas/
│       ├── sales/
│       ├── stocks/
│       ├── support-ticket/
│       ├── tables/
│       ├── tasks/
│       └── ui/
├── locales/              # i18n JSON files
│   ├── ar/common.json
│   ├── de/common.json
│   ├── en/common.json
│   └── es/common.json
└── images/               # static assets
```

## Stack

- **Tailwind CSS v4** (configured entirely through `src/css/style.css` — no `tailwind.config`).
- **Alpine.js v3** with `@alpinejs/persist` for reactive UI (dropdowns, dark mode, sidebar toggle, data tables).
- **i18next** + `i18next-browser-languagedetector` for internationalization.
- **ApexCharts** for all charts, **FullCalendar v6** for the calendar page, **Swiper v14** for carousels.
- **jsvectormap**, **Leaflet**, **MapLibre GL JS** for maps. **flatpickr** for dates. **Dropzone** for uploads. **Prism.js** for code highlighting. **Floating UI** for tooltips/popovers.
- **Webpack 5** with a custom `<include src="...">` preprocessor for HTML composition.
- **Scripts**: `npm start` (dev server, HMR), `npm run build` (→ `build/`), `npm run lint` (ESLint), `npm run format` (Prettier). Node >= 22.18 (Babel 8).

## HTML Composition

```html
<include src="./partials/common/preloader.html"></include>
<include src="./partials/layout/app-layout/sidebar/index.html"></include>
<include src="./partials/layout/app-layout/header/index.html" />
<!-- page-specific content here -->
```

- Includes resolve **recursively** — partials can include sub-partials.
- Webpack discovers every `src/pages/**/*.html` file and emits one output `.html` per source page.
- All pages share a single JS bundle (`bundle.js`) and stylesheet (`style.css`).

### Route Groups

Parenthesized folders like `(admin-layout)`, `(main)`, `(dashboard)`, etc. are **route groups**. Webpack strips them from the output filename:

```
src/pages/(admin-layout)/(main)/(dashboard)/analytics.html → analytics.html
```

Use route groups to organize related pages without changing the public URL.

### Adding a New Page or Partial

- **New page** → add under the corresponding route group in `src/pages/<group>/<feature>/<page-name>.html`. Copy the `<body x-data="...">` pattern from an existing page; include `common/preloader.html`, `layout/app-layout/sidebar/index.html`, and `layout/app-layout/header/index.html` at the top.
- **New partial** → add an `.html` file (or folder) under the appropriate `src/partials/<category>/`; reference via `<include src="./partials/<category>/...">`.

### Partial Directory Convention

The `src/partials/` split mirrors the sidebar/page organization:

- `common/` — shared snippets used across many pages.
- `layout/` — sidebar and header variants.
- `main/` — page-domain partials (dashboard, e-commerce, forms, etc.).
- `others/` — auth pages, error pages, and full-width marketing pages.
- `support/` — chat, email, and support-ticket partials.

Do not reorganize these folders — they are intentionally grouped to match the navigation structure.

## Alpine.js Conventions

- Dark mode, sidebar toggle, sticky menu, and scroll-to-top are controlled by Alpine `x-data` on `<body>`:

  ```html
  <body
    x-data="{ page: 'ecommerce', loaded: true, darkMode: false,
               stickyMenu: false, sidebarToggle: false, scrollTop: false }"
    x-init="darkMode = JSON.parse(localStorage.getItem('darkMode')) ?? false;
             $watch('darkMode', v => localStorage.setItem('darkMode', JSON.stringify(v)))"
    :class="{ 'dark bg-gray-900': darkMode === true }"
  ></body>
  ```

- `darkMode` is persisted in `localStorage`, toggled by the theme-toggle button in the header.
- Global Alpine components (`dropdown`, `tooltip`, `popover`, `basicTableOne`, `dataTableOne`, etc.) are registered in `src/js/index.js` via `Alpine.data(...)` **before** `Alpine.start()`.
- Use `x-cloak` on elements that should be hidden until Alpine initializes (already handled in `style.css`).
- `@alpinejs/persist` (`$persist`) is available for persistent Alpine state.
- Do not add new global Alpine components without registering them in `src/js/index.js`.

## JavaScript Initialization Pattern

All JS initialization flows through `src/js/index.js` in this order:

1. **CSS imports** first (Dropzone, flatpickr, jsvectormap, Prism CSS, `style.css`).
2. **Theme bootstrap** (IIFE) runs synchronously before Alpine to apply the `dark` class from `localStorage`.
3. **Module imports** — Alpine, Dropzone, flatpickr, and all chart/carousel/map/table/component modules.
4. **Alpine plugin + component registration** (`Alpine.plugin(persist)`, `Alpine.data(...)`) must happen **before** `Alpine.start()`.
5. `Alpine.start()` is called **once**.
6. **flatpickr** instances initialized at module level (`.datepicker`, `.datepickerTwo`).
7. **Dropzone** initialized inside a `querySelectorAll` length guard.
8. **Chart, slider, map, and table functions** called inside a `DOMContentLoaded` listener — they guard against missing DOM elements internally.

When adding new components: import at the top → register in Alpine if applicable → call inside `DOMContentLoaded`.

## Component Conventions

- **New chart**:
  - **Dashboard charts** → add under its domain directory: `src/js/components/<domain>/<name>-chart.js` (e.g. `src/js/components/analytics/acquisition-channel-chart.js`).
  - **Showcase charts** → add under its category directory: `src/js/components/charts/<category>/<name>.js` (e.g. `src/js/components/charts/bar-chart/bar-chart-01.js`).
  - Import at the top of `src/js/index.js` and call the function inside the `DOMContentLoaded` listener. Example:

  ```js
  // src/js/components/analytics/acquisition-channel-chart.js
  import ApexCharts from "apexcharts";

  export default function acquisitionChannelChart() {
    const el = document.querySelector("#acquisitionChannelChart");
    if (!el) return;
    new ApexCharts(el, {/* options */}).render();
  }
  ```

- **New carousel** → add `src/js/components/carousels/<name>.js` (Swiper); import and initialize in `src/js/index.js`.
- **New map** → add under `src/js/components/maps/`; import and call in `src/js/index.js`.
- **New table** → add under `src/js/components/tables/`; import and register with `Alpine.data("...", ...)` in `src/js/index.js`.
- **New Alpine global component** → add under `src/js/components/<category>/<name>.js`, import in `src/js/index.js`, and register with `Alpine.data("...", ...)`. Do not define inline `<script>` Alpine components in HTML.

## Styling Rules

- Tailwind CSS **v4** — the `@theme` block in `src/css/style.css` is the single source of truth. There is **no** `tailwind.config.js`.
- Always use theme tokens instead of hardcoded values:
  - **Colors**: `brand` (`50`–`950`), alongside standard Tailwind defaults (e.g. `gray`, `green`, `amber`, `red`, `blue`, `sky`).
  - **Typography**: `font-outfit`, `text-heading-one` … `text-heading-six`, `text-title-sm` (18px), `text-title-lg` (20px), alongside standard Tailwind font sizes (`text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`…).
  - **Shadows**: `shadow-theme-xs/sm/md/lg/xl`, `shadow-focus-ring`, `shadow-slider-navigation`, `shadow-tooltip`, `shadow-datepicker`, and `drop-shadow-4xl`.
  - **Breakpoints**: custom `2xsm` (375px), `xsm` (425px), `3xl` (2000px) alongside Tailwind defaults.
  - **Z-index**: `z-1`, `z-9`, `z-99`, … `z-999999` tokens.
- **Dark mode is class-based** (`@custom-variant dark (&:is(.dark *))`, driven by Alpine toggling `.dark` on `<body>` and `<html>`). Every styled element must include its `dark:` variant.
- Reusable `@utility` classes already exist in `style.css` — reuse before inventing new ones:
  - Sidebar/menu: `menu-item`, `menu-item-active`, `menu-item-inactive`, `menu-item-icon-active`, `menu-item-icon-inactive`, `menu-item-arrow`, `menu-item-arrow-active`, `menu-item-arrow-inactive`.
  - Dropdowns: `menu-dropdown-item`, `menu-dropdown-item-active`, `menu-dropdown-item-inactive`, `menu-dropdown-badge`, `menu-dropdown-badge-active`, `menu-dropdown-badge-inactive`, `menu-dropdown-badge-pro`, `menu-dropdown-badge-pro-active`, `menu-dropdown-badge-pro-inactive`.
  - Docs sidebar: `docs-menu-item`, `docs-menu-item-active`, `docs-menu-item-inactive`, `docs-border-item`, `docs-border-item-active`, `docs-border-item-inactive`.
  - Nav icons: `nav-icon-item`, `nav-icon-item-active`, `nav-icon-item-inactive`.
  - Scrollbars: `no-scrollbar`, `custom-scrollbar`.
- All third-party CSS overrides (ApexCharts, jsvectormap, flatpickr, Swiper, FullCalendar, Prism, Dropzone) live at the **bottom** of `style.css`, using `@apply` to reference theme tokens. Add new overrides there.
- Never hardcode hex colors in `class` attributes. Chart option objects (ApexCharts `colors: [...]` arrays) are the established exception — copy hex values from the `@theme` palette (e.g. `#465fff` = brand-500).

## i18n / Locales

- Translations live in `src/locales/<lang>/common.json` (currently `ar`, `de`, `en`, `es`).
- `src/js/i18n.js` sets up i18next and exports `supportedLocales` and `isRTL()`.
- When adding new UI text that appears in multiple places, prefer adding a key to `common.json` and updating all four locale files.
- Keep locale keys grouped by feature/page for consistency.

## Common Agent Workflows

### Add a new admin page

1. Create `src/pages/(admin-layout)/(main)/(<section>)/<page-name>.html`.
2. Copy the full `<body x-data="...">` boilerplate from an existing page and set the correct `page` key.
3. Include `common/preloader.html`, `layout/app-layout/sidebar/index.html`, and `layout/app-layout/header/index.html`.
4. Add page-specific partials under `src/partials/main/...` and include them with `<include src="./partials/main/...">`.
5. Run `npm run build` to verify.

### Add a new partial

1. Create `.html` under the appropriate `src/partials/<category>/` folder.
2. Reference via `<include src="./partials/<category>/...">` from pages or other partials.
3. Keep partials focused on a single UI chunk; nest further with `<include>` when needed.

### Add a new chart

1. Create `src/js/components/charts/<name>.js` that exports a default function.
2. Guard against missing DOM elements: `if (!document.querySelector("#chartId")) return;`.
3. Import in `src/js/index.js`: `import myChart from "./components/charts/<name>";`.
4. Call `myChart()` inside the `DOMContentLoaded` listener.
5. Add the chart container in the relevant page/partial.

### Add a new Alpine global component

1. Create `src/js/components/<category>/<name>.js` that returns an Alpine component object.
2. Import it in `src/js/index.js`.
3. Register it before `Alpine.start()`: `Alpine.data("myComponent", myComponent);`.
4. Do not define new global Alpine components inline in HTML `<script>` tags.

### Modify a theme token or utility

1. Open `src/css/style.css`.
2. Add/update tokens in the `@theme` block or `@utility` block.
3. Do not create `tailwind.config.js`.

### Add/change a locale string

1. Edit `src/locales/<lang>/common.json` for every supported language.
2. Keep keys grouped by feature/page for consistency.
3. Use the new key via `x-text="$t('key')"` or the i18next API in JS.

## Verification Commands

- `npm start` — dev server with HMR.
- `npm run build` — production build; must pass without errors.
- `npm run lint` — ESLint.
- `npm run format` — Prettier formatting.
- `npm run format:check` — check formatting without writing.

## Don'ts

- Don't install new packages without asking the user.
- Don't create a `tailwind.config.js` — Tailwind v4 is configured entirely through `src/css/style.css`.
- Don't use legacy/non-existing semantic color tokens (`success`, `warning`, `error`, `info`, `blue-light`) — use standard Tailwind color classes (`green`, `amber`, `red`, `blue`/`sky`).
- Don't hardcode hex colors or pixel values in `class` attributes — use `@theme` tokens.
- Don't call `Alpine.start()` more than once.
- Don't define new global Alpine components inline in HTML `<script>` tags — register them in `src/js/index.js`.
- Don't add new chart/carousel/map/table JS files without importing and calling them in `src/js/index.js`.
- Don't add `<style>` blocks or inline `style=""` attributes with arbitrary colors or sizes — use Tailwind utility classes with theme tokens.
- Don't reference images with absolute paths — use paths relative to the HTML file or `src/images/`.
- Don't create pages outside `src/pages/` — the webpack glob picks up all HTML files under `src/pages/**/*.html`.
- Don't duplicate shared UI (sidebar, header, footer) inline in pages — always extract to a partial and use `<include>`.
- Don't reorganize `src/partials/` folders — the current split matches the sidebar navigation structure.
