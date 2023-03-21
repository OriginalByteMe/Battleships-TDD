import Gameboard from "../src/modules/gameboard";
import Ship from "../src/modules/ship";

test("Gameboard can place ships at specified coords with ship details", () => {
	const player1 = "player1";
	const player2 = "player2";
	const gameboard = new Gameboard(player1, player2, 3, 3);
	gameboard.placeShip(player1, "X", 1, [0,0]);
	expect(gameboard.player1Board[0][0]).toEqual(new Ship(1, "X"));
	gameboard.placeShip(player1, "X", 2, [0,1]);
	expect(gameboard.player1Board[0][1]).toEqual(new Ship(2, "X"));
});

test("Placing ship on already occupied coords returns false" , () => {
	const player1 = "player1";
	const player2 = "player2";
	const gameboard = new Gameboard(player1, player2, 3, 3);
	gameboard.placeShip(player1, "X", 1, [0,0]);
	expect(gameboard.player1Board[0][0]).toEqual(new Ship(1, "X"));
	expect(gameboard.placeShip(player1, "X", 1, [0,0])).toBe(false);
});

test("Placing a ship out of bounds of x-axis of the specified board, returns false ", () => {
	const player1 = "player1";
	const player2 = "player2";
	const gameboard = new Gameboard(player1, player2, 3, 3);
	expect(gameboard.placeShip(player1, "X", 1, [-1,0])).toBe(false);
	expect(gameboard.placeShip(player1, "X", 1, [4,0])).toBe(false);
});

test("Placing a ship out of bounds of y-axis of the specified board, returns false ", () => {
	const player1 = "player1";
	const player2 = "player2";
	const gameboard = new Gameboard(player1, player2, 3, 3);
	expect(gameboard.placeShip(player1, "Y", 1, [0,4])).toBe(false);
	expect(gameboard.placeShip(player1, "Y", 1, [0,-1])).toBe(false);
});

test("Placing a ship at the edge of a boundary, but making it longer than 2, should flip the ship and place it in the other direction", () => {
	const player1 = "player1";
	const player2 = "player2";
	const gameboard = new Gameboard(player1, player2, 3, 3);
	expect(gameboard.placeShip(player1, "Y", 2, [0,3])).toBe(true);
	expect(gameboard.player1Board[0][3]).toEqual(new Ship(2, "Y"));
	expect(gameboard.player1Board[1][3]).toEqual(new Ship(2, "Y"));
	expect(gameboard.placeShip(player1, "X", 2, [0,0])).toBe(true);
	expect(gameboard.player1Board[0][0]).toEqual(new Ship(2, "X"));
	expect(gameboard.player1Board[0][1]).toEqual(new Ship(2, "X"));
});

test("Should not be allowed to place a ship if any of it's points intersect with another ship", () => {
	const player1 = "player1";
	const player2 = "player2";
	const gameboard = new Gameboard(player1, player2, 3, 3);
	expect(gameboard.placeShip(player1, "X", 1, [2,2])).toBe(true);
	expect(gameboard.placeShip(player1, "X", 2, [2,1])).toBe(false);

	// Reverse ship placement
	expect(gameboard.placeShip(player2, "X", 1, [2,2])).toBe(true);
	expect(gameboard.placeShip(player2, "X", 2, [2,3])).toBe(false);
});

test("recievingAttack function should hit the ship if coord's are correct", () => {
	const player1 = "player1";
	const player2 = "player2";
	const gameboard = new Gameboard(player1, player2, 3, 3);
	gameboard.placeShip(player1, "X", 1, [0,0]);
	expect(gameboard.player1Board[0][0]).toEqual(new Ship(1, "X"));
	expect(gameboard.recieveAttack(player2, [0,0])).toBe(true);
});

test("recievingAttack function should not hit the ship if coord's are incorrect", () => {
	const player1 = "player1";
	const player2 = "player2";
	const gameboard = new Gameboard(player1, player2, 3, 3);
	gameboard.placeShip(player1, "X", 1, [0,0]);
	expect(gameboard.recieveAttack(player2, [0,1])).toBe(false);
});

