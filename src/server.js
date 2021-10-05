const { POINT_CONVERSION_COMPRESSED } = require('constants');
const express = require('express');
const app = express();
const port = 3000;
const fs = require("fs");

function addGameToList(listName, req, res) {
	fs.readFile(`/Users/keastway/Sites/game-in/data/${listName}-games.json`, 'utf8', (err, games) => {
		const list = JSON.parse(games);
		list.push(req.body);
		fs.writeFile(`/Users/keastway/Sites/game-in/data/${listName}-games.json`, JSON.stringify(list), err => {
			if(err) { console.error(err); }
			console.log('Game list updated: \n' + list);
		});
		res.json(list);
	});
}

app.use((request, response, next) => {
	response.header('Access-Control-Allow-Origin', '*');
	response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	next();
});
app.use(express.json());
app.use(express.text());

app.get('/played-games', (request, response) => {
	fs.readFile('/Users/keastway/Sites/game-in/data/played-games.json', 'utf8', (err, playedGames) => {
		response.send(playedGames);
	});
});

app.get('/unplayed-games', (request, response) => {
	fs.readFile('/Users/keastway/Sites/game-in/data/unplayed-games.json', 'utf8', (err, unplayedGames) => {
		response.send(unplayedGames);
	});
});

app.post('/add-played-game', (request, response) => {
	addGameToList('played', request, response);
});

app.post('/add-unplayed-game', (request, response) => {
	addGameToList('unplayed', request, response);
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
