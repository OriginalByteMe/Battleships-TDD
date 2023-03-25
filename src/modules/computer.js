import Player from "./player";

class Computer extends Player {
	constructor(gameBoard) {
		super("Computer");
		this.gameBoard = gameBoard;
	}

	placeRandomShips() {
		const numShips = Math.floor((this.gameBoard.width * this.gameBoard.height) / 20); // Number of ships proportional to the game board size
		const shipLengths = [1, 2, 3]; // Possible ship lengths
		const orientations = ["X", "Y"]; // Possible ship orientations
	
		for (let i = 0; i < numShips; i++) {
			const length = shipLengths[Math.floor(Math.random() * shipLengths.length)];
			const orientation = orientations[Math.floor(Math.random() * orientations.length)];
	
			let coords;
			do {
				const x = Math.floor(Math.random() * this.gameBoard.width);
				const y = Math.floor(Math.random() * this.gameBoard.height);
				coords = [x, y];
			} while (!this.gameBoard.isValidPlacement("Computer", orientation, length, coords));
	
			this.gameBoard.placeShip("Computer", orientation, length, coords);
		}
	}
	

	getNextShot() {
		let x, y;
		do {
			x = Math.floor(Math.random() * this.gameBoard.width);
			y = Math.floor(Math.random() * this.gameBoard.height);
		} while (this.previousShots.includes(`${x},${y}`) || this.avoidCoordinates.includes(`${x},${y}`));

		const hit = this.gameBoard.receiveAttack("Computer", [x, y]);
		this.previousShots.push(`${x},${y}`);

		if (hit) {
			this.avoidCoordinates = this.avoidCoordinates.concat(this.gameBoard.computerHit); // Add hit coordinates to avoid list
		} else {
			this.avoidCoordinates = this.avoidCoordinates.concat(this.gameBoard.computerMiss); // Add miss coordinates to avoid list
		}

		return hit;
	}
}

export default Computer;
