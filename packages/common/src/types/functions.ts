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
 * @param value1 - The first value accepted by the function.
 * @param value2 - The second value accepted by the function.
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
 * @param value1 - The first value accepted by the function.
 * @param value2 - The second value accepted by the function.
 * @param value3 - The third value accepted by the function.
 *
 * @returns An optional return value.
 */
export type TrinaryFunction<V1, V2, V3, R = void> = (
    value1: V1,
    value2: V2,
    value3: V3
) => R;

/**
 * A function that accepts four values and optionally returns a value.
 *
 * @typeParam V1 - The type of the first value accepted by the function.
 * @typeParam V2 - The type of the second value accepted by the function.
 * @typeParam V3 - The type of the third value accepted by the function.
 * @typeParam V4 - The type of the fourth value accepted by the function.
 * @typeParam R - The type of the value returned by the function.
 *
 * @param value1 - The first value accepted by the function.
 * @param value2 - The second value accepted by the function.
 * @param value3 - The third value accepted by the function.
 * @param value4 - The fourth value accepted by the function.
 *
 * @returns An optional return value.
 */
export type QuadrinaryFunction<V1, V2, V3, V4, R = void> = (
    value1: V1,
    value2: V2,
    value3: V3,
    value4: V4
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

/**
 * A function that maps one value type into another value type and also includes
 * the index into as well as the array-like collection being mapped.
 *
 * @typeParam V - The type of the value that the function is mapping from.
 * @typeParam R - The type of the value that the function is mapping into.
 *
 * @param value1 - The value to map into another type.
 * @param value2 - The index in the array-like collection which is currently
 * being processed.
 * @param value3 - The array-like collection which is currently being processed.
 *
 * @returns The mapped value.
 */
export type IndexedMapper<V, R> = TrinaryFunction<V, number, ArrayLike<V>, R>;

/**
 * A function that reduces a collection of values into a single value.
 *
 * @typeParam V - The type of the value that the collection contains.
 * @typeParam R - The type of the value that the collection is being reduced to.
 *
 * @param value1 - The value currently being processed.
 * @param value2 - The accumlated value of all previous iterations of the
 * function.
 *
 * @returns The accumlated value of all iterations of the function.
 */
export type Reducer<V, R> = BinaryFunction<V, R, R>;

/**
 * A function that reduces a collection of values into a single value and also
 * includes the index into as well as the array-like collection being reduced.
 *
 * @typeParam V - The type of the value that the collection contains.
 * @typeParam R - The type of the value that the collection is being reduced to.
 *
 * @param value1 - The value currently being processed.
 * @param value2 - The accumlated value of all previous iterations of the
 * function.
 * @param value3 - The index in the array-like collection which is currently
 * being processed.
 * @param value4 - The array-like collection which is currently being processed.
 *
 * @returns The accumlated value of all iterations of the function.
 */
export type IndexedReducer<V, R> = QuadrinaryFunction<
    V,
    R,
    number,
    ArrayLike<V>,
    R
>;
