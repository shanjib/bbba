const config = {
  league: {
    name: "Boston Bengali Basketball Association",
    abbr: "BBBA",
    tagline: "Hoops, Heart & Heritage",
    about: "The Boston Bengali Basketball Association (BBBA) is a community basketball league founded by and for the Bengali community of Boston. We bring together players of all skill levels for a season of competitive but friendly basketball. Whether you're a seasoned baller or just getting back on the court, BBBA is about community, competition, and having a great time.",
    // League-wide social accounts, shown in the footer and as "Follow BBBA" on Home
    // (both hidden while the list is empty). handle is optional. Instagram, YouTube,
    // TikTok, Facebook and X/Twitter get an icon; any other platform shows as text.
    // Example: { platform: "Instagram", url: "https://instagram.com/bbba", handle: "@bbba" }
    social: [
      { platform: "YouTube", url: "https://www.youtube.com/@bbba-film", handle: "@bbba-film"}
    ]
  },
  currentSeason: "2027",
  // Season files (js/data/season-YYYY.js) load automatically from this list via
  // loadSeasonScripts() in app.js; no script tag is needed in the HTML files.
  seasons: ["2026", "2027"]
};
