/**
 * @author Mugen87 / https://github.com/Mugen87
 */

import { HalfEdge } from './HalfEdge.js';
import { Vector3 } from '../../math/Vector3.js';
import { Logger } from '../../core/Logger.js';

class Polygon {

	constructor() {

		this.centroid = new Vector3();
		this.edge = null;

	}

	fromContour( points ) {

		// create edges from points (assuming CCW order)

		const edges = [];

		if ( points.length < 3 ) {

			Logger.error( 'YUKA.Polygon: Unable to create polygon from contour. It needs at least three points.' );
			return this;

		}

		for ( let i = 0, l = points.length; i < l; i ++ ) {

			const edge = new HalfEdge( points[ i ] );
			edges.push( edge );

		}

		// link edges

		for ( let i = 0, l = edges.length; i < l; i ++ ) {

			let current, prev, next;

			if ( i === 0 ) {

				current = edges[ i ];
				prev = edges[ l - 1 ];
			 	next = edges[ i + 1 ];

			} else if ( i === ( l - 1 ) ) {

				current = edges[ i ];
			 	prev = edges[ i - 1 ];
				next = edges[ 0 ];

			} else {

			 	current = edges[ i ];
				prev = edges[ i - 1 ];
				next = edges[ i + 1 ];

			}

			current.prev = prev;
			current.next = next;
			current.polygon = this;

		}

		//

		this.edge = edges[ 0 ];

		return this;

	}

	computeCentroid() {

		const centroid = this.centroid;
		let edge = this.edge;
		let count = 0;

		centroid.set( 0, 0, 0 );

		do {

			centroid.add( edge.from() );

			count ++;

			edge = edge.next;

		} while ( edge !== this.edge );

		centroid.divideScalar( count );

		return this;

	}

	contains( point, epsilon = 1e-3 ) {

		let edge = this.edge;

		let max = - Infinity;
		let min = Infinity;

		do {

			const v1 = edge.from();
			const v2 = edge.to();

			if ( leftOn( v1, v2, point ) === false ) {

				return false;

			}

			if ( v1.y > max ) max = v1.y;
			if ( v1.y < min ) min = v1.y;

			edge = edge.next;

		} while ( edge !== this.edge );

		// only return true if point is within the min/max y-range

		max += epsilon;
		min -= epsilon;

		return ( ( point.y <= max ) && ( point.y >= min ) );

	}

	convex() {

		let edge = this.edge;

		do {

			const v1 = edge.from();
			const v2 = edge.to();
			const v3 = edge.next.to();

			if ( leftOn( v1, v2, v3 ) === false ) {

				return false;

			}

			edge = edge.next;

		} while ( edge !== this.edge );

		return true;

	}

}

// from the book "Computational Geometry in C, Joseph O'Rourke"

function leftOn( a, b, c ) {

	return area( a, b, c ) >= 0;

}

function area( a, b, c ) {

	return ( ( c.x - a.x ) * ( b.z - a.z ) ) - ( ( b.x - a.x ) * ( c.z - a.z ) );

}

export { Polygon };
