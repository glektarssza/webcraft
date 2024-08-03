/**
 * A type that is distinct from its base type while being compatible with it.
 *
 * @typeParam T - The base type to create a distinct type from.
 */
export type Distinct<T> = T & {readonly __TYPE__: unique symbol};
