/**
 * A module which provides some common array-related operations.
 *
 * @module
 */

/**
 * A type alias for taking a set of arrays, extracting their types, and converting
 * them into the appropriate tuple types for use with the {@link zip} function.
 */
export type Zipped<T extends unknown[][]> = {[I in keyof T]: T[I][number]};

/**
 * Zip two arrays together into a single array containing tuples, each of which
 * contains a pair of elements from each zipped array or `null` if the array
 * contained no value at that index.
 *
 * @typeParam T - The type of elements in the arrays.
 *
 * @param arrs - The arrays to zip.
 *
 * @returns A new array containing the arrays, zipped together.
 */
export function zip<T extends unknown[][]>(...arrays: T): Zipped<T>[] {
    const l = Math.max(...arrays.map((a) => a.length));
    const r: Zipped<T>[] = [];
    for (let i = 0; i < l; i += 1) {
        r.push(arrays.map((a) => a[i] ?? null) as Zipped<T>);
    }
    return r;
}
