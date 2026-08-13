 // Season 2026 — teams and games.
// - To finalize rosters, add player IDs to each team's playerIds array.
// - To add a new player to a team, add them to players.js first, then add their ID here.
// - To record a completed game, fill in: date, homeScore, awayScore, and playerStats.
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
  "2026": {
    teams: [
      {id: "cuties", name: "The Cuties", playerIds: ["shaw", "shak", "nafe", "zami", "salw", "shaf"]},
      {id: "iggy", name: "Team Igoudala", playerIds: ["zahi", "shan", "owas", "saze", "farh", "aref", "agho", "raje"]},
      {id: "sunrun", name: "SunRun, Inc.", playerIds: ["mash", "owal", "nibr", "rezw", "shad", "raki", "imra", "mehd"]},
      {id: "d", name: "Team Dchampions", playerIds: ["iram", "eric", "shih", "tays", "niha", "aroy", "tanb", "afif", "priy"]},
    ],
    games: [
      // --- Matchup cycle 1 ---
      {
        id: "2026-g1",
        date: "2026-07-22",
        home: "cuties", away: "iggy",
        youtubeUrl: "https://youtu.be/5NFWNMyrdN4",
        homeScore: 25, awayScore: 20,
        playerStats: [
          {playerId: "shan", points: 9, rebounds: 11, assists: 4, blocks: 1, steals: 0},
          {playerId: "zahi", points: 7, rebounds: 8, assists: 7, blocks: 1, steals: 5},
          {playerId: "owas", points: 0, rebounds: 2, assists: 1, blocks: 0, steals: 2},
          {playerId: "raje", points: 3, rebounds: 3, assists: 1, blocks: 0, steals: 1},
          {playerId: "aref", points: 1, rebounds: 1, assists: 0, blocks: 0, steals: 1},
          {playerId: "agho", points: 0, rebounds: 1, assists: 0, blocks: 0, steals: 0},
          
          {playerId: "shaw", points: 18, rebounds: 5, assists: 1, blocks: 1, steals: 1},
          {playerId: "shak", points: 5, rebounds: 7, assists: 1, blocks: 0, steals: 1},
          {playerId: "nafe", points: 1, rebounds: 2, assists: 1, blocks: 0, steals: 2},
          {playerId: "zami", points: 1, rebounds: 15, assists: 1, blocks: 0, steals: 2},
          {playerId: "salw", points: 0, rebounds: 0, assists: 2, blocks: 0, steals: 0},
          {playerId: "shaf", points: 0, rebounds: 5, assists: 0, blocks: 0, steals: 4},
        ]
      },
      {
        id: "2026-g2",
        date: "2026-07-22",
        home: "sunrun", away: "d",
        youtubeUrl: "https://youtu.be/Ou9aBING-xg",
        homeScore: 20, awayScore: 36,
        playerStats: [
          {playerId: "mehd", points: 7, rebounds: 6, assists: 1, blocks: 0, steals: 1},
          {playerId: "shad", points: 0, rebounds: 3, assists: 1, blocks: 0, steals: 0},
          {playerId: "nibr", points: 3, rebounds: 4, assists: 2, blocks: 0, steals: 1},
          {playerId: "imra", points: 2, rebounds: 6, assists: 2, blocks: 0, steals: 1},
          {playerId: "owal", points: 2, rebounds: 5, assists: 2, blocks: 0, steals: 0},
          {playerId: "raki", points: 6, rebounds: 5, assists: 3, blocks: 0, steals: 1},
         
          {playerId: "iram", points: 6, rebounds: 11, assists: 3, blocks: 0, steals: 4},
          {playerId: "shih", points: 1, rebounds: 3, assists: 1, blocks: 0, steals: 0},
          {playerId: "tays", points: 0, rebounds: 2, assists: 1, blocks: 0, steals: 1},
          {playerId: "niha", points: 1, rebounds: 4, assists: 0, blocks: 1, steals: 0},
          {playerId: "aroy", points: 7, rebounds: 5, assists: 13, blocks: 0, steals: 2},
          {playerId: "afif", points: 10, rebounds: 5, assists: 0, blocks: 0, steals: 1},
          {playerId: "eric", points: 7, rebounds: 9, assists: 1, blocks: 1, steals: 1},
          {playerId: "priy", points: 4, rebounds: 1, assists: 1, blocks: 0, steals: 0},
        ]
      },
      {
        id: "2026-g3",
        date: "2026-06-13",
        home: "cuties", away: "sunrun",
        homeScore: 17, awayScore: 15,
        youtubeUrl: "https://youtu.be/YMYgcMMAA_c",
        playerStats: [
          {playerId: "shaw", points: 13, rebounds: 10, assists: 0, blocks: 1, steals: 1},
          {playerId: "shak", points: 1, rebounds: 10, assists: 2, blocks: 0, steals: 1},
          {playerId: "nafe", points: 1, rebounds: 6, assists: 0, blocks: 0, steals: 1},
          {playerId: "zami", points: 0, rebounds: 18, assists: 3, blocks: 1, steals: 0},
          {playerId: "salw", points: 1, rebounds: 3, assists: 0, blocks: 0, steals: 0},
          {playerId: "shaf", points: 1, rebounds: 2, assists: 0, blocks: 1, steals: 2},
          {playerId: "mehd", points: 7, rebounds: 13, assists: 1, blocks: 1, steals: 3},
         
          {playerId: "mash", points: 3, rebounds: 13, assists: 2, blocks: 0, steals: 0},
          {playerId: "imra", points: 2, rebounds: 9, assists: 1, blocks: 0, steals: 0},
          {playerId: "shad", points: 1, rebounds: 3, assists: 1, blocks: 0, steals: 1},
          {playerId: "raki", points: 0, rebounds: 9, assists: 0, blocks: 0, steals: 1},
          {playerId: "nibr", points: 2, rebounds: 2, assists: 0, blocks: 0, steals: 1},
        ]
      },
      {
        id: "2026-g4",
        date: "2026-05-17",
        home: "iggy", away: "d",
        homeScore: 14, awayScore: 11,
        youtubeUrl: "https://youtu.be/4Y6FkNyRh5I",
        playerStats: [
          {playerId: "shan", points: 2, rebounds: 12, assists: 1, blocks: 0, steals: 0},
          {playerId: "zahi", points: 5, rebounds: 8, assists: 3, blocks: 0, steals: 4},
          {playerId: "owas", points: 3, rebounds: 0, assists: 0, blocks: 0, steals: 0},
          {playerId: "saze", points: 1, rebounds: 3, assists: 0, blocks: 0, steals: 0},
          {playerId: "farh", points: 0, rebounds: 9, assists: 2, blocks: 0, steals: 2},
          {playerId: "agho", points: 0, rebounds: 2, assists: 0, blocks: 0, steals: 1},
          {playerId: "raje", points: 3, rebounds: 7, assists: 0, blocks: 0, steals: 3},
         
          {playerId: "iram", points: 2, rebounds: 5, assists: 0, blocks: 3, steals: 3},
          {playerId: "shih", points: 0, rebounds: 3, assists: 0, blocks: 0, steals: 2},
          {playerId: "tays", points: 0, rebounds: 6, assists: 1, blocks: 1, steals: 1},
          {playerId: "niha", points: 0, rebounds: 7, assists: 0, blocks: 0, steals: 0},
          {playerId: "aroy", points: 4, rebounds: 9, assists: 1, blocks: 0, steals: 1},
          {playerId: "tanb", points: 0, rebounds: 1, assists: 0, blocks: 0, steals: 0},
          {playerId: "afif", points: 5, rebounds: 8, assists: 1, blocks: 0, steals: 0},
        ]
      },
      {
        id: "2026-g5",
        date: "2026-07-25",
        home: "cuties", away: "d",
        homeScore: 15, awayScore: 10,
        youtubeUrl: "https://youtu.be/CgI7zz1_1pM",
        playerStats: [
          {playerId: "shaw", points: 8, rebounds: 16, assists: 2, blocks: 1, steals: 4},
          {playerId: "shak", points: 3, rebounds: 3, assists: 0, blocks: 0, steals: 0},
          {playerId: "nafe", points: 0, rebounds: 7, assists: 2, blocks: 0, steals: 3},
          {playerId: "zami", points: 2, rebounds: 8, assists: 2, blocks: 1, steals: 1},
          {playerId: "salw", points: 2, rebounds: 3, assists: 0, blocks: 0, steals: 0},

          {playerId: "iram", points: 1, rebounds: 17, assists: 2, blocks: 1, steals: 1},
          {playerId: "shih", points: 4, rebounds: 0, assists: 0, blocks: 0, steals: 0},
          {playerId: "tays", points: 1, rebounds: 1, assists: 1, blocks: 0, steals: 0},
          {playerId: "niha", points: 0, rebounds: 1, assists: 0, blocks: 0, steals: 1},
          {playerId: "aroy", points: 1, rebounds: 5, assists: 4, blocks: 0, steals: 0},
          {playerId: "afif", points: 3, rebounds: 3, assists: 0, blocks: 0, steals: 1},
          {playerId: "priy", points: 0, rebounds: 4, assists: 0, blocks: 0, steals: 0},
        ]
      },
      {
        id: "2026-g6",
        date: "2026-07-12",
        home: "iggy", away: "sunrun",
        homeScore: 22, awayScore: 35,
        youtubeUrl: "https://youtu.be/eM0Sa4NaJ04",
        playerStats: [
          {playerId: "shan", points: 7, rebounds: 11, assists: 3, blocks: 0, steals: 1},
          {playerId: "zahi", points: 8, rebounds: 7, assists: 5, blocks: 0, steals: 2},
          {playerId: "owas", points: 5, rebounds: 2, assists: 0, blocks: 0, steals: 0},
          {playerId: "raje", points: 2, rebounds: 4, assists: 1, blocks: 0, steals: 1},
          {playerId: "aref", points: 0, rebounds: 1, assists: 0, blocks: 0, steals: 0},
          {playerId: "agho", points: 0, rebounds: 1, assists: 0, blocks: 0, steals: 1},
          {playerId: "saze", points: 0, rebounds: 7, assists: 1, blocks: 0, steals: 0},

          {playerId: "mash", points: 3, rebounds: 10, assists: 2, blocks: 2, steals: 1},
          {playerId: "mehd", points: 8, rebounds: 8, assists: 3, blocks: 3, steals: 3},
          {playerId: "rezw", points: 6, rebounds: 8, assists: 0, blocks: 0, steals: 2},
          {playerId: "shad", points: 2, rebounds: 7, assists: 3, blocks: 0, steals: 1},
          {playerId: "nibr", points: 5, rebounds: 5, assists: 4, blocks: 0, steals: 1},
          {playerId: "imra", points: 5, rebounds: 6, assists: 3, blocks: 0, steals: 1},
          {playerId: "owal", points: 6, rebounds: 4, assists: 2, blocks: 0, steals: 0},
        ]
      },
      // --- Matchup cycle 2 ---
      {
        id: "2026-g7",
        date: "2026-06-09",
        home: "iggy", away: "cuties",
        homeScore: 17, awayScore: 20,
        youtubeUrl: "https://youtu.be/QoZQ9gTL_4Q",
        playerStats: [
          {playerId: "shan", points: 5, rebounds: 14, assists: 4, blocks: 0, steals: 3},
          {playerId: "zahi", points: 10, rebounds: 5, assists: 4, blocks: 0, steals: 3},
          {playerId: "owas", points: 1, rebounds: 4, assists: 0, blocks: 0, steals: 0},
          {playerId: "raje", points: 1, rebounds: 2, assists: 1, blocks: 0, steals: 1},
          {playerId: "aref", points: 0, rebounds: 2, assists: 0, blocks: 0, steals: 0},
          {playerId: "farh", points: 0, rebounds: 7, assists: 0, blocks: 0, steals: 1},
          {playerId: "shaw", points: 8, rebounds: 10, assists: 3, blocks: 0, steals: 2},
          {playerId: "shak", points: 6, rebounds: 7, assists: 2, blocks: 0, steals: 1},
          {playerId: "nafe", points: 2, rebounds: 7, assists: 1, blocks: 0, steals: 2},
          {playerId: "zami", points: 1, rebounds: 12, assists: 5, blocks: 0, steals: 0},
          {playerId: "salw", points: 3, rebounds: 4, assists: 0, blocks: 1, steals: 0},
        ]
      },
      {
        id: "2026-g8",
        date: "2026-08-08",
        home: "d", away: "sunrun",
        homeScore: 21, awayScore: 18,
        youtubeUrl: "https://youtu.be/gxBYzFsJ8a0",
        playerStats: [
          {playerId: "mehd", points: 8, rebounds: 8, assists: 2, blocks: 1, steals: 2},
          {playerId: "mash", points: 4, rebounds: 10, assists: 1, blocks: 0, steals: 0},
          {playerId: "rezw", points: 1, rebounds: 11, assists: 0, blocks: 0, steals: 0},
          {playerId: "nibr", points: 4, rebounds: 6, assists: 1, blocks: 0, steals: 1},
          {playerId: "raki", points: 1, rebounds: 8, assists: 2, blocks: 0, steals: 1},

          {playerId: "iram", points: 2, rebounds: 19, assists: 2, blocks: 0, steals: 0},
          {playerId: "shih", points: 2, rebounds: 2, assists: 0, blocks: 0, steals: 0},
          {playerId: "tays", points: 0, rebounds: 3, assists: 0, blocks: 0, steals: 0},
          {playerId: "niha", points: 0, rebounds: 4, assists: 0, blocks: 0, steals: 0},
          {playerId: "aroy", points: 2, rebounds: 5, assists: 5, blocks: 0, steals: 1},
          {playerId: "afif", points: 5, rebounds: 4, assists: 2, blocks: 0, steals: 0},
          {playerId: "priy", points: 10, rebounds: 5, assists: 1, blocks: 0, steals: 1},
        ]
      },
      {
        id: "2026-g9",
        date: "2026-07-15",
        home: "sunrun", away: "cuties",
        homeScore: 21, awayScore: 18,
        youtubeUrl: "https://youtu.be/E7BB5useJak",
        playerStats: [
          {playerId: "shaw", points: 9, rebounds: 6, assists: 1, blocks: 5, steals: 1},
          {playerId: "shak", points: 3, rebounds: 4, assists: 5, blocks: 0, steals: 1},
          {playerId: "nafe", points: 1, rebounds: 2, assists: 0, blocks: 1, steals: 2},
          {playerId: "zami", points: 4, rebounds: 8, assists: 2, blocks: 1, steals: 3},
          {playerId: "salw", points: 1, rebounds: 2, assists: 1, blocks: 0, steals: 1},
          {playerId: "shaf", points: 0, rebounds: 0, assists: 0, blocks: 0, steals: 0},
                   
          {playerId: "mash", points: 2, rebounds: 8, assists: 3, blocks: 0, steals: 3},
          {playerId: "mehd", points: 5, rebounds: 2, assists: 2, blocks: 0, steals: 2},
          {playerId: "rezw", points: 6, rebounds: 9, assists: 0, blocks: 1, steals: 1},
          {playerId: "nibr", points: 5, rebounds: 2, assists: 2, blocks: 0, steals: 0},
          {playerId: "imra", points: 0, rebounds: 6, assists: 1, blocks: 0, steals: 0},
          {playerId: "owal", points: 3, rebounds: 2, assists: 2, blocks: 0, steals: 0},
          {playerId: "raki", points: 0, rebounds: 2, assists: 2, blocks: 0, steals: 4},
        ]
      },
      {
        id: "2026-g10",
        date: "2026-08-11",
        home: "d", away: "iggy",
        homeScore: null, awayScore: null,
        playerStats: []
      },
      {
        id: "2026-g11",
        date: "2026-08-15",
        home: "d", away: "cuties",
        homeScore: null, awayScore: null,
        playerStats: []
      },
      {
        id: "2026-g12",
        date: "2026-08-15",
        home: "sunrun", away: "iggy",
        homeScore: null, awayScore: null,
        playerStats: []
      },
    ]
  }
};
