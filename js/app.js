// ─── Season Resolution ────────────────────────────────────────────────────────

// Pages that support season switching via ?season= param
const SEASON_AWARE_PAGES = ["index.html", "schedule.html", "standings.html", "stats.html", "teams.html", "rules.html"];

function isSeasonAwarePage() {
  return SEASON_AWARE_PAGES.includes(currentPage());
}

function getActiveSeason() {
  // Other pages ignore ?season= and always show the current season
  if (!isSeasonAwarePage()) return config.currentSeason;
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("season");
  if (requested && seasons[requested]) return requested;
  return config.currentSeason;
}

function getSeasonData(seasonKey) {
  return seasons[seasonKey] || null;
}

// "upcoming", "in-progress" or "complete". Seasons without a status are treated as in progress.
function getSeasonStatus(seasonKey) {
  return getSeasonData(seasonKey)?.status || "in-progress";
}

// Per-season text (tagline, about, ...) with the league-wide value as the fallback
function getSeasonText(seasonKey, key) {
  return getSeasonData(seasonKey)?.[key] ?? config.league[key];
}

function setSeasonParam(seasonKey) {
  const url = new URL(window.location.href);
  url.searchParams.set("season", seasonKey);
  // Remove ?game= when switching seasons — a box score from another season
  // is no longer relevant and would show the wrong data
  url.searchParams.delete("game");
  window.history.pushState({}, "", url);
}

// The season the page is showing: a box score belongs to its game's season,
// everything else follows getActiveSeason()
function getViewedSeason() {
  const params = new URLSearchParams(window.location.search);
  // A team page belongs to the season in its link
  if (currentPage() === "team.html" && seasons[params.get("season")]) return params.get("season");
  const gameId = params.get("game");
  if (gameId) {
    const { seasonKey } = findGame(gameId);
    if (seasonKey) return seasonKey;
  }
  return getActiveSeason();
}

// Internal link that keeps the chosen season: adds ?season= when it isn't the
// current season and leaves the link untouched otherwise
function seasonHref(href, seasonKey = getViewedSeason()) {
  if (seasonKey === config.currentSeason) return href;
  const [path, query = ""] = href.split("?");
  const params = new URLSearchParams(query);
  params.set("season", seasonKey);
  return `${path}?${params}`;
}

// Teams are independent per season, so a team link always names its season
function teamHref(seasonKey, teamId) {
  return `team.html?season=${encodeURIComponent(seasonKey)}&team=${encodeURIComponent(teamId)}`;
}

