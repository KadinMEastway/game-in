const environment = { //sets up variable with api url and port for fetch function to hit
	urls: {
		api: "http://localhost:3000"
	}
};

async function addOrRemoveGame(list, action, requestData) {
	let newList = []; //declares and initializes array for updated list to be stored in
	if (action === 'add') {
		requestData = prompt("Enter the name of the game you would like to add"); //requests a game title input from the user
		newList = await improvedFetch(list, 'POST', requestData);
	} else if(action === 'remove') {
		newList = await improvedFetch(list, 'DELETE', requestData);
	}
	const listElement = document.getElementById(`${list}-list`);
	listElement.innerHTML = '';
	updateGameList(list, newList);
}

function displayTime() { //calculates the time and updates the HTML time element to reflect this
	const d = new Date(); //creates new Date object 'd'
	const hours = (d.getHours() % 12 === 0) ? 12 : d.getHours() % 12;
	const minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
	const seconds = (d.getSeconds() < 10) ? "0" + d.getSeconds() : d.getSeconds();
	document.getElementById("currentTime").innerHTML = hours + ":" + minutes + ":" + seconds;
}

async function improvedFetch(list, method = 'GET', requestData) { //uses GET, POST, or DELETE HTTP methods to fetch based on the given input
	const api = `${method.toLowerCase()}-${list}-games`
	const response = await fetch(`${environment.urls.api}/${api}`, { //fetches using api variable set up earlier
		body: requestData,
		headers: { 'Content-Type': 'text/plain' },
		method: method
	});
	return response.json(); //returns the response from the fetch (which should be a list object)
}

function updateGameList(list, listData, gameIndex = 0) { //updates HTML unordered list using given list object
	const listElement = document.getElementById(`${list}-list`);
	if(typeof listData !== "string") { //checks to make sure it is a list and not a single string
		for(let i = 0; i < listData.length; i++) {
			updateGameList(list, listData[ i ], i); //recursively calls itself to add each game(string) to the HTML list
		}
		return;
	}
	const listItem = document.createElement("li");
	const deleteButton = document.createElement("button"); 
	deleteButton.setAttribute("class", "deleteButton"); //adds class for styling purposes
	deleteButton.innerText = "-"; //adds minus symbol to delete button
	deleteButton.addEventListener('click', async () => { await addOrRemoveGame(list, 'remove', gameIndex); });
	listItem.innerText = listData; //adds game(string) to the list item text
	listItem.appendChild(deleteButton); //adds the delete button to the list item
	listElement.appendChild(listItem); //adds the list item to the list
}

async function main() {
	const playedGamesPromise = improvedFetch("played");
	const unplayedGamesPromise = improvedFetch("unplayed");
	const [playedGames, unplayedGames] = await Promise.all([ playedGamesPromise, unplayedGamesPromise ]);
	updateGameList('played', playedGames);
	updateGameList('unplayed', unplayedGames);

	setInterval(displayTime, 1000); //updates time every second
}

main();
