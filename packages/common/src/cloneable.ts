/**
 * An interface for objects that can be cloned.
 *
 * @typeParam T - The type of the object implementing this interface
 */
export interface Cloneable<T> {
    /**
     * Clone this instance.
     *
     * @returns A clone of this instance.
     */
    clone(): T;
}
