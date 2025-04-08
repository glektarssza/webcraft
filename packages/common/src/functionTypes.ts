/**
 * A module which defines various function-related typings.
 *
 * @module
 */

/**
 * A function that takes one argument and optionally returns a value.
 *
 * @typeParam A - The input type.
 * @typeParam R - The return type. Defaults to `void`.
 *
 * @param a - The input value.
 *
 * @returns An optional return value.
 */
export type UnaryFunction<A, R = void> = (a: A) => R;

/**
 * A function that takes two arguments and optionally returns a value.
 *
 * @typeParam A - The first input type.
 * @typeParam B - The second input type.
 * @typeParam R - The return type. Defaults to `void`.
 *
 * @param a - The first input value.
 * @param b - The second input value.
 *
 * @returns An optional return value.
 */
export type BinaryFunction<A, B, R = void> = (a: A, b: B) => R;

/**
 * A function that takes two arguments and optionally returns a value.
 *
 * @typeParam A - The first input type.
 * @typeParam B - The second input type.
 * @typeParam C - The third input type.
 * @typeParam R - The return type. Defaults to `void`.
 *
 * @param a - The first input value.
 * @param b - The second input value.
 * @param c - The third input value.
 *
 * @returns An optional return value.
 */
export type TrinaryFunction<A, B, C, R = void> = (a: A, b: B, c: C) => R;

/**
 * A unary function which checks a value against some condition and returns a
 * boolean indicating if it matches.
 *
 * @typeParam V - The input type.
 *
 * @param value - The accepted value.
 *
 * @returns `true` if the value matches the check; `false` otherwise.
 */
export type Predicate<V> = UnaryFunction<V, boolean>;

/**
 * A unary function which maps a value into another value.
 *
 * @typeParam V - The input type.
 * @typeParam R - The returned type.
 *
 * @param value - The accepted value.
 *
 * @returns The mapped value.
 */
export type Mapper<V, R> = UnaryFunction<V, R>;

/**
 * A trinary function which maps a value into another value and also passes the
 * index of the array being processed along with the value.
 *
 * @typeParam V - The input type.
 * @typeParam R - The returned type.
 *
 * @param value - The accepted value.
 * @param index - The index into the array being processed.
 * @param array - The array being processed.
 *
 * @returns The mapped value.
 */
export type IndexedMapper<V, R> = TrinaryFunction<V, number, V[], R>;
