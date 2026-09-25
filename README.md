# Urban Tree Inequality — Who Gets Shade, Cleaner Air and Cooler Streets?

A pure **HTML/CSS/vanilla JS** storytelling site on urban tree canopy inequality — how shade, cooler streets, and cleaner air track income.

No frameworks, no build tools. Open `index.html` directly or serve statically.

## Run

Open `index.html` in a browser, or:

```bash
# any static server, e.g.
npx serve .
# or
python -m http.server
```

All paths are relative; navigation works both ways.

## Folder structure (fixed per architecture)

```
urban-tree-inequality/
├── index.html
├── pages/
│   ├── the-problem.html
│   ├── the-data.html
│   ├── case-studies.html
│   └── take-action.html
├── css/
│   ├── base.css          # reset, tokens, typography, grid
│   ├── components.css    # nav, cards, footer, buttons, hero
│   └── charts.css        # chart/map/table styling
├── js/
│   ├── main.js           # nav toggle, active link, reveal, year
│   ├── data.js           # static dataset (sample, clearly labeled)
│   ├── charts.js         # bar + scatter in vanilla SVG
│   └── map.js            # neighborhood grid + compare tool
├── assets/
│   ├── data/neighborhoods.json
│   └── images/  fonts/   # reserved
└── README.md
```

**Navigation consistency:** active state is set in `js/main.js` (adds `.is-active` by matching `data-page`). Footer is duplicated by convention with identical markup per page.

## Code conventions

- **2-space indent**, UTF-8, human-readable.
- **CSS variables** for the whole palette in `css/base.css` — no stray hex in components.
  Domain tokens like `--color-canopy-high`, `--color-heat-warm` live alongside the ElevenLabs editorial palette.
- **kebab-case** classes, **camelCase** JS.
- **No inline styles or inline `<script>`** in HTML.
- **Data separation:** values in `js/data.js` + `assets/data/neighborhoods.json`.
- **Progressive enhancement:** bar chart table and map grid render statically; JS upgrades them.

## Data & sources

All on-page charts are **sample/illustrative data** with the same shape as published assessments. Every chart carries a source note, per architecture.

To swap in real data:

- Replace `js/data.js` + `assets/data/neighborhoods.json` with your extract: fields `canopyPct`, `surfaceTempC`, `aqiEstimate`, `medianIncome`, `incomeBracket`.
- Real source families to pull from:
  - **Canopy:** local LiDAR / NAIP canopy assessments; USDA Forest Service; American Forests Tree Equity Score.
  - **Temperature:** Landsat 8/9 thermal (LST) summer composites (USGS EarthExplorer).
  - **Income/demographics:** ACS 5-year tract estimates (U.S. Census).
  - **Air:** EPA AQS PM2.5 / ozone; modeled PM2.5 surfaces.
  - **Health/heat:** CDC heat surveillance, county health dept ER data.
- Keep the source citation under each chart when you swap.

## Accessibility & responsiveness

- Semantic HTML, alt text on all images/SVGs, `aria-label`/`aria-pressed` on map cells, keyboard-navigable bars/points (`tabindex="0"`), visible focus rings.
- Color contrast checked for canopy/heat ramps — tooltips add text labels, not color alone.
- Breakpoints: <640 mobile (1-up), 640–1024 tablet (2-up), 1024+ desktop; grid caps at 1200px; no horizontal scroll.

## Design

Adapted from `old-DESIGN.md` (ElevenLabs editorial: off-white `#f5f5f5` canvas, ink `#0c0a09`, Inter + EB Garamond / Waldenburg at 300, pill CTAs, pastel gradient orbs as atmosphere only, 1px hairlines, soft drop `0 4px 16px rgba(0,0,0,0.04)`, 96px section rhythm).

Domain overlay adds canopy greens and heat gradient — always via CSS variables.

## Equity framing

Per architecture, the income/demographic disparity thesis stays visible on every major page: top announcement bar, page eyebrow/intro, footer reminder, and equity-ordered/colored charts. The site never presents tree cover as pure aesthetics.
