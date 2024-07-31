/**
 * A type that is considered distinct from its base type while being compatible
 * with it.
 *
 * @typeParam T - The base type to create a distinct type from.
 */
export type Distinct<T> = T & {readonly __TYPE__: unique symbol};

/**
 * An interface for objects that manage some sort of resource(s) and must be
 * told to release them.
 */
export interface Disposable {
    /**
     * Dispose of this instance and the resource(s) it is managing.
     *
     * This method must never produce an error.
     */
    dispose(): void;
}

/**
 * An interface for objects that can be cloned into a new object.
 *
 * @typeParam T - The type of object produced by cloning objects that implement
 * this interface.
 */
export interface Cloneable<T> {
    /**
     * Clone this instance.
     *
     * @returns A new object that is a clone of this instance.
     */
    clone(): T;
}
