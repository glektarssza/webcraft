//-- Project Code
import type {VertexArray} from './vertex';

/**
 * An object that provides some arbitrary 3D geometry.
 */
export interface Geometry {
    /**
     * The vertices of the instance.
     */
    readonly vertices: VertexArray;

    /**
     * An optional array of indices to use for indexing the vertex array.
     */
    readonly indices?: number[];
}

/**
 * Create {@link Geometry} for a triangle of a given size.
 *
 * @param width - The width of the base of the triangle.
 * @param height - The height of the tip of the triangle.
 *
 * @returns A new {@link Geometry} instance containing the triangle geometry.
 */
export function createTriangleGeometry(
    width: number = 1,
    height: number = 1
): Geometry {
    return {
        vertices: [
            [-width / 2, -height / 2, 0],
            [width / 2, -height / 2, 0],
            [0, height / 2, 0]
        ],
        indices: [0, 1, 2]
    };
}

/**
 * Create {@link Geometry} for a right-angle triangle of a given size.
 *
 * @param width - The width of the base of the triangle.
 * @param height - The height of the tip of the triangle.
 *
 * @returns A new {@link Geometry} instance containing the right-angle triangle
 * geometry.
 */
export function createRightAngleTriangleGeometry(
    width: number = 1,
    height: number = 1
): Geometry {
    return {
        vertices: [
            [-width / 2, -height / 2, 0],
            [width / 2, -height / 2, 0],
            [-width / 2, height / 2, 0]
        ],
        indices: [0, 1, 2]
    };
}

/**
 * Create {@link Geometry} for a square of a given size.
 *
 * @param width - The width of the square.
 * @param height - The height of the square.
 *
 * @returns A new {@link Geometry} instance containing the square geometry.
 */
export function createSquareGeometry(
    width: number = 1,
    height: number = 1
): Geometry {
    return {
        vertices: [
            [-width / 2, -height / 2, 0],
            [width / 2, -height / 2, 0],
            [-width / 2, height / 2, 0],
            [width / 2, height / 2, 0]
        ],
        indices: [0, 1, 2, 1, 3, 2]
    };
}

/**
 * Create {@link Geometry} for a cube of a given size.
 *
 * @param width - The width of the cube.
 * @param height - The height of the cube.
 * @param depth - The depth of the cube.
 *
 * @returns A new {@link Geometry} instance containing the cube geometry.
 */
export function createCubeGeometry(
    width: number = 1,
    height: number = 1,
    depth: number = 1
): Geometry {
    return {
        vertices: [
            [-width / 2, -height / 2, depth / 2],
            [width / 2, -height / 2, depth / 2],
            [-width / 2, height / 2, depth / 2],
            [width / 2, height / 2, depth / 2],
            [-width / 2, -height / 2, -depth / 2],
            [width / 2, -height / 2, -depth / 2],
            [-width / 2, height / 2, -depth / 2],
            [width / 2, height / 2, -depth / 2]
        ],
        indices: [
            2, 6, 7, 2, 3, 7, 0, 4, 5, 0, 1, 5, 0, 2, 6, 0, 4, 6, 1, 3, 7, 1, 5,
            7, 0, 2, 3, 0, 1, 3, 4, 6, 7, 4, 5, 7
        ]
    };
}
