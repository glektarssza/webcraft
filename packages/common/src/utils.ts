/**
 * A module which contains some common utility functions for the Webcraft
 * project.
 */
const m = {
    /**
     * Check if a value is an array is composed only of objects of a given type.
     *
     * @typeParam T - The type the array items are being checked against.
     * @param value - The value to check.
     * @param type - The constructor to check object types against.
     *
     * @returns `true` if the value is an array and composed only of objects
     * that are instances of the given type; `false` otherwise.
     */
    isArrayOfType<T>(
        value: unknown,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type: new (...args: any[]) => T
    ): value is T[] {
        if (!Array.isArray(value)) {
            return false;
        }
        return value.every((item) => item instanceof type);
    }
};

/**
 * Get the module object for use in unit tests.
 *
 * @returns The module object for use in unit tests.
 *
 * @internal
 */
export function getTestModule() {
    return m;
}

/* eslint-disable no-empty-pattern,@typescript-eslint/unbound-method */
export const {isArrayOfType} = m;
/* eslint-enable no-empty-pattern,@typescript-eslint/unbound-method */
