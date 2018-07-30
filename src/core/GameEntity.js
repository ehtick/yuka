/**
 * @author Mugen87 / https://github.com/Mugen87
 */

import { Vector3 } from '../math/Vector3.js';
import { Quaternion } from '../math/Quaternion.js';
import { Matrix4 } from '../math/Matrix4.js';

let nextId = 0;

class GameEntity {

	constructor() {

		this.id = nextId ++;
		this.name = '';

		this.active = true;

		this.position = new Vector3();
		this.rotation = new Quaternion();
		this.scale = new Vector3( 1, 1, 1 );

		this.forward = new Vector3( 0, 0, 1 );
		this.up = new Vector3( 0, 1, 0 );

		this.boundingRadius = 0;

		this.matrix = new Matrix4();

		this.manager = null;

	}

	start() {}

	update() {}

	sendMessage( receiver, message, delay = 0, data = null ) {

		this.manager.sendMessage( this, receiver, message, delay, data );

	}

	handleMessage() {

		return false;

	}

	updateMatrix() {

		this.matrix.compose( this.position, this.rotation, this.scale );

	}

}

export { GameEntity };
