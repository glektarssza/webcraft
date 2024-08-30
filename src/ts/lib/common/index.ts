/**
 * A type that is distinct from its base type while still being compatible with
 * it.
 *
 * @typeParam TBase - The base type to make a distinct type from.
 */
export type Distinct<TBase> = TBase & {readonly __distinct: unique symbol};
