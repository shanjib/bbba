 // Season 2026 — teams and games.
// - To finalize rosters, add player IDs to each team's playerIds array.
// - To add a new player to a team, add them to players.js first, then add their ID here.
// - To record a completed game, fill in: date, homeScore, awayScore, and playerStats.
//
// playerStats example:
//   { playerId: "p1", points: 14, rebounds: 5, assists: 3, blocks: 1, steals: 2 }
//
// Scoring is 1s and 2s:
//   1 point = inside the arc, 2 points = beyond the arc

// seasons is declared as a var so each season file can safely spread the previous state
// regardless of load order. Never rename this variable.
var seasons = {
  ...(typeof seasons !== "undefined" ? seasons : {}),
  "2026": {
    teams: [
      {id: "team-a", name: "The Cuties", playerIds: ["p2", "p12", "p7", "p21", "p19", "p24"]},
      {id: "team-b", name: "Team Igoudala", playerIds: ["p8", "p1", "p13", "p16", "p17", "p4", "p26", "p27"]},
      {id: "team-c", name: "SunRun, Inc.", playerIds: ["p3", "p14", "p20", "p11", "p10", "p23", "p28", "p29"]},
      {id: "team-d", name: "Team Dchampions", playerIds: ["p6", "p18", "p9", "p15", "p5", "p22", "p25", "p30"]},
    ],
    games: [
      // --- Matchup cycle 1 ---
      {
        id: "2026-g1",
        date: "2026-07-22",
        home: "team-a", away: "team-b",
        youtubeUrl: "https://youtu.be/C8A8eR95I3M",
        homeScore: 25, awayScore: 20,
        playerStats: []
      },
      {
        id: "2026-g2",
        date: "2026-07-22",
        home: "team-c", away: "team-d",
        youtubeUrl: "https://youtu.be/QPC06scQ2j4",
        homeScore: 20, awayScore: 36,
        playerStats: []
      },
      {
        id: "2026-g3",
        date: "2026-06-13",
        home: "team-a", away: "team-c",
        homeScore: 17, awayScore: 15,
        youtubeUrl: "https://youtu.be/YMYgcMMAA_c",
        playerStats: [
          {playerId: "p2", points: 13, rebounds: 10, assists: 0, blocks: 1, steals: 1},
          {playerId: "p12", points: 1, rebounds: 10, assists: 2, blocks: 0, steals: 1},
          {playerId: "p7", points: 1, rebounds: 6, assists: 0, blocks: 0, steals: 1},
          {playerId: "p21", points: 0, rebounds: 18, assists: 3, blocks: 1, steals: 0},
          {playerId: "p19", points: 1, rebounds: 3, assists: 0, blocks: 0, steals: 0},
          {playerId: "p24", points: 1, rebounds: 2, assists: 0, blocks: 1, steals: 2},
          {playerId: "p29", points: 7, rebounds: 13, assists: 1, blocks: 1, steals: 3},
          {playerId: "p3", points: 3, rebounds: 13, assists: 2, blocks: 0, steals: 0},
          {playerId: "p28", points: 2, rebounds: 9, assists: 1, blocks: 0, steals: 0},
          {playerId: "p10", points: 1, rebounds: 3, assists: 1, blocks: 0, steals: 1},
          {playerId: "p23", points: 0, rebounds: 9, assists: 0, blocks: 0, steals: 1},
          {playerId: "p20", points: 2, rebounds: 2, assists: 0, blocks: 0, steals: 1},
        ]
      },
      {
        id: "2026-g4",
        date: "2026-05-17",
        home: "team-b", away: "team-d",
        homeScore: 14, awayScore: 11,
        youtubeUrl: "https://youtu.be/4Y6FkNyRh5I",
        playerStats: [
          {playerId: "p1", points: 2, rebounds: 12, assists: 1, blocks: 0, steals: 0},
          {playerId: "p8", points: 5, rebounds: 8, assists: 3, blocks: 0, steals: 4},
          {playerId: "p13", points: 3, rebounds: 0, assists: 0, blocks: 0, steals: 0},
          {playerId: "p16", points: 1, rebounds: 3, assists: 0, blocks: 0, steals: 0},
          {playerId: "p17", points: 0, rebounds: 9, assists: 2, blocks: 0, steals: 2},
          {playerId: "p26", points: 0, rebounds: 2, assists: 0, blocks: 0, steals: 1},
          {playerId: "p27", points: 3, rebounds: 7, assists: 0, blocks: 0, steals: 3},
          {playerId: "p6", points: 2, rebounds: 5, assists: 0, blocks: 3, steals: 3},
          {playerId: "p9", points: 0, rebounds: 3, assists: 0, blocks: 0, steals: 2},
          {playerId: "p15", points: 0, rebounds: 6, assists: 1, blocks: 1, steals: 1},
          {playerId: "p5", points: 0, rebounds: 7, assists: 0, blocks: 0, steals: 0},
          {playerId: "p22", points: 4, rebounds: 9, assists: 1, blocks: 0, steals: 1},
          {playerId: "p25", points: 0, rebounds: 1, assists: 0, blocks: 0, steals: 0},
          {playerId: "p30", points: 5, rebounds: 8, assists: 1, blocks: 0, steals: 0},
        ]
      },
      {
        id: "2026-g5",
        date: "2026-07-25",
        home: "team-a", away: "team-d",
        homeScore: null, awayScore: null,
        playerStats: []
      },
      {
        id: "2026-g6",
        date: "2026-07-12",
        home: "team-b", away: "team-c",
        homeScore: 22, awayScore: 35,
        youtubeUrl: "https://youtu.be/eM0Sa4NaJ04",
        playerStats: [
          {playerId: "p1", points: 7, rebounds: 11, assists: 3, blocks: 0, steals: 1},
          {playerId: "p8", points: 8, rebounds: 7, assists: 5, blocks: 0, steals: 2},
          {playerId: "p13", points: 5, rebounds: 2, assists: 0, blocks: 0, steals: 0},
          {playerId: "p27", points: 2, rebounds: 4, assists: 1, blocks: 0, steals: 1},
          {playerId: "p4", points: 0, rebounds: 1, assists: 0, blocks: 0, steals: 0},
          {playerId: "p26", points: 0, rebounds: 1, assists: 0, blocks: 0, steals: 1},
          {playerId: "p16", points: 0, rebounds: 7, assists: 1, blocks: 0, steals: 0},

          {playerId: "p3", points: 3, rebounds: 10, assists: 2, blocks: 2, steals: 1},
          {playerId: "p29", points: 8, rebounds: 8, assists: 3, blocks: 3, steals: 3},
          {playerId: "p11", points: 6, rebounds: 8, assists: 0, blocks: 0, steals: 2},
          {playerId: "p10", points: 2, rebounds: 7, assists: 3, blocks: 0, steals: 1},
          {playerId: "p20", points: 5, rebounds: 5, assists: 4, blocks: 0, steals: 1},
          {playerId: "p28", points: 5, rebounds: 6, assists: 3, blocks: 0, steals: 1},
          {playerId: "p14", points: 6, rebounds: 4, assists: 2, blocks: 0, steals: 0},
        ]
      },
      // --- Matchup cycle 2 ---
      {
        id: "2026-g7",
        date: "2026-06-09",
        home: "team-b", away: "team-a",
        homeScore: 17, awayScore: 20,
        youtubeUrl: "https://youtu.be/QoZQ9gTL_4Q",
        playerStats: [
          {playerId: "p1", points: 5, rebounds: 14, assists: 4, blocks: 0, steals: 3},
          {playerId: "p8", points: 10, rebounds: 5, assists: 4, blocks: 0, steals: 3},
          {playerId: "p13", points: 1, rebounds: 4, assists: 0, blocks: 0, steals: 0},
          {playerId: "p27", points: 1, rebounds: 2, assists: 1, blocks: 0, steals: 1},
          {playerId: "p4", points: 0, rebounds: 2, assists: 0, blocks: 0, steals: 0},
          {playerId: "p17", points: 0, rebounds: 7, assists: 0, blocks: 0, steals: 1},
          {playerId: "p2", points: 8, rebounds: 10, assists: 3, blocks: 0, steals: 2},
          {playerId: "p12", points: 6, rebounds: 7, assists: 2, blocks: 0, steals: 1},
          {playerId: "p7", points: 2, rebounds: 7, assists: 1, blocks: 0, steals: 2},
          {playerId: "p21", points: 1, rebounds: 12, assists: 5, blocks: 0, steals: 0},
          {playerId: "p19", points: 3, rebounds: 4, assists: 0, blocks: 1, steals: 0},
        ]
      },
      {
        id: "2026-g8",
        date: "2026-08-08",
        home: "team-d", away: "team-c",
        homeScore: null, awayScore: null,
        playerStats: []
      },
      {
        id: "2026-g9",
        date: "2026-07-15",
        home: "team-c", away: "team-a",
        homeScore: 21, awayScore: 18,
        youtubeUrl: "https://youtu.be/E7BB5useJak",
        playerStats: [
          {playerId: "p2", points: 9, rebounds: 6, assists: 1, blocks: 5, steals: 1},
          {playerId: "p12", points: 3, rebounds: 4, assists: 5, blocks: 0, steals: 1},
          {playerId: "p7", points: 1, rebounds: 2, assists: 0, blocks: 1, steals: 2},
          {playerId: "p21", points: 4, rebounds: 8, assists: 2, blocks: 1, steals: 3},
          {playerId: "p19", points: 1, rebounds: 2, assists: 1, blocks: 0, steals: 1},
          {playerId: "p24", points: 0, rebounds: 0, assists: 0, blocks: 0, steals: 0},
                   
          {playerId: "p3", points: 2, rebounds: 8, assists: 3, blocks: 0, steals: 3},
          {playerId: "p29", points: 5, rebounds: 2, assists: 2, blocks: 0, steals: 2},
          {playerId: "p11", points: 6, rebounds: 9, assists: 0, blocks: 1, steals: 1},
          {playerId: "p20", points: 5, rebounds: 2, assists: 2, blocks: 0, steals: 0},
          {playerId: "p28", points: 0, rebounds: 6, assists: 1, blocks: 0, steals: 0},
          {playerId: "p14", points: 3, rebounds: 2, assists: 2, blocks: 0, steals: 0},
          {playerId: "p23", points: 0, rebounds: 2, assists: 2, blocks: 0, steals: 4},
        ]
      },
      {
        id: "2026-g10",
        date: null,
        home: "team-d", away: "team-b",
        homeScore: null, awayScore: null,
        playerStats: []
      },
      {
        id: "2026-g11",
        date: "2026-08-15",
        home: "team-d", away: "team-a",
        homeScore: null, awayScore: null,
        playerStats: []
      },
      {
        id: "2026-g12",
        date: "2026-08-15",
        home: "team-c", away: "team-b",
        homeScore: null, awayScore: null,
        playerStats: []
      },
    ]
  }
};
