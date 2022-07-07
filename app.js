const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

const databasePath = path.join(__dirname, "cricketTeam.db");
let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http:localhost:3000/");
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

//API 1
app.get("/players/", async (request, response) => {
  const getPlayerQuery = `
    SELECT *
    FROM cricket_team;
    `;
  const players = await database.all(getPlayerQuery);
  response.send(players);
});

//API 2
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  //console.log(playerDetails);
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
  INSERT INTO 
  cricket_team (player_name, jersey_number, role)
  VALUES (${playerName}, ${jerseyNumber}, ${role};
    `;
  const addPlayer = await database.run(addPlayerQuery);
  response.send("Player Added to Team");
});

//API 3
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayer = `
    SELECT *
    FROM cricket_team
    WHERE player_id = ${playerId};
    `;
  const player = await database.get(getPlayer);
  response.send(player);
});

//API 4
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;
  const updatePlayerQuery = `
    UPDATE cricket_team
    SET 
        player_name = ${playerName},
        jersey_number = ${jerseyNumber},
        role = ${role};
    WHERE player_id = ${playerId}
    `;
  await database.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

//API 5
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM cricket_team
    WHERE player_id = ${playerId};
    `;
  await database.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
