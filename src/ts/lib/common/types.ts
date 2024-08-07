/**
 * A type that represents a type that is distinct from its base type while still
 * being compatible with it.
 *
 * @typeParam T - The base type to create the distinct type from.
 */
export type Distinct<T> = T & {readonly __distinct__: unique symbol};
