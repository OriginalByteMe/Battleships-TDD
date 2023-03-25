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

import Computer from "./computer";
import Gameboard from "./gameboard";

export default function DOMHandler( player, size) {
	const gameboard = new Gameboard(player, "computer", size, size);
	const computer = new Computer(gameboard);
	const startingPhase = () => {
		const playerGrid = document.querySelector(".player-grid");
		const enemyGrid = document.querySelector(".enemy-grid");
		const startButton = document.querySelector("#start-game");
		let isPlacingShip = false;
		let startCell = null;
		let selectedCells = [];
	
		createBoard(playerGrid, true);
		createBoard(enemyGrid);

		function createBoard(grid, isPlayer) { 
			for (let row = 0; row < gameboard.size.y; row++) {
				const rowDiv = document.createElement("div");
				rowDiv.classList.add("row");
				rowDiv.dataset.row = `${"Row-",row}`;
				for (let col = 0; col < gameboard.size.x; col++) {
					const cell = document.createElement("div");
					cell.classList.add("cell");
					cell.dataset.row = row;
					cell.dataset.col = col;
					
					if (isPlayer){
						// Add a mousedown event listener to the cell
						cell.addEventListener("mousedown", handleMouseDown);
				
						// Add a mouseover event listener to the cell
						cell.addEventListener("mouseover", handleMouseOver);
					}
					
					rowDiv.appendChild(cell);
					
				}
				grid.appendChild(rowDiv);
			}
		}
		
		function handleMouseDown(event) {
			if (!isPlacingShip) {
				isPlacingShip = true;
				startCell = event.target;
				selectedCells.push(startCell);
				startCell.classList.add("ship");
			}
		}
		
		function handleMouseOver(event) {
			if (isPlacingShip && event.buttons === 1) {
				const currentCell = event.target;
				const prevCell = selectedCells[selectedCells.length - 1];
		
				// Check if the current cell is adjacent to the previous cell
				if (isAdjacent(prevCell, currentCell)) {
					selectedCells.push(currentCell);
					currentCell.classList.add("ship");
				}
			}
		}
		
		function handleMouseUp() {
			if (isPlacingShip) {
				isPlacingShip = false;
				startCell = null;
		
				// Get the orientation of the ship (horizontal or vertical)
				const orientation = getOrientation(selectedCells);
				console.log("🚀 ~ file: DOMHandler.js:32 ~ startingPhase ~ selectedCells:", selectedCells);
		
				// Get the number of tiles selected
				const numTiles = selectedCells.length;
				console.log("numTiles", numTiles);
				const firstCell = selectedCells[0];
				console.log("firstCell", firstCell);

				console.log("coords", [firstCell.dataset.row, firstCell.dataset.col]);
		
				// Call the placeShip function with the selected cells, orientation, and number of tiles
				if(gameboard.placeShip(player, orientation, numTiles, [firstCell.dataset.row, firstCell.dataset.col])) {
					console.log("Ship placed successfully");
				} else {
					console.log("Ship placement failed");
				}
				
				selectedCells = [];
				updatePlayerGrid();
			}
		}
		
		// Add a mouseup event listener to the grid container
		playerGrid.addEventListener("mouseup", handleMouseUp);
		
		// Add a click event listener to the start button
		startButton.addEventListener("click", () => {
			// Make the grid unclickable
			playerGrid.removeEventListener("mousedown", handleMouseDown);
			playerGrid.removeEventListener("mouseover", handleMouseOver);
			playerGrid.removeEventListener("mouseup", handleMouseUp);

			// Remove event listeners from the cells
			const cells = document.querySelectorAll(".cell");
			cells.forEach((cell) => {
				cell.removeEventListener("mousedown", handleMouseDown);
				cell.removeEventListener("mouseover", handleMouseOver);
			});

			computer.placeRandomShips();
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
				return "X";
			} else {
				return "Y";
			}
		}
	};

	

	function updatePlayerGrid() {
		const playerGrid = document.querySelector(".player-grid");

		for (let row = 0; row < gameboard.size.x; row++) {
			for (let col = 0; col < gameboard.size.x; col++) {
				const cell = playerGrid.children[row].children[col];
				const ship = gameboard.playerBoard[row][col];
				
				if (ship) {
					if (gameboard.playerHit.includes(row, col)) {
						cell.classList.add("hit");
					} else if (gameboard.playerMiss.includes(row, col)) {
						cell.classList.add("miss");
					}
				} else {
					cell.classList.remove("hit");
					cell.classList.remove("miss");
					cell.classList.remove("ship");
				}
			}
		}
		const boardData = gameboard.playerBoard.map(obj => {
			if (Object.keys(obj).length === 0) {
				return {length: 0, orientation: "none", damage: 0, type: "none"};
			} else {
				return obj;
			}
		});
		console.table(boardData);
	}

	function updateEnemyGrid() {
		const enemyGrid = document.querySelector(".enemy-grid");
		
		for (let row = 0; row < gameboard.size.x; row++) {
			for (let col = 0; col < gameboard.size.x; col++) {
				const cell = enemyGrid.children[row].children[col];
				const ship = gameboard.playerBoard[row][col];
				if (ship) {
					if (gameboard.playerHit.includes(row, col)) {
						cell.classList.add("hit");
					} else if (gameboard.playerMiss.includes(row, col)) {
						cell.classList.add("miss");
					}
				}
			}
		}
	}
	const gameLoop = () => {
		const enemyGrid = document.querySelector(".enemy-grid");
		
		// Add a click event listener to the enemy grid
		enemyGrid.addEventListener("click", (event) => {
			const cell = event.target;
			const row = parseInt(cell.dataset.row);
			const col = parseInt(cell.dataset.col);

			// Call the receiveAttack function with the row and column
			const hit = gameboard.recieveAttack(player, [row, col]);

			// Change the background color of the cell based on whether the attack was a hit or a miss
			if (hit) {
				cell.style.backgroundColor = "red";
				updateEnemyGrid();
			} else {
				cell.style.backgroundColor = "blue";
				updateEnemyGrid();
			}

			// Call the computerPlay function
			const computerHit = computer.getNextShot();
			console.log("computerHit", computerHit);
			updatePlayerGrid();
			

			// Change the background color of the cell based on whether the attack was a hit or a miss
			


			// Check if the game is over
			const winner = gameboard.getWinner();
			if (winner !== false) {
				// Remove the click event listener from the enemy grid
				enemyGrid.removeEventListener("click", gameLoop);

				// Display a message to the player that the game is over
				const gameOverMessage = document.createElement("p");
				gameOverMessage.textContent = "Game Over!";

				// Display a message that tells the player if they won or lost
				const gameResultMessage = document.createElement("p");
				gameResultMessage.textContent = winner;

				// Display a button that allows the player to restart the game
				const restartButton = document.createElement("button");
				restartButton.textContent = "Restart Game";
				restartButton.addEventListener("click", () => {
					// Reload the page
					window.location.reload();
				});

				// Append the messages and button to the DOM
				const gameContainer = document.querySelector("#gameboard");
				gameContainer.appendChild(gameOverMessage);
				gameContainer.appendChild(gameResultMessage);
				gameContainer.appendChild(restartButton);
			}
		});
	};

	startingPhase();
}
