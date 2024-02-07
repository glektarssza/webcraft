/**
 * A function that tests some value against some condition.
 *
 * @typeParam T - The type of the value being tested.
 *
 * @param value - The value to test.
 *
 * @returns `true` if the value passed the test; `false` otherwise.
 */
export type Predicate<T> = (value: T) => boolean;

/**
 * Map a value into another type of value.
 *
 * @typeParam T - The type of value being mapped.
 * @typeParam U - The type of value to map the value into.
 *
 * @param value - The value to map.
 *
 * @returns The mapped value.
 */
export type Mapper<T, U> = (value: T) => U;
