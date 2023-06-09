import Gameboard from "../src/modules/gameboard";
import Ship from "../src/modules/ship";

test("Gameboard can place ships at specified coords with ship details", () => {
	const player = "player";
	const player2 = "player2";
	const gameboard = new Gameboard(player, player2, 3, 3);
	const expectedBoard1 = [
		[new Ship(1, "X"), {}, {}],
		[{}, {}, {}],
		[{}, {}, {}]
	];

	const expectedBoard2 = [
		[new Ship(1, "X"), new Ship(2, "X"), new Ship(2, "X")],
		[{}, {}, {}],
		[{}, {}, {}]
	];

	const expectedBoard3 = [
		[new Ship(1, "X"), new Ship(2, "X"), new Ship(2, "X")],
		[{}, {}, new Ship(1, "X")],
		[{}, {}, {}]
	];

	const expectedBoard4 = [
		[new Ship(1, "X"), new Ship(2, "X"), new Ship(2, "X")],
		[{}, {}, new Ship(1, "X")],
		[new Ship(1, "Y"), {}, {}]
	];

	gameboard.placeShip(player, "X", 1, [0,0]);
	expect(gameboard.playerBoard[0][0]).toEqual(new Ship(1, "X"));
	expect(gameboard.playerBoard).toEqual(expectedBoard1);
	gameboard.placeShip(player, "X", 2, [0,1]);
	expect(gameboard.playerBoard[0][1]).toEqual(new Ship(2, "X"));
	expect(gameboard.playerBoard).toEqual(expectedBoard2);

	gameboard.placeShip(player, "X", 1, [1,2]);
	expect(gameboard.playerBoard[1][2]).toEqual(new Ship(1, "X"));
	expect(gameboard.playerBoard).toEqual(expectedBoard3);

	gameboard.placeShip(player, "Y", 1, [2,0]);
	expect(gameboard.playerBoard[2][0]).toEqual(new Ship(1, "Y"));
	expect(gameboard.playerBoard).toEqual(expectedBoard4);

});

test("Placing ship on already occupied coords returns false" , () => {
	const player = "player";
	const player2 = "player2";
	const gameboard = new Gameboard(player, player2, 3, 3);
	gameboard.placeShip(player, "X", 1, [0,0]);
	expect(gameboard.playerBoard[0][0]).toEqual(new Ship(1, "X"));
	expect(gameboard.placeShip(player, "X", 1, [0,0])).toBe(false);
});

test("Placing a ship out of bounds of x-axis of the specified board, returns false ", () => {
	const player = "player";
	const player2 = "player2";
	const gameboard = new Gameboard(player, player2, 3, 3);
	expect(gameboard.placeShip(player, "X", 1, [-1,0])).toBe(false);
	expect(gameboard.placeShip(player, "X", 1, [4,0])).toBe(false);
});

test("Placing a ship out of bounds of y-axis of the specified board, returns false ", () => {
	const player = "player";
	const player2 = "player2";
	const gameboard = new Gameboard(player, player2, 3, 3);
	expect(gameboard.placeShip(player, "Y", 1, [0,4])).toBe(false);
	expect(gameboard.placeShip(player, "Y", 1, [0,-1])).toBe(false);
});

test("Placing a ship at the edge of a boundary, but making it longer than 2, should flip the ship and place it in the other direction", () => {
	const player = "player";
	const player2 = "player2";
	const gameboard = new Gameboard(player, player2, 3, 3);
	expect(gameboard.placeShip(player, "Y", 2, [0,3])).toBe(true);
	expect(gameboard.playerBoard[0][3]).toEqual(new Ship(2, "Y"));
	expect(gameboard.playerBoard[1][3]).toEqual(new Ship(2, "Y"));
	expect(gameboard.placeShip(player, "X", 2, [0,0])).toBe(true);
	expect(gameboard.playerBoard[0][0]).toEqual(new Ship(2, "X"));
	expect(gameboard.playerBoard[0][1]).toEqual(new Ship(2, "X"));
});

test("Should not be allowed to place a ship if any of it's points intersect with another ship", () => {
	const player = "player";
	const player2 = "player2";
	const gameboard = new Gameboard(player, player2, 3, 3);
	expect(gameboard.placeShip(player, "X", 1, [2,2])).toBe(true);
	expect(gameboard.placeShip(player, "X", 2, [2,1])).toBe(false);

	// Reverse ship placement
	expect(gameboard.placeShip(player2, "X", 1, [2,2])).toBe(true);
	expect(gameboard.placeShip(player2, "X", 2, [2,3])).toBe(false);
});

