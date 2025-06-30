/**
 * A module which provides some common array-related operations.
 *
 * @module
 */

/**
 * Zip two arrays together into a single array containing tuples, each of which
 * contains a pair of elements from each zipped array or `null` if the array
 * contained no value at that index.
 *
 * @typeParam T - The type of elements in the first array.
 * @typeParam S - The type of elements in the second     array.
 *
 * @param arr1 - The first array to zip.
 * @param arr2 - The second array to zip.
 *
 * @returns A new array containing the two arrays, zipped together.
 */
export function zip<T, S>(arr1: T[], arr2: S[]): [T | null, S | null][] {
    const l = Math.max(arr1.length, arr2.length);
    const r: [T | null, S | null][] = [];
    for (let i = 0; i < l; i += 1) {
        r.push([arr1[i] ?? null, arr2[i] ?? null]);
    }
    return r;
}
