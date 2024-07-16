/**
 * A point in 3D space.
 */
export type Vertex = [number, number, number];

/**
 * An array of {@link Vertex} elements.
 */
export type VertexArray = Vertex[];

/**
 * An array of vertex data that has been tightly packed into a single stream of
 * 32-bit floating point numbers.
 */
export type PackedVertexArray = Float32Array;

/**
 * Pack a {@link VertexArray} into a {@link PackedVertexArray}.
 *
 * @param array - The {@link VertexArray} to pack.
 *
 * @returns A {@link PackedVertexArray}.
 */
export function packVertexArray(array: VertexArray): PackedVertexArray {
    const packed = new Float32Array(array.length * 3);
    array.forEach((vertex, i): void => {
        packed.set(vertex, i * 3);
    });
    return packed;
}
