# 🚲 Toronto Bike Share — Live Station Tracker

A real-time dashboard for Bike Share Toronto that shows live bike, **e-bike**,
and dock availability across the entire city — built in React and powered
directly by the city's public GBFS data feed.

**[Live Demo](#)** &nbsp;·&nbsp; **[Report a Bug](#)** &nbsp;·&nbsp; Built by Brendan Dindial

---

## Why this project exists

Anyone who's walked ten minutes to a bike share station only to find it
empty (or full, if you're trying to dock) knows the problem. This app pulls
Toronto's official live station data and puts it in front of the user in
under a second — searchable, filterable by neighbourhood, and refreshing
itself every 30 seconds so the numbers on screen are never stale.

It also tracks **e-bike availability separately from regular bikes** — a
detail a lot of simpler trackers skip. As e-bikes have become a bigger part
of Toronto's fleet, knowing *which kind* of bike is waiting at a station
actually matters: e-bikes and mechanical bikes aren't interchangeable for
every rider or every trip, so folding them into one generic "bikes
available" number would quietly throw away useful information the feed
already provides.

## What it does

- **Live data, not a snapshot** — polls the city's GBFS feed every 30
  seconds and re-renders automatically, no page refresh needed
- **Bike-type breakdown** — regular vs. e-bike counts shown per station,
  not just a combined total
- **Search** — filter by station name or street address as you type
- **Neighbourhood filter** — dropdown built dynamically from the live data
- **Smart sorting** — busiest stations (most bikes available) surface first
- **Resilient to network hiccups** — if the feed's CORS restrictions or a
  connection drop cause a fetch to fail, the app retries automatically
  instead of dying silently
- **Pagination** — loads 24 stations at a time with a "Show More" button
  rather than rendering 600+ DOM nodes at once
- **Fully responsive** — clean dark UI from desktop down to mobile

## Tech stack

| Category | Tools / Concepts |
|---|---|
| **Framework** | React 18 (functional components + Hooks) |
| **Build tool** | Vite |
| **Language** | JavaScript (ES6+) |
| **State management** | React Hooks — `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef` |
| **Architecture** | Custom hooks, component composition, single-responsibility components |
| **Data source** | [GBFS](https://gbfs.org/) (General Bikeshare Feed Specification) — Bike Share Toronto's public feed |
| **Networking** | Fetch API, async/await, CORS-proxy fallback, automatic retry with backoff |
| **Styling** | Modern CSS — custom properties (design tokens), CSS Grid/Flexbox, responsive media queries |
| **Tooling** | Git, GitHub, npm |

## Project structure

```
src/
  App.jsx                        top-level layout & filter/pagination state
  index.css                      design-token driven styling
  constants.js                   API URLs, CORS proxy, refresh interval, page size
  hooks/
    useBikeShareStations.js      data fetching, polling, retry-on-failure logic
  utils/
    fetchJSON.js                 fetch with CORS-proxy fallback
    stationHelpers.js            data transforms & formatting
  components/
    Hero.jsx
    StatsSummary.jsx
    SectionHeading.jsx
    Controls.jsx                 search + neighbourhood filter
    StationCard.jsx
    StationGrid.jsx
    Footer.jsx
```

## How it works

1. On load, the app fetches **station_information** (names, locations,
   capacity) once — this rarely changes.
2. It then fetches **station_status** (live bike/dock counts) and merges it
   with the station info by ID.
3. Both requests go through a small `fetchJSON` helper that tries the feed
   directly first, then automatically falls back to a CORS proxy — the
   public feed doesn't send CORS headers, so a browser can't call it
   directly without one.
4. `station_status` is re-fetched every 30 seconds via `setInterval`, and
   the UI re-renders with the new numbers.
5. Search term, neighbourhood filter, and pagination are all handled
   client-side with `useMemo` so filtering never triggers an extra network
   call.

## Getting started

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
```

Outputs static files to `dist/` — deployable to GitHub Pages, Vercel,
Netlify, or any static host.

## Possible next steps

- Add a live map view (Leaflet/Mapbox) plotting stations geographically
- Persist the user's last search/filter in `localStorage`
- Add unit tests for the data-merging and filtering logic
- Swap the public CORS proxy for a small serverless function

---

© Brendan Dindial — Computer Programming student, Humber College
