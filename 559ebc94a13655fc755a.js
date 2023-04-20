import DOMHandler from "../src/modules/DOMHandler";
import "./style.css";

const form = document.getElementById("game-size-form");


form.addEventListener("submit", (event) => {
	event.preventDefault(); // prevent form from refreshing the page
	const gameSize = document.getElementById("game-size").value;
	const playerName = document.getElementById("player-name").value;
	if (!gameSize) return; // if gameSize is not entered, do nothing
  
	// window.location.href = "gameboard.html"; // redirect to gameboard page with gameSize as query parameter
	const gameboardDiv = document.getElementById("gameboard");
	const startForm = document.getElementById("start-form");
	startForm.style.display = "none";
	gameboardDiv.style.display = "block";

	
	DOMHandler( playerName, gameSize);

});

