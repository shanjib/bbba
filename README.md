# bbba.github.io
Website for the Boston Bengali Basketball Association

A static, multi-season site for a casual community basketball league ("Hoops, Heart & Heritage"), hosted on GitHub Pages. Plain HTML, CSS and vanilla JS: no framework, build step or backend. Results are entered by hand in data files and everything else (standings, averages, leaders) is computed in the browser.

## Running locally

The site must be served over http, because `app.js` uses `fetch()` for the header/footer partials and the rules pages, which browsers block on `file://`.

```bash
npx serve .            # http://localhost:3000
# or
python3 -m http.server 3000
```

`serve` strips `.html` and can drop the query string when it redirects (`stats.html?game=X` becomes `stats`). Visit `stats?game=2026-g4` directly, use `python3 -m http.server`, or add a `serve.json` with `{ "cleanUrls": false }`. GitHub Pages serves both `stats` and `stats.html`.

Check changes at desktop width and at 768px or narrower before calling them done.

## File structure

```
/
├── index.html        About / home: hero, quick stats, champion banner, past champions, "Follow BBBA"
├── schedule.html     Playoffs, completed and upcoming games for the selected season
├── standings.html    Derived standings
├── teams.html        Every team's roster with per-player stats, plus unassigned players
├── team.html         One team in one season (?season=YYYY&team=<id>)
├── players.html      All players rostered in the selected season
├── player.html       One player across every season (?player=<id>)
├── stats.html        Season leaders, box score list, season stats table;
│                     a single box score when ?game=<id> is present
├── rules.html        Shows js/data/rules-YYYY.html for the selected season
├── css/styles.css    Single stylesheet; responsive rules at the bottom
├── assets/
│   ├── champion-YYYY.jpeg        champion photo, one per season (optional)
│   └── teams/YYYY-<teamId>.jpeg  team photo for the team page (optional)
└── js/
    ├── config.js     league info, social links, currentSeason, seasons list
    ├── players.js    all-time player registry (names only)
    ├── app.js        all rendering and derivation logic
    ├── data/
    │   ├── season-YYYY.js   teams, games, playoffs, champion for one season
    │   └── rules-YYYY.html  that season's rulebook (hand-edited HTML)
    └── partials/
        ├── header.html  logo, nav, hamburger, past-season bar
        └── footer.html  season switcher, social links, league name
```

Every page loads the same three scripts, in order: `config.js`, `players.js`, `app.js`. Season files are never referenced in HTML; `app.js` loads them from `config.seasons`.

## How it works

Think of `config.js` + `players.js` + `js/data/` as the database, `app.js` as the engine, and the HTML/CSS as the shell.

**Startup** (`DOMContentLoaded` in `app.js`):
1. `loadSeasonScripts()` injects `data/season-YYYY.js` for each entry in `config.seasons` (a missing file logs a warning and is skipped).
2. `loadPartials()` swaps the header and footer partials into `#site-header-placeholder` / `#site-footer-placeholder`, then `renderSocialLinks()` fills them in.
3. The active nav link is highlighted (team pages count as Teams, player pages as Players) and the hamburger menu is wired up.
4. `applySeason(getViewedSeason())` fills `.current-season-label` spans, renders the season switcher and past-season bar, rewrites header links, and calls `renderPage()`, which runs every `render*` function. Each one no-ops if its container isn't on the page.

**Paths.** `getBasePath()` finds the `app.js` script tag and uses its resolved `.src` minus the filename, so partials, season files and rules load from the `js/` directory whatever the repo's base path. Links are relative (no leading `/`). Keep any new paths base-path-agnostic the same way.

**Seasons.**
- `getActiveSeason()` reads `?season=YYYY` on season-aware pages (`SEASON_AWARE_PAGES`) and falls back to `config.currentSeason`. `getViewedSeason()` also lets a box score follow its game's season and a team page follow the season in its link.
- The season switcher lives in the footer. It is hidden on pages that aren't season-aware, on single box scores, and when there is only one season. Changing it updates `?season=` with `history.pushState` and re-renders in place; back/forward is handled via `popstate`.
- When the viewed season isn't the current one, a bar under the header says so and links back to the current season.
- `seasonHref()` keeps the chosen season on internal links. Team links always name their season (teams are per season); player links never do (a player is the same person in every season).

**Responsive nav.** Breakpoint at 768px. Below it, the hamburger toggles `.nav-open` on the nav; it closes on link click or a click outside the header.

## Data model

### `js/config.js`
```js
const config = {
  league: { name, abbr, tagline, about, social: [{ platform, url, handle? }] },
  currentSeason: "2026",
  seasons: ["2026", "2027"]
};
```
`social` drives the footer row and "Follow BBBA" on Home; both are hidden when the list is empty. Instagram, YouTube, TikTok, Facebook and X/Twitter get an icon, anything else shows as text.

### `js/players.js`
```js
const players = [ { id: "shan", name: "Istiaque Shanjib" }, … ];
```
Names only, no team or season data. IDs are unique and never reused, even if a player leaves and rejoins.

