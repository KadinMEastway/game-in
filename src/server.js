const express = require('express');
const fs = require("fs");
const app = express();
const port = 3000;
const fileDirectory = `${__dirname}/../data`;

function addGameToList(listName, game, res) {
	fs.readFile(`${fileDirectory}/${listName}-games.json`, 'utf8', (err, games) => {
		const list = JSON.parse(games);
		if(game.trim() !== "") {
			list.push(game.trim());
			fs.writeFile(`${fileDirectory}/${listName}-games.json`, JSON.stringify(list), err => {
				if(err) { console.error(err); }
				console.log('Game list updated: \n' + list);
			});
		} else {
			console.error('ERROR: invalid game name\n');
		}
		res.json(list);
	});
}

function deleteGameFromList(listName, index, res) {
	fs.readFile(`${fileDirectory}/${listName}-games.json`, 'utf8', (err, games) => {
		const list = JSON.parse(games);
		list.splice(index, 1);
		fs.writeFile(`${fileDirectory}/${listName}-games.json`, JSON.stringify(list), err => {
			if(err) { console.error(err); }
			console.log('Game list updated: \n' + list);
		});
		res.json(list);
	});
}

app.use((request, response, next) => {
	response.header('Access-Control-Allow-Origin', '*');
	response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	response.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
	next();
});
app.use(express.json());
app.use(express.text());

app.get('/played-games', (request, response) => {
	fs.readFile(`${fileDirectory}/played-games.json`, 'utf8', (err, playedGames) => {
		response.send(playedGames);
	});
});

app.get('/unplayed-games', (request, response) => {
	fs.readFile(`${fileDirectory}/unplayed-games.json`, 'utf8', (err, unplayedGames) => {
		response.send(unplayedGames);
	});
});

app.post('/add-played-game', (request, response) => {
	addGameToList('played', request.body, response);
});

app.post('/add-unplayed-game', (request, response) => {
	addGameToList('unplayed', request.body, response);
});

app.delete('/delete-played-game', (request, response) => {
	deleteGameFromList('played', parseInt(request.body), response);
});

app.delete('/delete-unplayed-game', (request, response) => {
	deleteGameFromList('unplayed', parseInt(request.body), response);
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
