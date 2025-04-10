/**
 * A module containing various function types.
 *
 * @module
 */

/**
 * A function that accepts a single value and optionally returns a value.
 *
 * @typeParam V - The type of the value accepted by the function.
 * @typeParam R - The type of the value returned by the function.
 *
 * @param value - The value accepted by the function.
 *
 * @returns An optional return value.
 */
export type UnaryFunction<V, R = void> = (value: V) => R;

/**
 * A function that accepts two values and optionally returns a value.
 *
 * @typeParam V1 - The type of the first value accepted by the function.
 * @typeParam V2 - The type of the second value accepted by the function.
 * @typeParam R - The type of the value returned by the function.
 *
 * @param value - The value accepted by the function.
 *
 * @returns An optional return value.
 */
export type BinaryFunction<V1, V2, R = void> = (value1: V1, value2: V2) => R;

/**
 * A function that accepts three values and optionally returns a value.
 *
 * @typeParam V1 - The type of the first value accepted by the function.
 * @typeParam V2 - The type of the second value accepted by the function.
 * @typeParam V3 - The type of the third value accepted by the function.
 * @typeParam R - The type of the value returned by the function.
 *
 * @param value - The value accepted by the function.
 *
 * @returns An optional return value.
 */
export type TrinaryFunction<V1, V2, V3, R = void> = (
    value1: V1,
    value2: V2,
    value3: V3
) => R;

/**
 * A function that accepts a value and returns whether that value matches some
 * condition.
 *
 * @typeParam V - The type of the value being checked.
 *
 * @param value - The value to be checked.
 *
 * @returns `true` if the provided value matches the condition being checked by
 * the function; `false` otherwise.
 */
export type Predicate<V> = UnaryFunction<V, boolean>;

/**
 * A function that maps one value type into another value type.
 *
 * @typeParam V - The type of the value that the function is mapping from.
 * @typeParam R - The type of the value that the function is mapping into.
 *
 * @param value - The value to map into another type.
 *
 * @returns The mapped value.
 */
export type Mapper<V, R> = UnaryFunction<V, R>;
