//-- NPM Packages
import flatten from 'lodash/flatten';

//-- Project Code
import type {Vertex} from './types';

/**
 * A module which provides various geometry-related functionality.
 */
const m = {
    /**
     * Convert some geometry to a typed array.
     *
     * @param geometry - The geometry to convert.
     *
     * @returns The geometry as a typed array.
     */
    geometryToTypedArray(geometry: Vertex[]): Float32Array {
        return new Float32Array(flatten(geometry));
    },

    /**
     * Create the geometry for a cube.
     *
     * @param width - The width of the cube, in world units.
     * @param height - The height of the cube, in world units.
     * @param depth - The depth of the cube, in world units.
     *
     * @returns The geometry for a cube.
     */
    createCubeGeometry(width = 1, height = 1, depth = 1): Vertex[] {
        // prettier-ignore
        return [
            //-- Back Face
            [0,     0,      0],
            [width, 0,      0],
            [width, height, 0],

            [0,     0,      0],
            [0,     height, 0],
            [width, height, 0],

            //-- Front Face
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

            [0, 0,      0],
            [0, height, 0],
            [0, height, depth],

            //-- Right Face
            [width, 0,      0],
            [width, 0,      depth],
            [width, height, depth],

            [width, 0,      0],
            [width, height, 0],
            [width, height, depth]
        ] as Vertex[];
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
