# OPR Scoringo

A mobile-first web app for tracking scoring and objectives in **One Page Rules (OPR)**
tabletop war games. **Each player opens their own instance** on their own device and tracks
only their own score through a 4-round match: pick a primary mission, draw/discard secondary
missions each round, and keep a running VP total. There are no player names and no sync —
two players just run two copies side by side.

## Running it

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # typecheck + production build into dist/
npm run preview  # serve the production build
npm test         # run the unit tests
```

The build output in `dist/` is a static site — deploy it to Netlify, Vercel, GitHub Pages,
or any static host.

## How it works

- **Setup** — choose a primary mission (Take and Hold / Conquest / Domination), set
  the VP value of each secondary, and flag the opponent's army features (Hero / Tough 6+ /
  15+ models).
- **Round 1** is deployment — nothing scores and no secondaries are drawn.
- **Rounds 2–4** each have two phases:
  - **Draw** — discard unwanted secondaries, draw to 3, keep 2. Secondaries that can't be
    scored against the opponent's army (Assassination, Bring it Down, Cull the Horde) are
    skipped automatically.
  - **Score** — enter how many primary VP you scored this round (you apply the primary
    mission's rules yourself) and tick which secondaries you scored, then commit. The app
    tallies the running total.
- The match auto-saves to the browser, so closing or refreshing won't lose progress.

## Rules notes & assumptions

These match the supplied scoring document, with a couple of points the document left open:

- **Each scored secondary is worth a configurable number of VP (default 1).** Set it on the
  setup screen. The source rules don't state a per-card value.
- **Game length is 4 rounds.**
- **A scored secondary is spent** (discarded) at the end of the round; unscored cards carry
  over into the next round's draw phase.
- Conditions the app can't physically observe (objective control, units destroyed, morale
  checks, etc.) are entered/confirmed by the players; the app does the bookkeeping.

## Project layout

```
src/
  data/missions.ts        # the 3 primaries + 12 secondaries (rules text + metadata)
  state/
    matchTypes.ts         # domain types
    matchReducer.ts       # all state transitions (pure)
    deck.ts               # shuffle / draw / conditional-skip logic (pure, tested)
    persistence.ts        # localStorage load/save
    useMatch.tsx          # React context + reducer hook
  logic/scoring.ts        # primary/secondary VP computation (pure, tested)
  components/             # SetupScreen, Scoreboard, SecondaryDrawPanel,
                          # RoundScoringPanel, RulesReference, SecondaryCard, ui
```

Unit tests live next to the rules-critical logic (`src/logic/scoring.test.ts`,
`src/state/deck.test.ts`).
