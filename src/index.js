const listPlayed = document.getElementById("played-list");
const listUnplayed = document.getElementById("unplayed-list");
const d = new Date();
const environment = {
	urls: {
		api: "http://localhost:3000"
	}
};

function updateGameList(list, gameOrGames) {
	if(typeof gameOrGames === "string") {
		const listItem = document.createElement("li");
		const removeButton = document.createElement("button");
		removeButton.setAttribute("class", "removeButton");
		removeButton.innerText = "-";
		listItem.innerText = gameOrGames;
		listItem.appendChild(removeButton);
		list.appendChild(listItem);
	} else {
		for(let i = 0; i < gameOrGames.length; i++) {
			updateGameList(list, gameOrGames[ i ]);
		}
	}
}

async function addGame(listName, list) {
	const newGame = prompt("Enter the name of the game you would like to add");
	const newGameList = await postText(`add-${listName}-game`, newGame);
	list.innerHTML = '';
	updateGameList(list, newGameList);
}

function changeDisplayTime() {
	const hours = (d.getHours() % 12 === 0) ? 12 : d.getHours() % 12;
	const minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
	const seconds = (d.getSeconds() < 10) ? "0" + d.getSeconds() : d.getSeconds();
	document.getElementById("currentTime").innerHTML = hours + ":" + minutes + ":" + seconds;
}

async function getJSON(api) {
	const response = await fetch(`${environment.urls.api}/${api}`);
	return response.json();
}

async function postText(api, requestData) {
	const response = await fetch(`${environment.urls.api}/${api}`, {
		body: requestData,
		headers: { 'Content-Type': 'text/plain' },
		method: 'POST'
	});
	return response.json();
}

async function main() {
	const playedGamesPromise = getJSON("played-games");
	const unplayedGamesPromise = getJSON("unplayed-games");
	const [ playedGames, unplayedGames ] = await Promise.all([ playedGamesPromise, unplayedGamesPromise ]);
	updateGameList(listPlayed, playedGames);
	updateGameList(listUnplayed, unplayedGames);

	//setInterval(changeDisplayTime, 1000);
}
main();
