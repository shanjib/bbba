// Season 2027 — teams and games.
// - To finalize rosters, add player IDs to each team's playerIds array.
// - To add a new player to a team, add them to players.js first, then add their ID here.
// - To record a completed game, fill in: date, homeScore, awayScore, and playerStats.
// - status: "upcoming" before the first game, "in-progress" once play starts, "complete" after the final.
//
// playerStats example:
//   { playerId: "shan", points: 14, rebounds: 5, assists: 3, blocks: 1, steals: 2 }
//
// Scoring is 1s and 2s:
//   1 point = inside the arc, 2 points = beyond the arc

// seasons is declared as a var so each season file can safely spread the previous state
// regardless of load order. Never rename this variable.
var seasons = {
  ...(typeof seasons !== "undefined" ? seasons : {}),
  "2027": {
    status: "upcoming",
    about: "TODO: 2027 about blurb",
    teams: [],
    games: [],
    playoffs: [],
  }
};
