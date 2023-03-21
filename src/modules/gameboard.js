// Gameboard factory, this is meant to place ships on the gameboard by calling ship factory function
// Gameboard will store the coordinates of each ship they make, they determine the length and orientation by passing those values to the ship factory
// Gameboard will have a recieveAttack() function that allows them to recieve a pair of coordinates, it should then determine whether those attacks are a hit or a miss
// Gameboard will also note down which parts of a ship have been hit or not, to avoid allowing the player to attack the same part twice
// Gameboard will also report the score and whether or not all of the players ships have been sunk

import Ship from "./ship";

class Gameboard {
	constructor(player1, player2, sizeX, sizeY) {
		this.player1 = player1;
		this.player2 = player2;
		this.player1Score = 0;
		this.player2Score = 0;
		this.player1Ships = [];
		this.player2Ships = [];
		this.player1Hit = [];
		this.player2Hit = [];
		this.player1Miss = [];
		this.player2Miss = [];
		this.player1Board = generateBoard(sizeX, sizeY);
		this.player2Board = generateBoard(sizeX, sizeY);
	}

	placeShip(player, orientation, length, coords) {
		const {row, col} = {row: coords[0], col: coords[1]};
		const {boundRow, boundCol} = {boundRow: this.player1Board.length, boundCol: this.player1Board[0].length};
		const board = player === this.player1 ? this.player1Board : this.player2Board;
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

		if (player === this.player1) {
			this.player1Ships.push(ship);
		} else {
			this.player2Ships.push(ship);
		}
		return true;
	}

	recieveAttack(player, coords) {
		const {row, col} = {row: coords[0], col: coords[1]};
		const board = player === this.player1 ? this.player2Board : this.player1Board;
		const ship = board[row][col];
		if (ship && ship.type === "Ship") {
			if (ship.isSunk()) {
				if (player === this.player1) {
					this.player1Score += 1;
					this.player1Hit.push(coords);
				} else {
					this.player2Score += 1;
					this.player2Hit.push(coords);
				}
				return true;
			} else {
				if (player === this.player1) {
					this.player1Hit.push(coords);
				} else {
					this.player2Hit.push(coords);
				}
				return true;
			}
		} else {
			if (player === this.player1) {
				this.player1Miss.push(coords);
			} else {
				this.player2Miss.push(coords);
			}
			return false;
		}   
	}

	get player1Board() {
		return this._player1Board;
	}

	set player1Board(value) {
		this._player1Board = value;
	}

	get player2Board() {
		return this._player2Board;
	}

	set player2Board(value) {
		this._player2Board = value;
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