test("recievingAttack function should hit the ship if coord's are correct", () => {
	const player = "player";
	const player2 = "player2";
	const gameboard = new Gameboard(player, player2, 3, 3);
	gameboard.placeShip(player, "X", 1, [0,0]);
	expect(gameboard.playerBoard[0][0]).toEqual(new Ship(1, "X"));
	expect(gameboard.recieveAttack(player2, [0,0])).toBe(true);
});

test("recievingAttack function should not hit the ship if coord's are incorrect", () => {
	const player = "player";
	const player2 = "player2";
	const gameboard = new Gameboard(player, player2, 3, 3);
	gameboard.placeShip(player, "X", 1, [0,0]);
	expect(gameboard.recieveAttack(player2, [0,1])).toBe(false);
});

test("Ship length cannot be larger than 3", () => {
	const player = "player";
	const player2 = "player2";
	const gameboard = new Gameboard(player, player2, 5, 5);
	gameboard.placeShip(player, "X", 4, [0,0]);
	expect(gameboard.playerBoard[0][0]).toEqual(new Ship(3, "X"));
	expect(gameboard.playerBoard[0][1]).toEqual(new Ship(3, "X"));
	expect(gameboard.playerBoard[0][2]).toEqual(new Ship(3, "X"));
});

test("Ship length cannot be smaller than 1", () => {
	const player = "player";
	const player2 = "player2";
	const gameboard = new Gameboard(player, player2, 1, 1);
	gameboard.placeShip(player, "X", -1, [0,0]);
	expect(gameboard.playerBoard[0][0]).toEqual(new Ship(1, "X"));	
});

test("Valid placement function should correctly identify valid placement", () => {
	const player = "player";
	const player2 = "player2";
	const gameboard = new Gameboard(player, player2, 3, 3);
	gameboard.placeShip(player, "X", 1, [0,0]);
	expect(gameboard.isValidPlacement(player, "X", 1, [0,0])).toBe(false);
	expect(gameboard.isValidPlacement(player, "X", 1, [3,0])).toBe(false);
	expect(gameboard.isValidPlacement(player, "X", 1, [0,1])).toBe(true);
});

test("If there is no winner, gameboard should return falser", () => {
	const player = "player";
	const player2 = "player2";
	const gameboard = new Gameboard(player, player2, 3, 3);
	gameboard.placeShip(player, "X", 1, [0,0]);
	gameboard.placeShip(player2, "X", 1, [0,1]);
	expect(gameboard.getWinner()).toBe(false);
});

test("If all enemy ships are hit, gameboard should return player as winner", () => {
	const player = "player";
	const player2 = "player2";
	const gameboard = new Gameboard(player, player2, 3, 3);
	gameboard.placeShip(player, "X", 1, [0,0]);
	gameboard.placeShip(player, "X", 1, [1,0]);
	gameboard.placeShip(player, "X", 1, [2,0]);
	gameboard.placeShip(player2, "X", 1, [0,1]);
	gameboard.placeShip(player2, "X", 1, [1,1]);
	gameboard.placeShip(player2, "X", 1, [2,1]);
	gameboard.recieveAttack(player, [0,1]);
	gameboard.recieveAttack(player, [1,1]);
	gameboard.recieveAttack(player, [2,1]);
	expect(gameboard.getWinner()).toBe(player);
});

test("If all player ships are hit, gameboard should return enemy as winner", () => {
	const player = "player";
	const player2 = "player2";
	const gameboard = new Gameboard(player, player2, 3, 3);
	gameboard.placeShip(player, "X", 1, [0,0]);
	gameboard.placeShip(player, "X", 1, [1,0]);
	gameboard.placeShip(player, "X", 1, [2,0]);
	gameboard.placeShip(player2, "X", 1, [0,1]);
	gameboard.placeShip(player2, "X", 1, [1,1]);
	gameboard.placeShip(player2, "X", 1, [2,1]);
	gameboard.recieveAttack(player2, [0,0]);
	gameboard.recieveAttack(player2, [1,0]);
	gameboard.recieveAttack(player2, [2,0]);
	expect(gameboard.getWinner()).toBe(player2);
});

test("If player sinks ship, score should increment", () => { 
	const player = "player";
	const player2 = "player2";
	const gameboard = new Gameboard(player, player2, 3, 3);
	gameboard.placeShip(player, "X", 1, [0,0]);
	gameboard.placeShip(player2, "X", 1, [0,1]);
	gameboard.recieveAttack(player, [0,1]);
	expect(gameboard.playerScore).toBe(1);
});

test("If enemy sinks ship, score should increment", () => {
	const player = "player";
	const player2 = "player2";
	const gameboard = new Gameboard(player, player2, 3, 3);
	gameboard.placeShip(player, "X", 1, [0,0]);
	gameboard.placeShip(player2, "X", 1, [0,1]);
	gameboard.recieveAttack(player2, [0,0]);
	expect(gameboard.computerScore).toBe(1);
});