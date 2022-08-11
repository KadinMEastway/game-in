const listPlayed = document.getElementById("played-list");
const listUnplayed = document.getElementById("unplayed-list");
const environment = {
	urls: {
		api: "http://localhost:3000"
	}
};

async function addOrRemoveGame(list, action, requestData) {
	let newList = [];
	if (action === 'add') {
		requestData = prompt("Enter the name of the game you would like to add");
		newList = await improvedFetch(list, 'POST', requestData);
	} else if(action === 'remove') {
		newList = await improvedFetch(list, 'DELETE', requestData);
	}
	const listElement = document.getElementById(`${list}-list`);
	listElement.innerHTML = '';
	updateGameList(list, newList);
}

function displayTime() {
	const d = new Date();
	const hours = (d.getHours() % 12 === 0) ? 12 : d.getHours() % 12;
	const minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
	const seconds = (d.getSeconds() < 10) ? "0" + d.getSeconds() : d.getSeconds();
	document.getElementById("currentTime").innerHTML = hours + ":" + minutes + ":" + seconds;
}

async function improvedFetch(list, method = 'GET', requestData) {
	const api = `${method.toLowerCase()}-${list}-games`
	const response = await fetch(`${environment.urls.api}/${api}`, {
		body: requestData,
		headers: { 'Content-Type': 'text/plain' },
		method: method
	});
	return response.json();
}

function updateGameList(list, listData, gameIndex = 0) {
	const listElement = document.getElementById(`${list}-list`);
	if(typeof listData === "string") {
		const listItem = document.createElement("li");
		const deleteButton = document.createElement("button");
		deleteButton.setAttribute("class", "deleteButton");
		deleteButton.innerText = "-";
		deleteButton.addEventListener('click', async () => { await addOrRemoveGame(list, 'remove', gameIndex); });
		listItem.innerText = listData;
		listItem.appendChild(deleteButton);
		listElement.appendChild(listItem);
	} else {
		for(let i = 0; i < listData.length; i++) {
			updateGameList(list, listData[ i ], i);
		}
	}
}

async function main() {
	const playedGamesPromise = improvedFetch("played");
	const unplayedGamesPromise = improvedFetch("unplayed");
	const [playedGames, unplayedGames] = await Promise.all([ playedGamesPromise, unplayedGamesPromise ]);
	updateGameList('played', playedGames);
	updateGameList('unplayed', unplayedGames);

	setInterval(displayTime, 1000);
}

main();
