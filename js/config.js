const config = {
  league: {
    name: "Boston Bengali Basketball Association",
    abbr: "BBBA",
    tagline: "Hoops, Heart & Heritage",
    about: "The Boston Bengali Basketball Association (BBBA) is a community basketball league founded by and for the Bengali community of Boston. We bring together players of all skill levels for a season of competitive but friendly basketball. Whether you're a seasoned baller or just getting back on the court, BBBA is about community, competition, and having a great time.",
    social: []  // league-wide social accounts; used in a later update
  },
  currentSeason: "2026",
  // Season files (js/data/season-YYYY.js) load automatically from this list via
  // loadSeasonScripts() in app.js; no script tag is needed in the HTML files.
  seasons: ["2026", "2027"]
};