### `js/data/season-YYYY.js`
```js
var seasons = {
  ...(typeof seasons !== "undefined" ? seasons : {}),
  "2026": {
    status: "complete",          // "upcoming" | "in-progress" | "complete" (missing = in progress)
    about: "…",                  // optional; overrides config.league.about (tagline works the same way)
    teams: [ { id: "cuties", name: "The Cuties", playerIds: ["shaw", …] }, … ],
    games: [
      {
        id: "2026-g1",           // unique across seasons; used in ?game=
        date: "2026-05-10",      // "YYYY-MM-DD" or null
        home: "cuties", away: "iggy",   // home/away is just a label
        youtubeUrl: null,
        homeScore: null, awayScore: null,   // null = not played
        playerStats: [
          { playerId: "shan", points: 14, rebounds: 5, assists: 3, blocks: 1, steals: 2 },
          { playerId: "sami", teamId: "iggy", … }   // teamId only for a sub playing for another team
        ]
      }, …
    ],
    champion: "cuties",          // team id once decided, else null/absent
    playoffs: [ { id: "2026-sf1", round: "Semifinal", …same fields as a game } ]
  }
};
```
The `var` plus spread lets every season file add to one global regardless of load order. Don't rename `seasons`; changing the pattern means updating every season file and the loader.

### Why it's shaped this way
- **Teams reference players** (`playerIds`), not the other way round, so teams can be reshuffled and renamed each season with season-specific rosters.
- **A stat line's team** comes from the roster (`statTeamId()`), unless the line carries a `teamId` for a sub.
- **No weeks**: games are standalone events with optional dates, since the league plays whenever people are free.
- **Derived, not entered**: standings, averages, totals and leaders are computed in `app.js`. `isPlayed(game)` means both scores are non-null.
- **Playoffs are a separate array** and never count toward standings or season stats; only `games` is read for those. Player pages list playoff games separately, with totals from the regular season only.

## Pages

| Page | Renderer | Notes |
|---|---|---|
| About | `renderAbout()` | Season about/tagline, quick-stat tiles (Games Remaining hidden once complete), champion banner, past champions |
| Schedule | `renderSchedule()` | Playoffs first (gold, round badge), then completed games newest first, then upcoming; "coming soon" for an empty upcoming season |
| Standings | `renderStandings()` | W, L, Win%, PF, PA, DIFF |
| Teams | `renderTeams()` | Per-team roster with GP, per-game averages and totals; "Unassigned Players" card |
| Team | `renderTeamPage()` | Record, playoff result, optional team photo, stats and schedule for one season |
| Players | `renderPlayers()` | Players rostered in the season, alphabetical |
| Player | `renderPlayerPage()` | Every season the player appears in, with game logs |
| Stats | `renderStats()` | Season leaders (top 5 PPG/RPG/APG/BPG/SPG), box score list, season stats table |
| Box score | `renderBoxScore()` | `stats.html?game=<id>`; searches every season's games and playoffs. Per-team table with totals and a Watch button when there's a video |
| Rules | `renderRules()` | Fetches `data/rules-YYYY.html`, or "coming soon" if the season has none |

**Standings tiebreakers** (`deriveStandings`): win % → head-to-head wins → head-to-head point differential → overall point differential. Head-to-head only counts games among the teams tied on win %, so ties of three or more teams work too.

**Player stats** (`deriveSeasonStats`): sums over played regular-season games only. Averages = total ÷ games with a `playerStats` entry. Missing fields count as 0.

**Champion banner**: shown on Home, Schedule, Standings and Teams when the season has a `champion`, with `assets/champion-YYYY.jpeg` (hidden if the file is missing).

## Common tasks

- **Record a game:** fill `date`, `homeScore`, `awayScore`, `playerStats` (and optionally `youtubeUrl`) on the game in the season file. A played game left without a date shows as "TBD" at the top of game lists.
- **Rosters:** add new players to `players.js` first, then add their ids to the team's `playerIds`.
- **Sub for another team:** add `teamId` to that player's stat line for that game.
- **Playoff game:** same fields, in the `playoffs` array. It never touches standings or season stats.
- **Champion:** set `champion` to the team id and add `assets/champion-YYYY.jpeg`.
- **Team photo:** add `assets/teams/YYYY-<teamId>.jpeg`.
- **Season status:** set `status` to `"upcoming"`, `"in-progress"` or `"complete"`.
- **New season:** copy the spread pattern into `js/data/season-YYYY.js`, add the year to `config.seasons`, add `js/data/rules-YYYY.html`, and bump `config.currentSeason` when it should become the default. No HTML changes needed.
- **Social accounts:** edit `config.league.social`.
- **New nav page:** one line in `js/partials/header.html` (and add it to `SEASON_AWARE_PAGES` if it should follow `?season=`).

## Styling

- Fonts: Bebas Neue (headings) and Nunito (body), via a Google Fonts `@import` in `styles.css`.
- Colors are CSS variables in `:root` (`--green`, `--green-dark`, `--red`, `--cream`, …), green and red inspired by the Bengali flag.
- Playoff cards are gold (`#c9910a`) with a `.round-badge`; the champion banner uses a gold gradient; YouTube buttons are YouTube red.
- Breakpoints at 960px, 768px and 480px, at the bottom of the stylesheet.

## Contributing

- Keep it static: no framework or build tooling.
- Discuss design and tradeoffs first, then make targeted edits.
- Work on a branch and open a PR; never push to `main` directly.
