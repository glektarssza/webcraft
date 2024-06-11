//-- Project Code
import type {Vertex} from './types';

/**
 * An object which describes some 3D shape.
 */
export interface Geometry {
    /**
     * An array of vertex positions that compose the geometry.
     */
    vertices: Vertex[];
}

/**
 * A module which provides various geometry-related functionality.
 */
const m = {
    createCubeGeometry(width: number, height: number, depth: number): Geometry {
        return {
            // prettier-ignore
            vertices: [
                //-- Front Face
                [0,     0,      0],
                [width, 0,      0],
                [width, height, 0],

                [0,     0,      0],
                [0,     height, 0],
                [width, height, 0],

                //-- Back Face
                [0,     0,      depth],
                [width, 0,      depth],
                [width, height, depth],

                [0,     0,      depth],
                [0,     height, depth],
                [width, height, depth],

                //-- Top Face
                [0,     height, 0],
                [0,     height, depth],
                [width, height, depth],

                [0,     height, 0],
                [width, height, 0],
                [width, height, depth],

                //-- Bottom Face
                [0,     0, 0],
                [0,     0, depth],
                [width, 0, depth],

                [0,     0, 0],
                [width, 0, 0],
                [width, 0, depth],

                //-- Left Face
                [0, 0,      0],
                [0, 0,      depth],
                [0, height, depth],
            ] as Vertex[]
        };
    }
};

/**
 * Get the internal module for use in unit tests.
 *
 * @returns The internal module.
 */
export function getInternalModule(): typeof m {
    return m;
}

/* eslint-disable no-empty-pattern */
export const {} = m;
/* eslint-enable no-empty-pattern */
