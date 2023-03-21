// Gameboard factory, this is meant to place ships on the gameboard by calling ship factory function
// Gameboard will store the coordinates of each ship they make, they determine the length and orientation by passing those values to the ship factory
// Gameboard will have a recieveAttack() function that allows them to recieve a pair of coordinates, it should then determine whether those attacks are a hit or a miss
// Gameboard will also note down which parts of a ship have been hit or not, to avoid allowing the player to attack the same part twice
// Gameboard will also report the score and whether or not all of the players ships have been sunk

import Ship from "./ship";

class Gameboard {
	constructor(player, computer, sizeX, sizeY) {
		this.player = player;
		this.computer = computer;
		this.playerScore = 0;
		this.computerScore = 0;
		this.playerShips = [];
		this.computerShips = [];
		this.playerHit = [];
		this.computerHit = [];
		this.playerMiss = [];
		this.computerMiss = [];
		this.playerBoard = generateBoard(sizeX, sizeY);
		this.computerBoard = generateBoard(sizeX, sizeY);
	}

	placeShip(player, orientation, length, coords) {
		const {row, col} = {row: coords[0], col: coords[1]};
		const {boundRow, boundCol} = {boundRow: this.playerBoard.length, boundCol: this.playerBoard[0].length};
		const board = player === this.player ? this.playerBoard : this.computerBoard;
		const ship = new Ship(length, orientation);

		// Check for out of bounds coords
		if (row > boundRow || col > boundCol || row < 0 || col < 0) {
			return false;
		}

		if (orientation === "X") {
			if (col + length > board[0].length) {
				// Ship goes out of bounds to the right, try placing it in reverse order
				if (col - length < -1) {
					return false; // Reverse order is also out of bounds
				}
				for (let i = col - 1; i >= col - length; i--) {
					if (board[row][i] && board[row][i].type === ship.type) {
						return false; // There is a ship in the way
					}
					board[row][i] = ship;
				}
			} else {
				// Ship fits within bounds horizontally
				for (let i = col; i < col + length; i++) {
					if (board[row][i] && board[row][i].type === ship.type) {
						return false; // There is a ship in the way
					}
					board[row][i] = ship;
				}
			}
		} else if (orientation === "Y") {
			if (row + length > board.length) {
				// Ship goes out of bounds downwards, try placing it in reverse order
				if (row - length < -1) {
					return false; // Reverse order is also out of bounds
				}
				for (let i = row - 1; i >= row - length; i--) {
					if (board[i][col] && board[i][col].type === ship.type) {
						return false; // There is a ship in the way
					}
					board[i][col] = ship;
				}
			} else {
				// Ship fits within bounds vertically
				for (let i = row; i < row + length; i++) {
					if (board[i][col] && board[i][col].type === ship.type) {
						return false; // There is a ship in the way
					}
					board[i][col] = ship;
				}
			}
		} else {
			console.error("Incorrect orientation: ", orientation, "\n Must be X or Y");
			return false;
		}

		if (player === this.player) {
			this.playerShips.push(ship);
		} else {
			this.computerShips.push(ship);
		}
		return true;
	}

	recieveAttack(player, coords) {
		const {row, col} = {row: coords[0], col: coords[1]};
		const board = player === this.player ? this.computerBoard : this.playerBoard;
		const ship = board[row][col];
		if (ship && ship.type === "Ship") {
			if (ship.isSunk()) {
				if (player === this.player) {
					this.playerScore += 1;
					this.playerHit.push(coords);
				} else {
					this.computerScore += 1;
					this.computerHit.push(coords);
				}
				return true;
			} else {
				if (player === this.player) {
					this.playerHit.push(coords);
				} else {
					this.computerHit.push(coords);
				}
				return true;
			}
		} else {
			if (player === this.player) {
				this.playerMiss.push(coords);
			} else {
				this.computerMiss.push(coords);
			}
			return false;
		}   
	}

	getWinner() {
		if (this.playerScore === this.computerShips.length) return this.player;
		if (this.computerScore === this.playerShips.length) return this.computer;
		return false;
	}
}

const generateBoard =(sizeX, sizeY) => {
	let board = [];
	for (let i = 0; i < sizeY; i++) {
		let row = [];
		for (let j = 0; j < sizeX; j++) {
			row.push({});
		}
		board.push(row);
	}
	return board;
};



export default Gameboard;
