import Ship from "../src/modules/ship";


test("Ship can be hit", () => {
	const ship = new Ship(2, "X");
	expect(ship.hit()).toBe(true);
});

test("Ship is sunk when hit for its total length", () => {
	const ship = new Ship(2, "X");
	expect(ship.isSunk()).toBe(false);
	ship.hit();
	expect(ship.isSunk()).toBe(false);
	ship.hit();
	expect(ship.isSunk()).toBe(true);
});
