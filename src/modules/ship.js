// Factory function to create a new ship with a given length and orientation

class Ship {
	constructor(length, orientation) {
		this.length = length;
		this.orientation = orientation;
		this.damage = 0;
	}

	hit() {
		this.damage += 1;
		return true;
	}

	isSunk() {
		return this.damage === this.length;
	}

	get orientation() {
		return this._orientation;
	}

	set orientation(value) {
		this._orientation = value;
	}
}

export default Ship;
