const express = require('express'); //requires the server to use express
const fs = require("fs"); //requires the server to use node.js filesystem
const app = express(); //express is a framework that lets you use HTTP methods
const port = 3000; //port number is often used to help computers distinguish how to use the data that is transferred
const fileDirectory = `${__dirname}/../data`; //shortened path

function addOrRemoveGame(list, requestData, response) {
	fs.readFile(`${fileDirectory}/${list}-games.json`, 'utf8', (err, games) => { //grabs the JSON file
		const gameList = JSON.parse(games); //parsing(converting) JSON file to JavaScript object
		if(requestData === "") {
			console.error('ERROR: invalid game name\n'); //displays error if requestData is empty string
		} else {
			if(typeof requestData === "number") { //checks if it needs to add or remove a game based on if the requestData is a number or string
				gameList.splice(requestData, 1); //splices (removes) the game at index 'requestData' from the list object
			} else {
				gameList.push(requestData.trim()); //trims whitespace off game beginning and end, then pushes(adds) it to the end of the list object
			}
			fs.writeFile(`${fileDirectory}/${list}-games.json`, JSON.stringify(gameList), err => { //overwrites list JSON file with updated list object
				if(err) { console.error(err); } //displays error message if needed
				console.log('Game list updated: \n' + gameList); //displays updated list object
			});
		}
		response.json(gameList); //returns list object
	});
}

app.use((request, response, next) => { //adding headers to allow front end to connect to back end
	response.header('Access-Control-Allow-Origin', '*');
	response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	response.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
	next();
});
app.use(express.json()); //allows backend to send or recieve either JSON or plain text
app.use(express.text());

app.get('/get-played-games', (request, response) => { //uses GET method to retrieve played games list and send it to front end
	fs.readFile(`${fileDirectory}/played-games.json`, 'utf8', (err, playedGames) => {
		response.send(playedGames);
	});
});

app.get('/get-unplayed-games', (request, response) => { //same as above, only with unplayed games list
	fs.readFile(`${fileDirectory}/unplayed-games.json`, 'utf8', (err, unplayedGames) => {
		response.send(unplayedGames);
	});
});

app.post('/post-played-games', (request, response) => { //uses POST method to retrieve played games list, add an item to it, and send it to front end
	addOrRemoveGame('played', request.body, response);
});

app.post('/post-unplayed-games', (request, response) => { //same as above, only with unplayed games list
	addOrRemoveGame('unplayed', request.body, response);
});

app.delete('/delete-played-games', (request, response) => { //uses DELETE method to retrieve played games list, remove an item from it, and send it to front end
	addOrRemoveGame('played', parseInt(request.body), response);
});

app.delete('/delete-unplayed-games', (request, response) => { //same as above, only with unplayed games list
	addOrRemoveGame('unplayed', parseInt(request.body), response);
});

app.listen(port, () => { //sets server up to listen at port 'port' (3000) and log its process
	console.log(`Example app listening at http://localhost:${port}`);
});
