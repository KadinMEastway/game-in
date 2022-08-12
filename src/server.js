const express = require('express'); //requires the server to use express
const fs = require("fs"); //requires the server to use node.js filesystem
const app = express(); //express is a framework that lets you use HTTP methods
const port = 3000; //port number is often used to help computers distinguish how to use the data that is transferred
const fileDirectory = `${__dirname}/../data`; //shortened path

function addOrRemoveGame(id, requestData, response) {
	fs.readFile(`${fileDirectory}/lists.json`, 'utf8', (err, lists) => { //grabs the JSON file
		lists = JSON.parse(lists); //parsing(converting) JSON file to JavaScript object
		const gameList = lists.find((list) => {return list.id === id}).items;
		if(requestData === "") {
			console.error('ERROR: invalid game name\n'); //displays error if requestData is empty string
		} else {
			if(typeof requestData === "number") { //checks if it needs to add or remove a game based on if the requestData is a number or string
				gameList.splice(requestData, 1); //splices (removes) the game at index 'requestData' from the list object
			} else {
				gameList.push(requestData.trim()); //trims whitespace off game beginning and end, then pushes(adds) it to the end of the list object
			}
			fs.writeFile(`${fileDirectory}/lists.json`, JSON.stringify(lists), err => { //overwrites list JSON file with updated list object
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
app.use(express.static('src/public')); //allows users to access served static files in 'public' repository
app.use(express.json()); //allows backend to send or recieve either JSON or plain text
app.use(express.text());

app.get('/get-games/:listId', (request, response) => { //uses GET method to retrieve played games list and send it to front end
	fs.readFile(`${fileDirectory}/lists.json`, 'utf8', (err, lists) => {
		const gameList = JSON.parse(lists).find((list) => {return list.id === request.params.listId;});
		response.send(gameList.items);
	});
});

app.post('/post-games/:listId', (request, response) => { //uses POST method to retrieve games list, add an item to it, and send it to front end
	addOrRemoveGame(request.params.listId, request.body, response);
});

app.delete('/delete-games/:listId', (request, response) => { //uses DELETE method to retrieve games list, remove an item from it, and send it to front end
	addOrRemoveGame(request.params.listId, parseInt(request.body), response);
});

app.listen(port, () => { //sets server up to listen at port 'port' (3000) and log its process
	console.log(`Example app listening at http://localhost:${port}`);
});
