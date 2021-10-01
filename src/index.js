const listPlayed = document.getElementById("playedList");
const listUnplayed = document.getElementById("unplayedList");
const environment = {
	urls: {
		api: "http://localhost:3000"
	}
};

function addToList(list, gameOrGames) {
	if (typeof gameOrGames === "string") {
		const listItem = document.createElement("li");
		listItem.innerText = gameOrGames;
		list.appendChild(listItem);
	} else {
		for (let i = 0; i < gameOrGames.length; i++) {
			addToList(list, gameOrGames[i]);
		}
	}
}

function changeDisplayTime() {
	const d = new Date();
	const hours = (d.getHours() % 12 === 0) ? 12 : d.getHours() % 12;
	const minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
	const seconds = (d.getSeconds() < 10) ? "0" + d.getSeconds() : d.getSeconds();
	const displayTime = hours + ":" + minutes + ":" + seconds;
	document.getElementById("currentTime").innerHTML = displayTime;
}

async function getJSON(api) {
	const response = await fetch(`${environment.urls.api}/${api}`);
	const toJSON = await response.json();
	return toJSON;
}

async function main() {
	const playedGamesPromise = getJSON("played-games");
	const unplayedGamesPromise = getJSON("unplayed-games");
	const [playedGames, unplayedGames] = await Promise.all([playedGamesPromise, unplayedGamesPromise]);
	addToList(listPlayed, playedGames);
	addToList(listUnplayed, unplayedGames);

	//setInterval(changeDisplayTime, 1000);
}
main();
