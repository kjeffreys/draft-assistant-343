# Fantasy Draft Assistant — Product Requirements Document (PRD)

*v1.1 • June 18 2025 (zero-cost stack)*

## Purpose & Vision
- Build a 100% free-to-run, offline-capable PWA that helps you draft the highest-EV roster in any redraft league by:
  - Auto-loading up-to-date ADP, projections, injuries, bye weeks.
  - Persisting the entire draft board locally so a refresh or loss of signal never hurts.
  - Surfacing Smart-Pick guidance that blends VOR, positional drop-off, bye-week balance, roster needs and user-defined flags.
  - Learning from historical drafts (yours and league) to sharpen future recommendations.
- **Success Metric:** finish every draft with a top-3 projected roster per FantasyPros power rankings; app reacts in under 5 seconds after each pick.

## Target Users & Platforms
- **Primary drafter:** iPhone/iPad (Safari PWA) during live drafts in home/ESPN rooms.
- **Alternate use:** laptop/desktop (Chrome or Edge) for mock drafts and research.
- **Future adopters:** Android and desktop users who reuse the app.
- Minimum browser support: iOS 15+, Chrome 117+, with 10&nbsp;MB local storage.

## Functional Requirements
- **F-1 Dynamic data ingest** – nightly Python ETL pulls to `public/players_YYYY.json`:
  - Sleeper players & ADP
  - FantasyPros projection CSVs
  - Depth charts & injuries
- **F-2 League import** – user pastes Sleeper or Yahoo league ID; the app infers roster slots, scoring and keepers.
- **F-3 Real-time draft board** – one-tap “Taken” marks player; colour by team with undo supported.
- **F-4 Local persistence** – draft state saved to IndexedDB (Dexie) with `navigator.storage.persist()`; export/import JSON backup.
- **F-5 Multi-league support** – namespaced sessions `{season}:{leagueId}`; unlimited drafts stored.
- **F-6 Smart-Pick engine** – score = VOR + DropOff + ByeAdj + RosterNeed + FlagBoost; user sliders tune weights.
- **F-7 Search & filters** – fuzzy search, position tabs, hide drafted/injured, “Targets” list.
- **F-8 Bye-week heat-map** – grid showing number of starters per week with warnings if too many share a bye.
- **F-9 Tier drop-off alert** – badge “⚠ Last of Tier” when next player’s VOR delta exceeds threshold.
- **F-10 Custom flags/tiers** – long-press on player row to tag “Target” or “Fade” with custom colour.
- **F-11 Historical analytics** – ETL stores pick order; small GBM trained with scikit-learn and exported to TF.js; browser predicts “% chance player lasts”.
- **F-12 Offline-first PWA** – service-worker caches shell plus latest JSON/model; works offline for 24&nbsp;h.
- **F-13 Accessibility** – 4.5:1 contrast, dark mode, haptic on pick confirm.

## Non-Functional Requirements
- **Performance:** ≤ 1&nbsp;s first paint (cached) and ≤ 5&nbsp;s recompute after a pick.
- **Reliability:** 99.5% uptime for GitHub Pages during Aug–Sep.
- **Storage:** ≤ 5&nbsp;MB per season in IndexedDB.
- **Security:** no PII beyond email if OAuth used; tokens never leave device.
- **Cost:** $0 infrastructure forever with no free‑tier risk.
- **Maintainability:** 80% unit-test coverage; CI on every PR.
- **Compliance:** MIT licence; assets public-domain or CC-BY.

## Technology Stack (all permissive, cost-free)
- **Frontend:** React 18 + TypeScript via Vite – familiar with the largest ecosystem.
- **UI kit:** Tamagui (RN-web) – mobile-first styling.
- **State:** Zustand – tiny and hook-based.
- **Local DB:** Dexie (IndexedDB) – fast queries and hooks.
- **Charts:** Recharts – SVG without D3 bloat.
- **ETL + ML:** Python 3.12, pandas, pysleeper, scikit-learn, joblib – rich FF APIs and simple model export.
- **Model inference:** TensorFlow.js (< 1&nbsp;MB weights) – runs fully in the browser.
- **CI / Hosting:** GitHub Actions (nightly cron) with GitHub Pages for static hosting – permanently free.

## Data Flow
- **Nightly 03:00 UTC:** GitHub Action runs `etl/build_dataset.py` and `train_model.py`, then commits updated JSON and `model.json` to `main`.
- **Merge to main:** triggers Pages Deploy Action which bundles the React PWA and pushes to the `gh-pages` branch.
- **User loads PWA:** service-worker caches the app shell, `/public/*.json` and the model.
- During the draft:
  - Mark pick → Dexie write.
  - Smart-Pick overlay reads cache and model → shows top picks in under 100&nbsp;ms.
  - User exports draft JSON for archival.

## Project Milestones (6 × 2-week sprints)
1. Repo initialise, README, PRD, Vite+React scaffold, Pages deploy.
2. Tamagui UI skeleton, Dexie schema, league import screen.
3. Sleeper/FantasyPros ETL, nightly GitHub Action, player list loading.
4. Draft board interactions, offline persistence, bye-week heat-map.
5. Smart-Pick engine, tier alerts, export/import backups.
6. TF.js availability model, Lighthouse ≥ 90, beta testing and polish.

## Risks & Mitigations
- **Upstream API changes / rate-limits** – data gaps → cache results locally, back off, fallback to scraping ESPN CSV.
- **GitHub Actions quota exceeded** – build failures → public repo grants unlimited minutes; keep ETL under 5&nbsp;min.
- **Model drift / bad projections** – poor advice → weekly retrain and display “projection as of DATE”.
- **User device storage cleared** – draft loss → offer manual “Export Draft” JSON to iCloud/Drive.
- **Ecosystem dep breaks** – build abort → Dependabot alerts; pin versions and fail CI fast.

## Definition of Done
- All functional items (F‑1 … F‑13) pass Cypress e2e tests.
- PWA Lighthouse score ≥ 90 (performance, accessibility, best-practices).
- Nightly Action green seven consecutive days.
- Draft completion offline and online verified.
- README and changelog up-to-date; PRD reflects shipped scope.

**Maintainers:** Kyle Jeffreys ([kjeffreys](https://github.com/kjeffreys))