// A team's name linked to its team page, or plain text when the team isn't in the season
function teamLink(seasonKey, teamId, name) {
  if (!getTeam(teamId, seasonKey)) return name ?? teamId ?? "";
  return `<a href="${teamHref(seasonKey, teamId)}" class="team-link">${name ?? getTeam(teamId, seasonKey).name}</a>`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPlayer(id) {
  return players.find(p => p.id === id) || null;
}

function getTeam(id, seasonKey) {
  const data = getSeasonData(seasonKey);
  if (!data) return null;
  return data.teams.find(t => t.id === id) || null;
}

// The team a stat line counts for: its teamId when a sub played for another
// team that game, otherwise the team whose roster has the player
function statTeamId(ps, seasonKey) {
  if (ps.teamId) return ps.teamId;
  return getSeasonData(seasonKey)?.teams.find(t => t.playerIds.includes(ps.playerId))?.id ?? null;
}

// Find a game in any season, checking both the games and playoffs arrays
function findGame(gameId) {
  for (const sk of config.seasons) {
    const data  = getSeasonData(sk);
    const found = data?.games.find(g => g.id === gameId)
      ?? data?.playoffs?.find(g => g.id === gameId);
    if (found) return { game: found, seasonKey: sk };
  }
  return { game: null, seasonKey: null };
}

function isPlayed(game) {
  return game.homeScore !== null && game.awayScore !== null;
}

function formatDate(dateStr) {
  if (!dateStr) return "TBD";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function avg(total, gp) {
  if (!gp) return "0.0";
  return (total / gp).toFixed(1);
}

function currentPage() {
  return window.location.pathname.split("/").pop() || "index.html";
}

// ─── Season Switcher ──────────────────────────────────────────────────────────

// The switcher lives in the footer partial and only shows on season-aware pages
function renderSeasonSwitcher(activeSeason) {
  const el = document.getElementById("season-switcher");
  if (!el) return;

  // Hide switcher on other pages and when viewing a specific box score
  const params = new URLSearchParams(window.location.search);
  if (!isSeasonAwarePage() || params.get("game") || config.seasons.length <= 1) {
    el.style.display = "none";
    return;
  }

  el.style.display = "";
  el.innerHTML = `
    <label class="switcher-label" for="season-select">Season</label>
    <select id="season-select" class="season-select">
      ${config.seasons.slice().reverse().map(s => `
        <option value="${s}" ${s === activeSeason ? "selected" : ""}>${s}</option>
      `).join("")}
    </select>`;

  document.getElementById("season-select").addEventListener("change", (e) => {
    setSeasonParam(e.target.value);
    applySeason(e.target.value);
  });
}

// ─── Past-Season Bar & Season Links ──────────────────────────────────────────

// Bar under the header whenever the page shows a season other than the current one
function renderPastSeasonBar(seasonKey) {
  const bar = document.getElementById("past-season-bar");
  if (!bar) return;

  if (seasonKey === config.currentSeason) {
    bar.hidden = true;
    bar.innerHTML = "";
    return;
  }

  // Same page without ?season=, keeping any other params. A box score belongs
  // to its own season, so going back to the current season leaves it for All Stats.
  const url = new URL(window.location.href);
  url.searchParams.delete("season");
  url.searchParams.delete("game");
  // The team may not exist in the current season, so a team page goes back to Teams
  if (currentPage() === "team.html") {
    url.pathname = url.pathname.replace(/team\.html$/, "teams.html");
    url.search = "";
  }

  bar.innerHTML = `
    <div class="past-season-inner">
      You're viewing the ${seasonKey} season
      <span class="past-season-sep">·</span>
      <a href="${url.pathname}${url.search}${url.hash}" class="past-season-back">Back to ${config.currentSeason}</a>
    </div>`;
  bar.hidden = false;
}

// The header's nav links and logo are static HTML, so rewrite them from their original href
function applySeasonLinks(seasonKey) {
  document.querySelectorAll(".header-inner a[href]").forEach(link => {
    if (!link.dataset.href) link.dataset.href = link.getAttribute("href");
    link.setAttribute("href", seasonHref(link.dataset.href, seasonKey));
  });
}

// Update everything that follows the selected season: labels, switcher, bar, links and page content
function applySeason(seasonKey) {
  document.querySelectorAll(".current-season-label").forEach(el => el.textContent = seasonKey);
  renderSeasonSwitcher(seasonKey);
  renderPastSeasonBar(seasonKey);
  applySeasonLinks(seasonKey);
  renderPage(seasonKey);
}

// ─── Standings Derivation ─────────────────────────────────────────────────────

function deriveStandings(data) {
  if (!data) return [];

  const map = {};
  data.teams.forEach(t => {
    map[t.id] = {
      teamId: t.id,
      name: t.name,
      wins: 0,
      losses: 0,
      pointsScored: 0,
      pointsAllowed: 0,
      h2h: {}
    };
    data.teams.forEach(other => {
      if (other.id !== t.id) map[t.id].h2h[other.id] = { wins: 0, pointDiff: 0 };
    });
  });

  data.games.filter(isPlayed).forEach(g => {
    const home = map[g.home];
    const away = map[g.away];
    if (!home || !away) return;
    const diff = g.homeScore - g.awayScore;

    home.pointsScored  += g.homeScore;
    home.pointsAllowed += g.awayScore;
    away.pointsScored  += g.awayScore;
    away.pointsAllowed += g.homeScore;

    if (g.homeScore > g.awayScore) {
      home.wins++;
      away.losses++;
      home.h2h[g.away].wins++;
    } else {
      away.wins++;
      home.losses++;
      away.h2h[g.home].wins++;
    }

    home.h2h[g.away].pointDiff += diff;
    away.h2h[g.home].pointDiff -= diff;
  });

  return Object.values(map).sort((a, b) => {
    const aGP = a.wins + a.losses, bGP = b.wins + b.losses;
    const aWP = aGP ? a.wins / aGP : 0, bWP = bGP ? b.wins / bGP : 0;
    if (bWP !== aWP) return bWP - aWP;
    const aH2H = a.h2h[b.teamId]?.wins ?? 0, bH2H = b.h2h[a.teamId]?.wins ?? 0;
    if (bH2H !== aH2H) return bH2H - aH2H;
    const aHD = a.h2h[b.teamId]?.pointDiff ?? 0, bHD = b.h2h[a.teamId]?.pointDiff ?? 0;
    if (bHD !== aHD) return bHD - aHD;
    return (b.pointsScored - b.pointsAllowed) - (a.pointsScored - a.pointsAllowed);
  });
}

// ─── Player Stats Derivation ──────────────────────────────────────────────────

function deriveSeasonStats(seasonKey) {
  const data = getSeasonData(seasonKey);
  if (!data) return [];

  const map = {};
  players.forEach(p => {
    map[p.id] = {
      playerId: p.id,
      name: p.name,
      gamesPlayed: 0,
      totalPoints: 0,
      totalRebounds: 0,
      totalAssists: 0,
      totalBlocks: 0,
      totalSteals: 0
    };
  });

  data.games.filter(isPlayed).forEach(g => {
    g.playerStats.forEach(ps => {
      if (!map[ps.playerId]) return;
      map[ps.playerId].gamesPlayed++;
      map[ps.playerId].totalPoints   += ps.points   ?? 0;
      map[ps.playerId].totalRebounds += ps.rebounds ?? 0;
      map[ps.playerId].totalAssists  += ps.assists  ?? 0;
      map[ps.playerId].totalBlocks   += ps.blocks   ?? 0;
      map[ps.playerId].totalSteals   += ps.steals   ?? 0;
    });
  });

  return Object.values(map);
}
// One row per player: GP, per-game averages, then totals. Used by Stats, Teams and the team page.
function playerStatsTable(rows) {
  return `
        <table class="roster-table">
          <thead><tr><th>Player</th><th>GP</th><th>PPG</th><th>RPG</th><th>APG</th><th>BPG</th><th>SPG</th><th>PTS</th><th>REB</th><th>AST</th><th>BLK</th><th>STL</th></tr></thead>
          <tbody>
            ${rows.map(s => `<tr>
              <td class="player-name">${s.name}</td>
              <td>${s.gamesPlayed}</td>
              <td>${avg(s.totalPoints,   s.gamesPlayed)}</td>
              <td>${avg(s.totalRebounds, s.gamesPlayed)}</td>
              <td>${avg(s.totalAssists,  s.gamesPlayed)}</td>
              <td>${avg(s.totalBlocks,   s.gamesPlayed)}</td>
              <td>${avg(s.totalSteals,   s.gamesPlayed)}</td>
              <td>${s.totalPoints}</td>
              <td>${s.totalRebounds}</td>
              <td>${s.totalAssists}</td>
              <td>${s.totalBlocks}</td>
              <td>${s.totalSteals}</td>
            </tr>`).join("")}
          </tbody>
        </table>`;
}

// Sort key for the stats tables: points per game, players without a game last
function ppg(s) {
  return s.gamesPlayed ? s.totalPoints / s.gamesPlayed : -1;
}

// ─── Partials ─────────────────────────────────────────────────────────────────

// Derive the base URL from the app.js script tag itself.
// This is always correct regardless of repo name or subdirectory depth,
// because partials/ sits right next to app.js inside js/.
function getBasePath() {
  // Walk all script tags and find the one ending in app.js
  const scripts = Array.from(document.querySelectorAll("script[src]"));
  const appScript = scripts.find(s => s.src.endsWith("app.js") || s.src.includes("app.js"));
  if (appScript) {
    // appScript.src is always a fully resolved absolute URL e.g.
    // "https://user.github.io/repo/js/app.js"
    // Strip the filename to get the directory.
    return appScript.src.substring(0, appScript.src.lastIndexOf("/") + 1);
  }
  // Should never reach here, but log loudly if we do
  console.error("BBBA: could not find app.js script tag — path resolution failed.");
  return "./js/";
}

async function loadPartials() {
  const base = getBasePath();

  const [headerHTML, footerHTML] = await Promise.all([
    fetch(`${base}partials/header.html`).then(r => r.text()),
    fetch(`${base}partials/footer.html`).then(r => r.text()),
  ]);

  const headerEl = document.getElementById("site-header-placeholder");
  const footerEl = document.getElementById("site-footer-placeholder");
  if (headerEl) headerEl.outerHTML = headerHTML;
  if (footerEl) footerEl.outerHTML = footerHTML;
}

function championshipBanner(seasonKey) {
  const bannerEl = document.getElementById("champion-banner");
  if (!bannerEl) return;

  // Clear first so switching to a season without a champion removes the banner
  bannerEl.innerHTML = "";
  bannerEl.style.display = "none";

  const data = getSeasonData(seasonKey);
  if (data?.champion) {
    const champ = data.teams.find(t => t.id === data.champion);
    if (champ) {
      const imgPath = `assets/champion-${seasonKey}.jpeg`;
      bannerEl.innerHTML = `
        <div class="champion-banner">
          <div class="champion-header">
            <span class="champion-trophy">🏆</span>
            <div class="champion-text">
              <div class="champion-label">${seasonKey} BBBA Champions</div>
              <div class="champion-name">${champ.name}</div>
            </div>
            <span class="champion-trophy">🏆</span>
          </div>
          <img
            src="${imgPath}"
            alt="${champ.name} — ${seasonKey} BBBA Champions"
            class="champion-photo"
            onerror="this.style.display='none'"
          />
        </div>`;
      bannerEl.style.display = "block";
    }
  }
}

// ─── Page: About ──────────────────────────────────────────────────────────────

function renderAbout(seasonKey) {
  const statsEl = document.getElementById("league-quick-stats");
  if (!statsEl) return;

  const el = document.getElementById("about-text");
  if (el) el.textContent = getSeasonText(seasonKey, "about");

  const taglineEl = document.querySelector(".league-tagline");
  if (taglineEl) taglineEl.textContent = getSeasonText(seasonKey, "tagline");

  const currentData = getSeasonData(seasonKey);
  const played = currentData ? currentData.games.filter(isPlayed).length : 0;
  const total  = currentData ? currentData.games.length : 0;
  // Players on this season's rosters, not the all-time list
  const rostered = new Set((currentData?.teams ?? []).flatMap(t => t.playerIds)).size;

  statsEl.innerHTML = `
      <div class="quick-stat"><span class="qs-num">${currentData ? currentData.teams.length : 0}</span><span class="qs-label">Teams</span></div>
      <div class="quick-stat"><span class="qs-num">${rostered}</span><span class="qs-label">Players</span></div>
      <div class="quick-stat"><span class="qs-num">${played}</span><span class="qs-label">Games Played</span></div>
      ${getSeasonStatus(seasonKey) !== "complete"
        ? `<div class="quick-stat"><span class="qs-num">${total - played}</span><span class="qs-label">Games Remaining</span></div>`
        : ""}
    `;

  championshipBanner(seasonKey);
}

// ─── Page: Schedule ───────────────────────────────────────────────────────────

function renderSchedule(seasonKey) {
  const container = document.getElementById("schedule-container");
  if (!container) return;

  championshipBanner(seasonKey);

  const data = getSeasonData(seasonKey);
  if (!data) { container.innerHTML = `<p class="empty-state">No schedule data found.</p>`; return; }

  const countEl = document.getElementById("schedule-game-count");
  if (countEl) countEl.textContent = data.games.length ? ` — ${data.games.length} games total` : "";

  const status = getSeasonStatus(seasonKey);
  if (status === "upcoming" && !data.games.length && !(data.playoffs ?? []).length) {
    container.innerHTML = `<p class="empty-state">The ${seasonKey} schedule is coming soon.</p>`;
    return;
  }

  const played   = data.games.filter(isPlayed).sort((a, b) => new Date(b.date) - new Date(a.date));
  // A complete season has no games to come
  const upcoming = status === "complete" ? [] : data.games.filter(g => !isPlayed(g));
  const playoffs = data.playoffs ?? [];

  let html = "";

  // ── Playoffs (always at top if they exist) ──
  if (playoffs.length) {
    html += `<h2 class="section-subheading playoff-heading">🏆 Playoffs</h2>`;
    playoffs.forEach(g => {
      const home    = g.home ? getTeam(g.home, seasonKey) : null;
      const away    = g.away ? getTeam(g.away, seasonKey) : null;
      const played  = isPlayed(g);
      const homeWin = played && g.homeScore > g.awayScore;

      if (played) {
        html += `
          <div class="game-card completed playoff-card">
            <div class="game-date">
              <span class="round-badge">${g.round}</span>
              ${formatDate(g.date)}
            </div>
            <div class="game-matchup">
              <span class="team-name ${homeWin ? "winner" : ""}">${teamLink(seasonKey, g.home)}</span>
              <span class="score-block">
                <span class="${homeWin ? "score-win" : "score-loss"}">${g.homeScore}</span>
                <span class="score-sep">–</span>
                <span class="${!homeWin ? "score-win" : "score-loss"}">${g.awayScore}</span>
              </span>
              <span class="team-name ${!homeWin ? "winner" : ""}">${teamLink(seasonKey, g.away)}</span>
            </div>
            <div class="game-card-links">
              ${g.youtubeUrl ? `<a class="yt-link-inline" href="${g.youtubeUrl}" target="_blank" rel="noopener noreferrer">▶ Watch</a>` : ""}
              <a class="box-score-link" href="${seasonHref(`stats.html?game=${g.id}`, seasonKey)}">Box Score →</a>
            </div>
          </div>`;
      } else {
        html += `
          <div class="game-card upcoming playoff-card">
            <div class="game-date">
              <span class="round-badge">${g.round}</span>
              ${formatDate(g.date)}
            </div>
            <div class="game-matchup">
              ${home && away
          ? `<span class="team-name">${teamLink(seasonKey, home.id)}</span>
                   <span class="vs-badge">VS</span>
                   <span class="team-name">${teamLink(seasonKey, away.id)}</span>`
          : `<span class="tbd-label">Matchup TBD</span>`}
            </div>
          </div>`;
      }
    });
  }

  // ── Completed regular season games ──
  if (played.length) {
    html += `<h2 class="section-subheading">Completed Games</h2>`;
    played.forEach(g => {
      const homeWin = g.homeScore > g.awayScore;
      html += `
        <div class="game-card completed">
          <div class="game-date">${formatDate(g.date)}</div>
          <div class="game-matchup">
            <span class="team-name ${homeWin ? "winner" : ""}">${teamLink(seasonKey, g.home)}</span>
            <span class="score-block">
              <span class="${homeWin ? "score-win" : "score-loss"}">${g.homeScore}</span>
              <span class="score-sep">–</span>
              <span class="${!homeWin ? "score-win" : "score-loss"}">${g.awayScore}</span>
            </span>
            <span class="team-name ${!homeWin ? "winner" : ""}">${teamLink(seasonKey, g.away)}</span>
          </div>
          <div class="game-card-links">
            ${g.youtubeUrl ? `<a class="yt-link-inline" href="${g.youtubeUrl}" target="_blank" rel="noopener noreferrer">▶ Watch</a>` : ""}
            <a class="box-score-link" href="${seasonHref(`stats.html?game=${g.id}`, seasonKey)}">Box Score →</a>
          </div>
        </div>`;
    });
  }

  // ── Upcoming regular season games ──
  if (upcoming.length) {
    html += `<h2 class="section-subheading">Upcoming Games</h2>`;
    upcoming.forEach(g => {
      html += `
        <div class="game-card upcoming">
          <div class="game-date">${formatDate(g.date)}</div>
          <div class="game-matchup">
            <span class="team-name">${teamLink(seasonKey, g.home)}</span>
            <span class="vs-badge">VS</span>
            <span class="team-name">${teamLink(seasonKey, g.away)}</span>
          </div>
        </div>`;
    });
  }

  if (!html) html = `<p class="empty-state">No games scheduled yet. Check back soon!</p>`;
  container.innerHTML = html;
}

// ─── Page: Standings ──────────────────────────────────────────────────────────

function renderStandings(seasonKey) {
  const tbody = document.getElementById("standings-body");
  if (!tbody) return;

  const data = getSeasonData(seasonKey);
  championshipBanner(seasonKey);
  const standings = deriveStandings(data);
  if (!standings.length) {
    const msg = getSeasonStatus(seasonKey) === "upcoming"
      ? `No games played yet. The ${seasonKey} season hasn't started.`
      : "No data yet.";
    tbody.innerHTML = `<tr><td colspan="8" class="empty-state">${msg}</td></tr>`;
    return;
  }

  tbody.innerHTML = standings.map((s, i) => {
    const gp   = s.wins + s.losses;
    const diff = s.pointsScored - s.pointsAllowed;
    const diffStr = diff > 0 ? `+${diff}` : `${diff}`;
    return `
      <tr class="${i === 0 && gp > 0 ? "leader-row" : ""}">
        <td class="rank">${i + 1}</td>
        <td class="team-col">${teamLink(seasonKey, s.teamId, s.name)}</td>
        <td>${s.wins}</td>
        <td>${s.losses}</td>
        <td>${gp ? (s.wins / gp * 100).toFixed(0) + "%" : "—"}</td>
        <td>${s.pointsScored}</td>
        <td>${s.pointsAllowed}</td>
        <td class="${diff > 0 ? "pos-diff" : diff < 0 ? "neg-diff" : ""}">${gp ? diffStr : "—"}</td>
      </tr>`;
  }).join("");
}

// ─── Page: Teams ──────────────────────────────────────────────────────────────

function renderTeams(seasonKey) {
  const container = document.getElementById("teams-container");
  if (!container) return;

  const data = getSeasonData(seasonKey);
  championshipBanner(seasonKey);
  if (!data) { container.innerHTML = `<p class="empty-state">No data for this season.</p>`; return; }

  if (getSeasonStatus(seasonKey) === "upcoming" && !data.teams.length) {
    container.innerHTML = `<p class="empty-state">Rosters coming soon.</p>`;
    return;
  }

  const allStats = deriveSeasonStats(seasonKey);

  const unassigned = players.filter(p => !data.teams.some(t => t.playerIds.includes(p.id)));

  container.innerHTML = data.teams.map(team => {
    const roster = team.playerIds.map(id => getPlayer(id)).filter(Boolean);

    let rosterHtml;
    if (roster.length) {
      // deriveSeasonStats has a row for every player in players.js
      rosterHtml = playerStatsTable(roster.map(p => allStats.find(x => x.playerId === p.id)));
    } else {
      rosterHtml = `<p class="empty-state">Roster not yet finalized.</p>`;
    }

    return `
      <div class="team-card">
        <h2 class="team-card-title">${teamLink(seasonKey, team.id)}</h2>
        ${rosterHtml}
      </div>`;
  }).join("");

  if (unassigned.length) {
    container.innerHTML += `
      <div class="team-card unassigned-card">
        <h2 class="team-card-title unassigned-title">
          Unassigned Players <span class="unassigned-count">${unassigned.length}</span>
        </h2>
        <table class="roster-table">
          <thead><tr><th>Player</th></tr></thead>
          <tbody>${unassigned.map(p => `<tr><td class="player-name">${p.name}</td></tr>`).join("")}</tbody>
        </table>
      </div>`;
  }
}

// ─── Page: Stats ──────────────────────────────────────────────────────────────

function renderStats(seasonKey) {
  const container = document.getElementById("stats-container");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const gameId = params.get("game");

  if (gameId) {
    renderBoxScore(gameId, container);
  } else {
    renderStatsLeaders(seasonKey, container);
  }
}

function renderBoxScore(gameId, container) {
  // Find game across all seasons
  const { game, seasonKey } = findGame(gameId);

  if (!game || !isPlayed(game)) {
    container.innerHTML = `<p class="empty-state">Box score not available.</p>`;
    return;
  }

  const home    = getTeam(game.home, seasonKey);
  const away    = getTeam(game.away, seasonKey);
  const homeWin = game.homeScore > game.awayScore;

  const homeStats = game.playerStats.filter(ps => statTeamId(ps, seasonKey) === game.home);
  const awayStats = game.playerStats.filter(ps => statTeamId(ps, seasonKey) === game.away);

  function buildTable(statsArr) {
    if (!statsArr.length) return `<p class="empty-state">No stats recorded.</p>`;

    const totals = statsArr.reduce((acc, ps) => {
      acc.points   += ps.points   ?? 0;
      acc.rebounds += ps.rebounds ?? 0;
      acc.assists  += ps.assists  ?? 0;
      acc.blocks   += ps.blocks   ?? 0;
      acc.steals   += ps.steals   ?? 0;
      return acc;
    }, { points: 0, rebounds: 0, assists: 0, blocks: 0, steals: 0 });

    return `
      <table class="roster-table">
        <thead><tr><th>Player</th><th>PTS</th><th>REB</th><th>AST</th><th>BLK</th><th>STL</th></tr></thead>
        <tbody>
          ${statsArr.map(ps => {
      const p = getPlayer(ps.playerId);
      return `<tr>
              <td class="player-name">${p ? p.name : ps.playerId}</td>
              <td>${ps.points   ?? 0}</td>
              <td>${ps.rebounds ?? 0}</td>
              <td>${ps.assists  ?? 0}</td>
              <td>${ps.blocks   ?? 0}</td>
              <td>${ps.steals   ?? 0}</td>
            </tr>`;
    }).join("")}
        </tbody>
        <tfoot>
          <tr class="totals-row">
            <td class="player-name">Team Totals</td>
            <td>${totals.points}</td>
            <td>${totals.rebounds}</td>
            <td>${totals.assists}</td>
            <td>${totals.blocks}</td>
            <td>${totals.steals}</td>
          </tr>
        </tfoot>
      </table>`;
  }

  container.innerHTML = `
    <a href="${seasonHref("stats.html", seasonKey)}" class="back-link">← All Stats</a>
    <div class="box-score-header">
      <div class="bs-team ${homeWin ? "bs-winner" : ""}">
        <div class="bs-team-name">${teamLink(seasonKey, game.home)}</div>
        <div class="bs-score">${game.homeScore}</div>
      </div>
      <div class="bs-date">
        ${formatDate(game.date)}<br>
        <span style="font-size:11px;opacity:.7">${seasonKey} Season</span>
        ${game.youtubeUrl ? `<br><a href="${game.youtubeUrl}" target="_blank" rel="noopener noreferrer" class="yt-link">▶ Watch Game</a>` : ""}
      </div>
      <div class="bs-team ${!homeWin ? "bs-winner" : ""}">
        <div class="bs-team-name">${teamLink(seasonKey, game.away)}</div>
        <div class="bs-score">${game.awayScore}</div>
      </div>
    </div>
    <h3 class="box-team-label">${home?.name ?? game.home}</h3>
    ${buildTable(homeStats)}
    <h3 class="box-team-label">${away?.name ?? game.away}</h3>
    ${buildTable(awayStats)}
  `;
}

function renderStatsLeaders(seasonKey, container) {
  const allStats = deriveSeasonStats(seasonKey).filter(s => s.gamesPlayed > 0);
  const data     = getSeasonData(seasonKey);

  let html = "";

  if (allStats.length) {
    const byPPG = [...allStats].sort((a, b) => (b.totalPoints   / b.gamesPlayed) - (a.totalPoints   / a.gamesPlayed));
    const byRPG = [...allStats].sort((a, b) => (b.totalRebounds / b.gamesPlayed) - (a.totalRebounds / a.gamesPlayed));
    const byAPG = [...allStats].sort((a, b) => (b.totalAssists  / b.gamesPlayed) - (a.totalAssists  / a.gamesPlayed));
    const byBPG = [...allStats].sort((a, b) => (b.totalBlocks   / b.gamesPlayed) - (a.totalBlocks   / a.gamesPlayed));
    const bySPG = [...allStats].sort((a, b) => (b.totalSteals   / b.gamesPlayed) - (a.totalSteals   / a.gamesPlayed));

    function leaderTable(label, sorted, totalKey) {
      return `
        <div class="leaders-block">
          <h3 class="leaders-title">${label}</h3>
          <table class="roster-table">
            <thead><tr><th>Player</th><th>GP</th><th>${label}</th><th>Total</th></tr></thead>
            <tbody>
              ${sorted.slice(0, 5).map((s, i) => `
                <tr class="${i === 0 ? "leader-row" : ""}">
                  <td class="player-name">${s.name}</td>
                  <td>${s.gamesPlayed}</td>
                  <td>${avg(s[totalKey], s.gamesPlayed)}</td>
                  <td>${s[totalKey]}</td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>`;
    }

    // ── Season leaders ──
    html += `<div class="stats-section-heading">Season Leaders</div>`;
    html += `<div class="leaders-grid">`;
    html += leaderTable("PPG", byPPG, "totalPoints");
    html += leaderTable("RPG", byRPG, "totalRebounds");
    html += leaderTable("APG", byAPG, "totalAssists");
    html += leaderTable("BPG", byBPG, "totalBlocks");
    html += leaderTable("SPG", bySPG, "totalSteals");
    html += `</div>`;

    // ── Box scores ──
    if (data) {
      const playedGames = data.games.filter(isPlayed).sort((a, b) => new Date(b.date) - new Date(a.date));
      if (playedGames.length) {
        html += `<div class="stats-section-heading" style="margin-top:48px;">Box Scores</div>`;
        html += `<div class="leaders-grid"><div class="leaders-block full-width">
          <h3 class="leaders-title">${seasonKey} Season</h3>
          <div class="box-score-list">
            ${playedGames.map(g => {
          const home = getTeam(g.home, seasonKey);
          const away = getTeam(g.away, seasonKey);
          const homeWin = g.homeScore > g.awayScore;
          return `
                <a href="${seasonHref(`stats.html?game=${g.id}`, seasonKey)}" class="box-score-item">
                  <span class="bsi-date">${formatDate(g.date)}</span>
                  <span class="bsi-matchup">
                    <span class="${homeWin ? "bsi-winner" : ""}">${home?.name ?? g.home} ${g.homeScore}</span>
                    <span class="bsi-sep">–</span>
                    <span class="${!homeWin ? "bsi-winner" : ""}">${g.awayScore} ${away?.name ?? g.away}</span>
                  </span>
                  <span class="bsi-arrow">→</span>
                </a>`;
        }).join("")}
          </div>
        </div></div>`;
      }
    }

    // ── Full season stats table ──
    const allSorted = [...allStats].sort((a, b) => ppg(b) - ppg(a));
    html += `<div class="stats-section-heading" style="margin-top:48px;">Season Stats</div>`;
    html += `<div class="leaders-grid">
      <div class="leaders-block full-width">
        <h3 class="leaders-title">All Players — ${seasonKey} Season</h3>
        ${playerStatsTable(allSorted)}
      </div>
    </div>`;

  } else {
    html += getSeasonStatus(seasonKey) === "upcoming"
      ? `<p class="empty-state">No games played yet. The ${seasonKey} season hasn't started, so stats will appear after the first game.</p>`
      : `<p class="empty-state">No stats yet — check back after the first game!</p>`;
  }

  container.innerHTML = html;
}

// ─── Page: Team ───────────────────────────────────────────────────────────────

function ordinal(n) {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  return `${n}${{ 1: "st", 2: "nd", 3: "rd" }[n % 10] ?? "th"}`;
}

function formatDiff(n, decimals = 0) {
  const str = n.toFixed(decimals);
  return n > 0 ? `+${str}` : str;
}

// "Champions", "Lost in <round>" from the team's last playoff loss, or null without one
function teamPlayoffResult(data, teamId) {
  if (data.champion === teamId) return "Champions";
  const losses = (data.playoffs ?? [])
    .filter(g => isPlayed(g) && (g.home === teamId || g.away === teamId))
    .filter(g => (g.home === teamId) !== (g.homeScore > g.awayScore))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const lastLoss = losses[losses.length - 1];
  if (!lastLoss) return null;
  // "Semifinal - Contested" → "semifinal"; the Championship is the final
  const round = (lastLoss.round ?? "").split(" - ")[0].trim();
  if (!round) return "Lost in the playoffs";
  return `Lost in ${round === "Championship" ? "final" : round.toLowerCase()}`;
}

// Regular-season totals for the team and its opponents, attributing playerStats
// to a side with statTeamId()
function deriveTeamStats(seasonKey, team) {
  const data = getSeasonData(seasonKey);
  const keys = ["points", "rebounds", "assists", "blocks", "steals"];
  const zero = () => Object.fromEntries(keys.map(k => [k, 0]));
  const result = { gamesPlayed: 0, team: zero(), opp: zero() };

  data.games.filter(g => isPlayed(g) && (g.home === team.id || g.away === team.id)).forEach(g => {
    const opponentId = g.home === team.id ? g.away : g.home;
    result.gamesPlayed++;
    g.playerStats.forEach(ps => {
      const statTeam = statTeamId(ps, seasonKey);
      const side = statTeam === team.id ? result.team
        : statTeam === opponentId ? result.opp
        : null;
      if (side) keys.forEach(k => side[k] += ps[k] ?? 0);
    });
  });
  return result;
}

function teamStatsTable(stats) {
  const labels = { points: "Points", rebounds: "Rebounds", assists: "Assists", blocks: "Blocks", steals: "Steals" };
  const gp = stats.gamesPlayed;
  const diffCell = (n, decimals) =>
    `<td class="${n > 0 ? "pos-diff" : n < 0 ? "neg-diff" : ""}">${formatDiff(n, decimals)}</td>`;
  return `
    <table class="roster-table team-stats-table">
      <thead><tr><th>Stat</th><th>Per Game</th><th>Allowed Per Game</th><th>Diff Per Game</th><th>Total</th><th>Total Allowed</th><th>Diff</th></tr></thead>
      <tbody>
        ${Object.entries(labels).map(([k, label]) => `<tr>
          <td class="player-name">${label}</td>
          <td>${avg(stats.team[k], gp)}</td>
          <td>${avg(stats.opp[k], gp)}</td>
          ${diffCell(gp ? (stats.team[k] - stats.opp[k]) / gp : 0, 1)}
          <td>${stats.team[k]}</td>
          <td>${stats.opp[k]}</td>
          ${diffCell(stats.team[k] - stats.opp[k], 0)}
        </tr>`).join("")}
      </tbody>
    </table>`;
}

// Date, opponent, result and score from the team's side, home/away, plus box score and video links
function teamScheduleTable(seasonKey, team, games, showRound) {
  // Newest first; games without a date yet go on top
  const byDate = [...games].sort((a, b) => {
    if (!a.date || !b.date) return a.date ? 1 : b.date ? -1 : 0;
    return new Date(b.date) - new Date(a.date);
  });
  return `
    <table class="roster-table team-schedule-table">
      <thead><tr>${showRound ? "<th>Round</th>" : ""}<th>Date</th><th>Opponent</th><th>Result</th><th>H/A</th><th></th></tr></thead>
      <tbody>
        ${byDate.map(g => {
          const isHome   = g.home === team.id;
          const oppId    = isHome ? g.away : g.home;
          const played   = isPlayed(g);
          const teamPts  = isHome ? g.homeScore : g.awayScore;
          const oppPts   = isHome ? g.awayScore : g.homeScore;
          const won      = played && teamPts > oppPts;
          return `<tr>
            ${showRound ? `<td class="player-name">${g.round ?? ""}</td>` : ""}
            <td${showRound ? "" : ` class="player-name"`}>${formatDate(g.date)}</td>
            <td>${oppId ? teamLink(seasonKey, oppId) : "TBD"}</td>
            <td>${played
              ? `<span class="${won ? "result-win" : "result-loss"}">${won ? "W" : "L"}</span> ${teamPts}–${oppPts}`
              : "TBD"}</td>
            <td>${isHome ? "Home" : "Away"}</td>
            <td><div class="team-game-links">
              ${played ? `<a class="box-score-link" href="${seasonHref(`stats.html?game=${g.id}`, seasonKey)}">Box Score</a>` : ""}
              ${g.youtubeUrl ? `<a class="yt-link-inline" href="${g.youtubeUrl}" target="_blank" rel="noopener noreferrer">▶ Watch</a>` : ""}
            </div></td>
          </tr>`;
        }).join("")}
      </tbody>
    </table>`;
}

function renderTeamPage(seasonKey) {
  const container = document.getElementById("team-container");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  // getViewedSeason falls back to the current season, so check the link's own season
  const requestedSeason = params.get("season") ?? config.currentSeason;
  const data = seasons[requestedSeason] ? getSeasonData(requestedSeason) : null;
  const team = data ? getTeam(params.get("team"), requestedSeason) : null;

  if (!team) {
    document.title = "Team not found — BBBA";
    container.innerHTML = `
      <div class="page-hero">
        <h1 class="page-title">Team <span>Not Found</span></h1>
        <p class="page-subtitle">We couldn't find that team.</p>
      </div>
      <a href="${seasonHref("teams.html", seasonKey)}" class="back-link">← All Teams</a>`;
    return;
  }

  document.title = `${team.name} — BBBA`;

  const standings = deriveStandings(data);
  const position  = standings.findIndex(s => s.teamId === team.id);
  const record    = standings[position];
  const recordStr = record && record.wins + record.losses
    ? ` · ${record.wins}–${record.losses} · ${ordinal(position + 1)}`
    : "";
  const playoffResult = teamPlayoffResult(data, team.id);

  const involves     = g => g.home === team.id || g.away === team.id;
  const teamGames    = data.games.filter(involves);
  const teamPlayoffs = (data.playoffs ?? []).filter(involves);

  const allStats = deriveSeasonStats(seasonKey);
  const roster   = team.playerIds
    .map(id => allStats.find(s => s.playerId === id))
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));

  let html = `
    <a href="${seasonHref("teams.html", seasonKey)}" class="back-link">← All Teams</a>
    <div class="page-hero team-hero">
      <h1 class="page-title">${team.name}</h1>
      <p class="page-subtitle">${seasonKey} Season${recordStr}</p>
      ${playoffResult ? `<p class="team-playoff-result ${playoffResult === "Champions" ? "is-champion" : ""}">${playoffResult === "Champions" ? "🏆 " : ""}${playoffResult}</p>` : ""}
      <img
        src="assets/teams/${seasonKey}-${team.id}.jpeg"
        alt="${team.name}, ${seasonKey}"
        class="team-photo"
        onerror="this.remove()"
      />
    </div>`;

  html += `
    <div class="leaders-block team-section">
      <h3 class="leaders-title">Team Stats — Regular Season</h3>
      ${teamGames.some(isPlayed)
        ? `<div class="table-scroll">${teamStatsTable(deriveTeamStats(seasonKey, team))}</div>`
        : `<p class="empty-state">No games played yet.</p>`}
    </div>`;

  html += `
    <div class="leaders-block team-section">
      <h3 class="leaders-title">Roster Stats — Regular Season</h3>
      ${roster.length
        ? `<div class="table-scroll">${playerStatsTable(roster)}</div>`
        : `<p class="empty-state">Roster not yet finalized.</p>`}
    </div>`;

  if (teamPlayoffs.length) {
    html += `
      <div class="leaders-block team-section">
        <h3 class="leaders-title playoff-title">🏆 Playoffs</h3>
        <div class="table-scroll">${teamScheduleTable(seasonKey, team, teamPlayoffs, true)}</div>
      </div>`;
  }

  html += `
    <div class="leaders-block team-section">
      <h3 class="leaders-title">Regular Season</h3>
      ${teamGames.length
        ? `<div class="table-scroll">${teamScheduleTable(seasonKey, team, teamGames, false)}</div>`
        : `<p class="empty-state">The ${seasonKey} schedule is coming soon.</p>`}
    </div>`;

  container.innerHTML = html;
}

// ─── Page: Rules ──────────────────────────────────────────────────────────────

// Each season's rules live in js/data/rules-<season>.html; a season without
// a file shows a placeholder instead
async function renderRules(seasonKey) {
  const container = document.getElementById("rules-content");
  if (!container) return;

  // Ignore a slower fetch for a season the user has already switched away from
  container.dataset.season = seasonKey;
  let html = null;
  try {
    const res = await fetch(`${getBasePath()}data/rules-${seasonKey}.html`);
    if (res.ok) html = await res.text();
  } catch (e) {
    // Fall through to the placeholder
  }
  if (container.dataset.season !== seasonKey) return;

  container.innerHTML = html
    ?? `<p class="empty-state">The ${seasonKey} rules are coming soon.</p>`;
}

// ─── Page Dispatcher ──────────────────────────────────────────────────────────

function renderPage(seasonKey) {
  renderAbout(seasonKey);
  renderSchedule(seasonKey);
  renderStandings(seasonKey);
  renderTeams(seasonKey);
  renderStats(seasonKey);
  renderTeamPage(seasonKey);
  renderRules(seasonKey);
}

// ─── Season Script Loader ────────────────────────────────────────────────────

async function loadSeasonScripts() {
  const base = getBasePath();
  for (const season of config.seasons) {
    await new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = `${base}data/season-${season}.js`;
      script.onload = resolve;
      script.onerror = () => {
        console.warn(`BBBA: could not load season-${season}.js — skipping.`);
        resolve(); // resolve anyway so init continues
      };
      document.head.appendChild(script);
    });
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", async () => {
  // Dynamically load all season scripts from config.seasons, then partials
  await loadSeasonScripts();
  await loadPartials();

  // Highlight active nav link; a team page sits under Teams
  const page = currentPage() === "team.html" ? "teams.html" : currentPage();
  document.querySelectorAll(".nav-link").forEach(link => {
    const linkPage = link.getAttribute("href").split("?")[0].split("/").pop();
    if (linkPage === page) link.classList.add("active");
  });

  // Hamburger menu toggle
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const siteNav      = document.getElementById("site-nav");
  if (hamburgerBtn && siteNav) {
    hamburgerBtn.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("nav-open");
      hamburgerBtn.classList.toggle("is-active", isOpen);
      hamburgerBtn.setAttribute("aria-expanded", isOpen);
    });

    // Close menu when a nav link is tapped
    siteNav.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("nav-open");
        hamburgerBtn.classList.remove("is-active");
        hamburgerBtn.setAttribute("aria-expanded", false);
      });
    });

    // Close menu when tapping outside the header
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".site-header")) {
        siteNav.classList.remove("nav-open");
        hamburgerBtn.classList.remove("is-active");
        hamburgerBtn.setAttribute("aria-expanded", false);
      }
    });
  }

  // Season labels, footer switcher, past-season bar, links and page content
  applySeason(getViewedSeason());

  // Browser back/forward changes ?season= (and ?game=) without a reload
  window.addEventListener("popstate", () => applySeason(getViewedSeason()));
});
