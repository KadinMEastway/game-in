const express = require('express'); //requires the server to use express
const fs = require("fs"); //requires the server to use node.js filesystem
const app = express(); //express is a framework that lets you use HTTP methods
const port = 3000; //port number is often used to help computers distinguish how to use the data that is transferred
const fileDirectory = `${__dirname}/../data`; //shortened path

function addGameToList(listName, game, response) { //
	fs.readFile(`${fileDirectory}/${listName}-games.json`, 'utf8', (err, games) => { //grabs the JSON file
		const list = JSON.parse(games); //parsing(converting) JSON file to JavaScript object
		if(game.trim() !== "") { //making sure the name inputted isn't an empty string
			list.push(game.trim()); //trims whitespace off name beginning and end, then pushes(adds) it to the end of the list object
			fs.writeFile(`${fileDirectory}/${listName}-games.json`, JSON.stringify(list), err => { //converts list object back to JSON and updates list JSON file
				if(err) { console.error(err); } //displays error message if needed
				console.log('Game list updated: \n' + list); //displays updated game list if successfull
			});
		} else {
			console.error('ERROR: invalid game name\n'); //displays error if game name is empty string
		}
		response.json(list);
	});
}

function deleteGameFromList(listName, index, response) {
	fs.readFile(`${fileDirectory}/${listName}-games.json`, 'utf8', (err, games) => {
		const list = JSON.parse(games);
		list.splice(index, 1);
		fs.writeFile(`${fileDirectory}/${listName}-games.json`, JSON.stringify(list), err => {
			if(err) { console.error(err); }
			console.log('Game list updated: \n' + list);
		});
		response.json(list);
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
