const express = require("express");
const { getWeek } = require("./week");
const { getPlayers } = require("./scraping");
const app = express();

const PORT = process.env.PORT || 4000;

app.get("/week", (req, res) => {
  getWeek(res);
});

app.get("/players", (req, res) => {
  getPlayers(res);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
