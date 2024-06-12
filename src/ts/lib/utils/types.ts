/**
 * A type which is considered distinct from other, normally overlapping, types.
 *
 * @typeParam T - The base type which will be made distinct.
 */
export type Distinct<T> = T & {readonly __TYPE__: unique symbol};

/**
 * A module which provides various utility typings.
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
