const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()
const dbPath = path.join(__dirname, 'cricketTeam.db')
let db = null

app.use(express.json())

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server is running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error : ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

app.get('/players/', async (request, response) => {
  const getPlayersQuery = `
    SELECT * FROM cricket_team`
  const playersArray = await db.all(getPlayersQuery)
  response.send(playersArray)
})

//Add player
app.post('/players/:playerId/', async (request, response) => {
  const playerDetails = request.body
  const addPlayerQuery = `
    INSERT INTO 
      cricket_team(player_id,player_name,jersey_number,role)
    VALUES (${playerId},"${playerName}",${jerseyNumber},"${role}");`
  const dbResponse = await db.run(addPlayerQuery)
  const playerId = dbResponse.lastID
  response.send({playerId: playerId})
})
