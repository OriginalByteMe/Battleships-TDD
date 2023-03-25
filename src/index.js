import DOMHandler from "../src/modules/DOMHandler";
import gameboard from "../src/modules/gameboard";
import "./style.css";

const form = document.getElementById("game-size-form");


form.addEventListener("submit", (event) => {
	event.preventDefault(); // prevent form from refreshing the page
	const gameSize = document.getElementById("game-size").value;
	const playerName = document.getElementById("player-name").value;
	if (!gameSize) return; // if gameSize is not entered, do nothing
	console.log("🚀 ~ file: index.js:12 ~ form.addEventListener ~ gameSize:", gameSize);
  
	// window.location.href = "gameboard.html"; // redirect to gameboard page with gameSize as query parameter
	const gameboardDiv = document.getElementById("gameboard");
	gameboardDiv.style.display = "block";

	const gameBoard = new gameboard(playerName, "computer", gameSize, gameSize);
	DOMHandler(gameBoard);

});

