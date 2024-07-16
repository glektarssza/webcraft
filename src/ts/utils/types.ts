/**
 * A type which is considered distinct but still interoperable from the base
 * type.
 *
 * @typeParam T - The base type to turn into a distinct type.
 */
export type Distinct<T> = T & {readonly __TYPE__: unique symbol};

/**
 * Check whether a value is a string.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is a string; `false` otherwise.
 */
export function isString(value: unknown): value is string {
    return typeof value === 'string';
}
