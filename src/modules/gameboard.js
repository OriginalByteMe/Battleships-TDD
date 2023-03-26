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
		this._playerBoard = generateBoard(sizeX, sizeY);
		this.computerBoard = generateBoard(sizeX, sizeY);
		this.size = {x: sizeX, y: sizeY};
	}

	/**
	 * It places a ship on the board, and returns true if it was successful, and false if it was not
	 * @param player - The player who is placing the ship. This is either the player or the computer.
	 * @param orientation - "X" or "Y"
	 * @param length - The length of the ship you want to place.
	 * @param coords - The coordinates of the ship's head.
	 * @returns A boolean value.
	 */
	placeShip(player, orientation, length, coords) {
		if (length > 3) length = 3;
		if (length < 1) length = 1;

		const {row, col} = {row: coords[0], col: coords[1]};
		const {boundRow, boundCol} = {boundRow: this.playerBoard.length, boundCol: this.playerBoard[0].length};
		const board = player === this.player ? this.playerBoard : this.computerBoard;
		const ship = new Ship(length, orientation);

		// Check for out of bounds coords
		if (row > boundRow || col > boundCol || row < 0 || col < 0 || player === undefined || orientation === undefined || length === undefined || coords === undefined) {
			return false;
		}

		if (orientation === "X") {
			if (col + length > board[0].length) {
				// Ship goes out of bounds to the right, try placing it in reverse order
				if (col - length < -1) {
					return false; // Reverse order is also out of bounds
				}
				for (let i = col; i >= col - length; i--) {
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
			return false;
		}

		if (player === this.player) {
			this.playerShips.push(ship);
		} else {
			this.computerShips.push(ship);
		}
		return true;
	}

	isValidPlacement(player, orientation, length, coords) {
		if (length > 3) length = 3;
		if (length < 1) length = 1;

		const {row, col} = {row: coords[0], col: coords[1]};
		const {boundRow, boundCol} = {boundRow: this.playerBoard.length - 1, boundCol: this.playerBoard[0].length - 1};
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
				}
			} else {
				// Ship fits within bounds horizontally
				for (let i = col; i < col + length; i++) {
					if (board[row][i] && board[row][i].type === ship.type) {
						return false; // There is a ship in the way
					}
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
				}
			} else {
				// Ship fits within bounds vertically
				for (let i = row; i < row + length; i++) {
					if (board[i][col] && board[i][col].type === ship.type) {
						return false; // There is a ship in the way
					}
				}
			}
		} else {
			return false;
		}

		return true;
	}

	/**
	 * The function takes in a player and a coordinate array, and returns true if the player hit a ship,
	 * and false if the player missed
	 * @param player - the player who is attacking
	 * @param coords - an array of two numbers, the row and column of the attack
	 * @returns A boolean value.
	 */
	recieveAttack(player, coords) {
		const {row, col} = {row: coords[0], col: coords[1]};
		const board = player === this.player ? this.computerBoard : this.playerBoard;
		const ship = board[row][col];
		if (ship && ship.type === "Ship") {
			ship.hit();
			if (ship.isSunk()) {
				if (player === this.player) {
					this.playerScore += 1;
					this.playerHit.push(coords);
				} else {
					this.computerScore += 1;
					this.computerHit.push(coords);
				}
			} else {
				if (player === this.player) {
					this.playerHit.push(coords);
				} else {
					this.computerHit.push(coords);
				}
			}
			return true;
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
		if (this.computerShips.length === 0 || this.playerShips.length === 0) return false;
		// If all ships are sunk, return the winner
		if (this.computerShips.every(ship => ship.isSunk())) {
			return this.player;
		} else if (this.playerShips.every(ship => ship.isSunk())) {
			return this.computer;
		} else {
			return false;
		}
	}

	get playerBoard() {
		return this._playerBoard;
	}
	
	set playerBoard(board) {
		this._playerBoard = board;
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
