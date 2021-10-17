const listPlayed = document.getElementById("played-list");
const listUnplayed = document.getElementById("unplayed-list");
const environment = {
	urls: {
		api: "http://localhost:3000"
	}
};

function updateGameList(listName, gameOrGames, gameIndex = 0) {
	const list = document.getElementById(`${listName}-list`);
	if(typeof gameOrGames === "string") {
		const listItem = document.createElement("li");
		const deleteButton = document.createElement("button");
		deleteButton.setAttribute("class", "deleteButton");
		deleteButton.innerText = "-";
		deleteButton.addEventListener('click', () => { editList(listName, gameIndex, 'DELETE'); });
		listItem.innerText = gameOrGames;
		listItem.appendChild(deleteButton);
		list.appendChild(listItem);
	} else {
		for(let i = 0; i < gameOrGames.length; i++) {
			updateGameList(listName, gameOrGames[ i ], i);
		}
	}
}

function changeDisplayTime() {
	const d = new Date();
	const hours = (d.getHours() % 12 === 0) ? 12 : d.getHours() % 12;
	const minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
	const seconds = (d.getSeconds() < 10) ? "0" + d.getSeconds() : d.getSeconds();
	document.getElementById("currentTime").innerHTML = hours + ":" + minutes + ":" + seconds;
}

async function editList(listName, requestData = prompt("Enter the name of the game you would like to add"), editMethod = 'POST') {
	const list = document.getElementById(`${listName}-list`);
	const editType = (editMethod === 'POST') ? 'add' : 'delete';
	const newGameList = await improvedFetch(`${editType}-${listName}-game`, requestData, editMethod);
	list.innerHTML = '';
	updateGameList(listName, newGameList);
}

async function improvedFetch(api, requestData = null, methodType = 'GET') {
	const response = await fetch(`${environment.urls.api}/${api}`, {
		body: requestData,
		headers: { 'Content-Type': 'text/plain' },
		method: methodType
	});
	return response.json();
}

async function main() {
	const playedGamesPromise = improvedFetch("played-games");
	const unplayedGamesPromise = improvedFetch("unplayed-games");
	const [ playedGames, unplayedGames ] = await Promise.all([ playedGamesPromise, unplayedGamesPromise ]);
	updateGameList('played', playedGames);
	updateGameList('unplayed', unplayedGames);

	setInterval(changeDisplayTime, 1000);
}
main();
