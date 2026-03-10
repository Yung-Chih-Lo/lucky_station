# CLAUDE.md — AI Assistant Guide for Lucky Station

## Project Overview

**Lucky Station** (坐火行, *chò-hué kiânn*, "take the train journey") is a frontend-only React web application that lets users explore Taiwan's railway system by randomly picking a destination station from selected counties.

Users interact with an interactive SVG map of Taiwan or a county checkbox list to select regions, then trigger a random station picker with a brief animation. Results link to Wikipedia and Google Maps.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 16.14.0 |
| Build Tool | Vite 6.x with `@vitejs/plugin-react-swc` |
| Component Library | Ant Design (antd) 5.x |
| CSS-in-JS | styled-components 6.x |
| SVG Map | react-svg-map + @svg-maps/taiwan.main |
| Linting | ESLint 9.x (flat config) |
| Package Manager | npm |
| Module System | ES Modules (`"type": "module"`) |

> **Note:** TypeScript type packages (`@types/react`, `@types/react-dom`) are installed but the project is written in plain JSX, not TypeScript.

---

## Repository Structure

```
lucky_station/
├── src/
│   ├── App.jsx                  # Root component; owns top-level state
│   ├── main.jsx                 # React entry point (ReactDOM.render)
│   ├── components/
│   │   ├── ResultDisplay.jsx    # Animated result modal
│   │   ├── Sidebar.jsx          # County checkboxes + pick button
│   │   └── TaiwanSvgMap.jsx     # Interactive SVG map of Taiwan
│   ├── constants/
│   │   └── mapConstants.js      # SVG ID → Chinese county name mappings
│   ├── data/
│   │   └── stations.json        # Static station data keyed by county
│   └── utils/
│       └── stationUtils.js      # getAllCounties(), getRandomStation()
├── public/
│   └── train.png                # Favicon / branding image
├── index.html                   # HTML shell
├── vite.config.js               # Vite + SWC plugin config
├── eslint.config.js             # ESLint v9 flat config
└── package.json
```

---

## Development Workflows

### Initial Setup

```bash
npm install
```

No environment variables or `.env` files are required. This is a fully static application.

### Common Commands

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Production build → dist/
npm run preview   # Serve the production build locally
npm run lint      # Run ESLint across all source files
```

### Linting

ESLint v9 flat config is used (`eslint.config.js`). Rules enforced:

- `eslint:recommended` baseline
- `react-hooks/rules-of-hooks` and `react-hooks/exhaustive-deps`
- `react-refresh/only-export-components` (warn)
- Uppercase variable names are explicitly allowed

To auto-fix lint issues:

```bash
npx eslint . --fix
```

### No Test Suite

There are currently no tests. If adding tests, prefer **Vitest** (compatible with Vite) with React Testing Library. Place test files as `*.test.jsx` alongside the source file they cover.

---

## Architecture & Key Conventions

### State Management

All shared state lives in `App.jsx` and is passed down as props:

| State | Type | Purpose |
|-------|------|---------|
| `selectedCounties` | `string[]` | Counties currently selected by the user |
| `randomStation` | `object\|null` | `{ name, county }` of the picked station |
| `isResultModalVisible` | `boolean` | Controls the result overlay visibility |

No external state library (Redux, Zustand, etc.) is used — React `useState` is sufficient for this app's scope.

### Component Responsibilities

- **`App.jsx`** — Layout shell, state owner, wires `handleSelectionChange` and `handleRandomPick` callbacks.
- **`Sidebar.jsx`** — Renders county checkboxes (synced with map), select-all/deselect-all buttons, the "Pick Lucky Station!" trigger, and an info modal listing all stations per county.
- **`TaiwanSvgMap.jsx`** — Renders the SVG map; highlights selected counties; emits click events that update `selectedCounties` in the parent.
- **`ResultDisplay.jsx`** — Shows the randomly chosen station with a ~2-second flickering animation (using `setInterval`/`setTimeout`), plus Wikipedia and Google Maps links.
- **`stationUtils.js`** — Pure utility functions; no side effects.
- **`mapConstants.js`** — Static lookup tables mapping SVG element IDs to Chinese county names, and vice versa. Penghu, Kinmen, and Lienchiang are intentionally excluded (no rail service).

### Styling Conventions

- **styled-components** for all layout and visual styling; no global CSS files.
- Transient props (not forwarded to the DOM) are prefixed with `$` — e.g., `$isAnimating`, `$show`.
- Responsive breakpoint: `@media (max-width: 768px)` for mobile layout adjustments.
- Ant Design components (`Button`, `Modal`, `Checkbox`, `Typography`) provide the base UI — override sparingly via styled-components wrappers.

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Components | PascalCase | `TaiwanSvgMap` |
| Functions / variables | camelCase | `getRandomStation`, `selectedCounties` |
| Event handlers | `handle` prefix | `handleRandomPick` |
| Styled-components transient props | `$` prefix | `$isAnimating` |
| Comments in source | Traditional Chinese | `// 全選縣市` |

### Data Layer

`src/data/stations.json` is the sole data source — a plain JSON object where keys are Chinese county names and values are arrays of station name strings. All lookups are synchronous; no network calls are made.

---

## Adding or Modifying Stations

1. Edit `src/data/stations.json`.
2. Keys must match the county names used in `src/constants/mapConstants.js`.
3. Verify the county appears in the `getAllCounties()` return value (`stationUtils.js`).
4. Run `npm run lint` to confirm no regressions.

## Adding a New County to the Map

1. Add the SVG element ID → Chinese name mapping in `mapConstants.js` (`SVG_ID_TO_COUNTY`).
2. Add the reverse mapping in `COUNTY_TO_SVG_ID`.
3. Add station data for the county in `stations.json`.
4. Verify map click and checkbox interactions work end-to-end in the dev server.

---

## Known Limitations & Improvement Opportunities

- **React 16** — Upgrade to React 18 to use concurrent features and the new root API (`createRoot`).
- **No tests** — Add Vitest + React Testing Library.
- **No TypeScript** — Type packages are installed; migrating JSX → TSX would improve safety.
- **No CI/CD** — No `.github/workflows` directory exists; consider adding lint + build checks on PRs.
- **No pre-commit hooks** — Consider adding `husky` + `lint-staged` to enforce linting before commits.
- **No persistent state** — Page refresh clears all selections. `localStorage` could preserve county selections across sessions.

---

## Git Workflow

The project uses standard feature-branch development:

```bash
git checkout -b feature/<description>
# make changes
npm run lint
git add <files>
git commit -m "descriptive message"
git push -u origin feature/<description>
```

Always run `npm run lint` before committing. The `dist/` folder is gitignored and should never be committed.
