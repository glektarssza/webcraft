/**
 * A type which is considered distinct from other, normally overlapping, types.
 *
 * @typeParam T - The base type which will be made distinct.
 */
export type Distinct<T> = T & {readonly __TYPE__: unique symbol};

/**
 * A function that can be used to inspect a value.
 *
 * @typeParam T - The type of the value to inspect.
 *
 * @param value - The value to inspect.
 */
export type Inspector<T> = (value: T) => void;

/**
 * An object that can be cloned.
 */
export interface Cloneable<T> {
    /**
     * Clone this instance.
     *
     * @returns A clone of this instance.
     */
    clone(): T;
}

/**
 * A function that can be used to map one type into another type.
 *
 * @typeParam T - The type to map from.
 * @typeParam U - The type to map to.
 *
 * @param value - The value to map.
 *
 * @returns The mapped value.
 */
export type Mapper<T, U> = (value: T) => U;

/**
 * A function that can be used to check if a value satisfies some condition.
 *
 * @typeParam T - The type of the value to check.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value satisfies the condition; `false` otherwise.
 */
export type Predicate<T> = (value: T) => boolean;

/**
 * A module which provides utility typings.
 */
const m = {};

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
