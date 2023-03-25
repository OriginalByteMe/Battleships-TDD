// Function that handles all DOM events on the gameboard
// Path: src/modules/gameboard.js
// DOM handler needs to have a starting stage, where it generates two boards filled with divs according to the size component of the gameboard object
// It also needs to have a game loop, where it handles all the events that happen during the game
// Need to generate a board with divs for the player's ships, these divs need to be clickable and draggable
// When clicking on a div it needs to call the placeShip function of the gameboard object
// When dragging a div it needs to hold off on calling the placeShip function until the mouse is released
// When the mouse is released it needs to call the placeShip function of the gameboard object with the correct orientation and number of divs as the size

// Game loop starts when the player clicks the start button
// When game loop starts the divs need to be unclickable and undraggable
// Only the enemy divs will be clickable to try and shoot the enemy ships
// When the player clicks on a div it needs to call the receiveAttack function of the gameboard object
// If receiveAttack returns true it needs to change the background color of the div on the enemy board to red
// If receiveAttack returns false it needs to change the background color of the div on the enemy board to blue
// After the player has clicked on a div it needs to call the computerPlay function of the gameboard object
// The computerPlay function needs to randomly select a div and call the receiveAttack function of the gameboard object
// If receiveAttack returns true it needs to change the background color of the div on the player board to red
// If receiveAttack returns false it needs to change the background color of the div on the player board to blue

// When the game loop ends it needs to display a message to the player that the game is over
// It needs to display a message that tells the player if they won or lost
// It needs to display a button that allows the player to restart the game

export default function DOMHandler(gameboard) {
	const startingPhase = () => {
		const gridContainer = document.querySelector(".grid-container");
		const startButton = document.querySelector("#start-button");
		console.log("🚀 ~ file: DOMHandler.js:32 ~ startingPhase ~ gameboard.size.x:", gameboard.size.x);
		
		// Create the grid of cells
		for (let row = 0; row < gameboard.size.x; row++) {
			for (let col = 0; col < gameboard.size.x; col++) {
				const cell = document.createElement("div");
				cell.classList.add("cell");
				cell.dataset.row = row;
				cell.dataset.col = col;
		
				// Add a mousedown event listener to the cell
				cell.addEventListener("mousedown", handleMouseDown);
		
				// Add a mouseover event listener to the cell
				cell.addEventListener("mouseover", handleMouseOver);
		
				gridContainer.appendChild(cell);
			}
		}
		
		let isPlacingShip = false;
		let startCell = null;
		let selectedCells = [];
		
		function handleMouseDown(event) {
			if (!isPlacingShip) {
				isPlacingShip = true;
				startCell = event.target;
				selectedCells.push(startCell);
				startCell.classList.add("selected");
			}
		}
		
		function handleMouseOver(event) {
			if (isPlacingShip && event.buttons === 1) {
				const currentCell = event.target;
				const prevCell = selectedCells[selectedCells.length - 1];
		
				// Check if the current cell is adjacent to the previous cell
				if (isAdjacent(prevCell, currentCell)) {
					selectedCells.push(currentCell);
					currentCell.classList.add("selected");
				}
			}
		}
		
		function handleMouseUp(event) {
			if (isPlacingShip) {
				isPlacingShip = false;
				startCell = null;
		
				// Get the orientation of the ship (horizontal or vertical)
				const orientation = getOrientation(selectedCells);
		
				// Get the number of tiles selected
				const numTiles = selectedCells.length;
		
				// Call the placeShip function with the selected cells, orientation, and number of tiles
				gameboard.placeShip(selectedCells, orientation, numTiles);
		
				// Clear the selected cells array
				selectedCells.forEach(cell => cell.classList.remove("selected"));
				selectedCells = [];
			}
		}
		
		// Add a mouseup event listener to the grid container
		gridContainer.addEventListener("mouseup", handleMouseUp);
		
		// Add a click event listener to the start button
		startButton.addEventListener("click", () => {
			// Make the grid unclickable
			gridContainer.removeEventListener("mousedown", handleMouseDown);
			gridContainer.removeEventListener("mouseover", handleMouseOver);

			// Call the gameloop
			gameLoop();

			// Hide start button
			startButton.style.display = "none";
		});
		
		// Helper functions
		
		function isAdjacent(cell1, cell2) {
			const row1 = parseInt(cell1.dataset.row);
			const col1 = parseInt(cell1.dataset.col);
			const row2 = parseInt(cell2.dataset.row);
			const col2 = parseInt(cell2.dataset.col);
		
			return Math.abs(row1 - row2) <= 1 && Math.abs(col1 - col2) <= 1;
		}
		
		function getOrientation(cells) {
			const firstCell = cells[0];
			const lastCell = cells[cells.length - 1];
		
			if (firstCell.dataset.row === lastCell.dataset.row) {
				return "horizontal";
			} else {
				return "vertical";
			}
		}
	};

	const gameLoop = () => {
		const playerGrid = document.querySelector(".player-grid");
		const enemyGrid = document.querySelector(".enemy-grid");

		// Add a click event listener to the enemy grid
		enemyGrid.addEventListener("click", (event) => {
			const cell = event.target;
			const row = parseInt(cell.dataset.row);
			const col = parseInt(cell.dataset.col);

			// Call the receiveAttack function with the row and column
			const hit = gameboard.receiveAttack(row, col);

			// Change the background color of the cell based on whether the attack was a hit or a miss
			if (hit) {
				cell.style.backgroundColor = "red";
			} else {
				cell.style.backgroundColor = "blue";
			}

			// Call the computerPlay function
			const computerAttack = gameboard.computerPlay();

			// Get the cell that was attacked
			const computerCell = playerGrid.querySelector(`[data-row="${computerAttack.row}"][data-col="${computerAttack.col}"]`);

			// Change the background color of the cell based on whether the attack was a hit or a miss
			if (computerAttack.hit) {
				computerCell.style.backgroundColor = "red";
			} else {
				computerCell.style.backgroundColor = "blue";
			}

			// Check if the game is over
			if (gameboard.isGameOver()) {
				// Remove the click event listener from the enemy grid
				enemyGrid.removeEventListener("click", gameLoop);

				// Display a message to the player that the game is over
				const gameOverMessage = document.createElement("p");
				gameOverMessage.textContent = "Game Over!";

				// Display a message that tells the player if they won or lost
				const gameResultMessage = document.createElement("p");
				gameResultMessage.textContent = gameboard.isGameOver();

				// Display a button that allows the player to restart the game
				const restartButton = document.createElement("button");
				restartButton.textContent = "Restart Game";
				restartButton.addEventListener("click", () => {
					// Reload the page
					window.location.reload();
				});

				// Append the messages and button to the DOM
				const gameContainer = document.querySelector(".game-container");
				gameContainer.appendChild(gameOverMessage);
				gameContainer.appendChild(gameResultMessage);
				gameContainer.appendChild(restartButton);
			}
		});
	};

	startingPhase();


}
