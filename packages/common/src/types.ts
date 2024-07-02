/**
 * A type which represents a version of an existing type that is considered
 * distinct from other instances of that type while still being interoperable
 * with them.
 *
 * @typeParam T - The underlying type to make the distinct type out of.
 */
export type Distinct<T> = T & {readonly __TYPE__: unique symbol};

/**
 * A module which provides various utility typings.
 */
const m = {};

/**
 * Get the internal module object for this module.
 *
 * @returns The internal module object for this module.
 *
 * @internal
 */
export function getInternalModule(): typeof m {
    return m;
}

// eslint-disable-next-line no-empty-pattern
export const {} = m;
