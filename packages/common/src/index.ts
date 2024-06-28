/**
 * A type which represents a version of an existing type that is considered
 * distinct from other instances of that type while still being interoperable
 * with them.
 *
 * @typeParam T - The underlying type to make the distinct type out of.
 */
export type Distinct<T> = T & {readonly __TYPE__: unique symbol};
