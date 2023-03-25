import Player from "./player";

class Computer extends Player {
	constructor(gameBoard) {
		super("Computer");
		this.gameBoard = gameBoard;
		this.previousShots = [];
		this.avoidCoordinates = [];
	}

	placeRandomShips() {
		const numShips = Math.floor(Math.random() * (this.gameBoard.size.x * this.gameBoard.size.y) / this.gameBoard.size.y) + 1; // Number of ships proportional to the game board size
		console.log("numShips", numShips);
		const shipLengths = [1, 2, 3]; // Possible ship lengths
		const orientations = ["X", "Y"]; // Possible ship orientations
	
		for (let i = 0; i < numShips; i++) {
			const length = shipLengths[Math.floor(Math.random() * shipLengths.length)];
			const orientation = orientations[Math.floor(Math.random() * orientations.length)];
	
			let coords;
			do {
				const x = Math.floor(Math.random() * this.gameBoard.size.x);
				const y = Math.floor(Math.random() * this.gameBoard.size.y);
				coords = [x, y];
				console.log("Computer ship: ", {length: length, orientation: orientation, coords: coords});
				console.log("Is valid:", this.gameBoard.isValidPlacement("Computer", orientation, length, coords));
			} while (!this.gameBoard.isValidPlacement("Computer", orientation, length, coords));
	
			this.gameBoard.placeShip("Computer", orientation, length, coords);
		}

		const boardData = this.gameBoard.computerBoard.map(obj => {
			if (Object.keys(obj).length === 0) {
				return {length: 0, orientation: "none", damage: 0, type: "none"};
			} else {
				return obj;
			}
		});
		console.table(boardData);
	}
	

	getNextShot() {
		let x, y;
		do {
			x = Math.floor(Math.random() * this.gameBoard.size.x);
			y = Math.floor(Math.random() * this.gameBoard.size.y);
			console.log("Computer shot", x, y);
			console.log("previousShots", this.previousShots);
		} while (this.previousShots.some(coords => coords[0] === x && coords[1] === y) || this.avoidCoordinates.some(coords => coords[0] === x && coords[1] === y));

		const hit = this.gameBoard.recieveAttack("Computer", [x, y]);
		this.previousShots.push(x,y);

		if (hit) {
			this.avoidCoordinates = this.avoidCoordinates.concat(this.gameBoard.computerHit); // Add hit coordinates to avoid list
		} else {
			this.avoidCoordinates = this.avoidCoordinates.concat(this.gameBoard.computerMiss); // Add miss coordinates to avoid list
		}

		return hit;
	}
}

export default Computer;
