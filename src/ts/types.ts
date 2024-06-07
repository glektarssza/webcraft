/**
 * A type which is considered distinct from other matching types.
 *
 * @typeParam T - The type of create a distinct type from.
 */
export type Distinct<T> = T & {readonly __TYPE__: unique symbol};

/**
 * A module which provides utility functionality related to Typescript types.
 */
const m = {};

/**
 * Get the internal module for use in unit tests.
 *
 * @returns The internal module.
 *
 * @internal
 */
export function getInternalModule(): typeof m {
    return m;
}

/* eslint-disable no-empty-pattern */
export const {} = m;
/* eslint-enable no-empty-pattern */
