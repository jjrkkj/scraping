const express = require("express");
const { getWeek } = require("./week");
const { getPlayers } = require("./scraping");
const app = express();

const PORT = process.env.PORT || 4000;

app.get("/week", (req, res) => {
  getWeek(req, res);
});

app.get("/players", (req, res) => {
  getPlayers(req, res);
});

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

server.timeout = 1000000;