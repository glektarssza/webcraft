/**
 * A type which represents another type that overlaps with other types but is
 * considered a distinct type.
 *
 * This type is used to create a distinct type from another type where the two
 * types are considered the same by TypeScript. For example, type string type
 * and a string containing a UUID.
 */
export type Distinct<T> = T & {readonly __TYPE__: unique symbol};

/**
 * A module which provides common utility types.
 */
const m = {};

/**
 * Get the internal module for unit testing.
 *
 * @returns The internal module.
 *
 * @internal
 */
export function getInternalModule(): typeof m {
    return m;
}

/* eslint-disable no-empty-pattern, @typescript-eslint/unbound-method */
export const {} = m;
/* eslint-enable no-empty-pattern, @typescript-eslint/unbound-method */
