# Calendar Timetable

A small **React** web app for planning a **weekly timetable** (Monday–Sunday) and viewing a **2026 monthly calendar** that lines up with the same weekday logic. Everything is stored **locally in your browser**; there is no server or account.

## Features

- **Weekly grid** — Time slots from **07:00** to **21:30** in **30-minute** steps. Click an empty cell to add a session, or click a block to edit or delete it.
- **Overlap checks** — Saving is blocked if a new or edited session overlaps another on the same day.
- **2026 calendar** — Switch with the header tabs to see all twelve months of **2026** (Monday-first weeks). Days that fall on a weekday with at least one timetable session show colored dots (session colors).
- **Persistence** — Sessions are saved to `localStorage` under the key `calendar-timetable-sessions-v1`.
- **Theme** — Gold / blue / black palette with automatic **light** and **dark** styles based on the system preference.

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 8](https://vite.dev/)
- [ESLint 9](https://eslint.org/) (flat config)

## Prerequisites

- [Node.js](https://nodejs.org/) (current LTS is a good choice)
- npm (comes with Node)

## Getting started

Clone the repository, install dependencies, and start the dev server:

```bash
git clone <your-repo-url>
cd calender
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Scripts

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `npm run dev`  | Start Vite in development with HMR   |
| `npm run build`| Typecheck and produce production build in `dist/` |
| `npm run preview` | Serve the `dist/` build locally   |
| `npm run lint` | Run ESLint on the project            |

## Configuration (optional)

Grid range and slot size are defined in `src/constants.ts` (`GRID_START_HOUR`, `GRID_END_HOUR`, `SLOT_MINUTES`, etc.). Session color presets live in `SESSION_COLORS`; global colors use CSS variables in `src/index.css`.

## Data and privacy

- Data never leaves your machine unless you export or sync it elsewhere (not implemented).
- Clearing site data for this origin will remove stored sessions.

## Project layout (high level)

```
src/
  App.tsx                 # Main shell, view toggle, session state
  components/
    TimetableGrid.tsx     # Weekly grid UI
    MonthlyCalendar2026.tsx
    SessionEditor.tsx     # Modal create/edit
  storage.ts              # localStorage load/save
  sessionUtils.ts         # Overlap helpers
  timeUtils.ts            # Grid time math
  types.ts
```

## Contributing

Issues and pull requests are welcome. Please run `npm run lint` and `npm run build` before submitting changes so the project stays type-clean and lint-clean.
