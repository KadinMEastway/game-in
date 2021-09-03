const gamesPlayed = ["Skyrim", "Zelda: Breath of the Wild", "Final Fantasy XV", "Fallout 4", "Ratchet and Clank"];
const gamesUnplayed = ["Horizon Zero Dawn", "Borderlands 3", "Ratchet and Clank: Rift Apart", "Final Fantasy VII", "Octopath Traveler"];
const listPlayed = document.getElementById("played");
const listUnplayed = document.getElementById("unplayed");

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

addToList(listPlayed, gamesPlayed);
addToList(listUnplayed, gamesUnplayed);
