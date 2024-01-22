/**
 * A module which contains common type utilities for the Webcraft project.
 */
const m = {
    /**
     * Check if a value is strictly equal to `null`.
     *
     * @param value - The value to check.
     *
     * @returns `true` if the value is strictly equal to `null`; `false`
     * otherwise.
     */
    isNull(value: unknown): value is null {
        return value === null;
    },

    /**
     * Check if a value is strictly equal to `undefined`.
     *
     * @param value - The value to check.
     *
     * @returns `true` if the value is strictly equal to `undefined`; `false`
     * otherwise.
     */
    isUndefined(value: unknown): value is undefined {
        return value === undefined;
    },

    /**
     * Check if a value is strictly equal to `null` or `undefined`.
     *
     * @param value - The value to check.
     *
     * @returns `true` if the value is strictly equal to `null` or `undefined`;
     * `false` otherwise.
     */
    isNil(value: unknown): value is null | undefined {
        return value === undefined || value === null;
    },

    /**
     * Check if a value is a string.
     *
     * @param value - The value to check.
     *
     * @returns `true` if the value is a string; `false` otherwise.
     */
    isString(value: unknown): value is string {
        return typeof value === 'string';
    },

    /**
     * Check if a value is a boolean.
     *
     * @param value - The value to check.
     *
     * @returns `true` if the value is a boolean; `false` otherwise.
     */
    isBoolean(value: unknown): value is boolean {
        return typeof value === 'boolean';
    },

    /**
     * Check if a value is a number.
     *
     * @param value - The value to check.
     *
     * @returns `true` if the value is a number; `false` otherwise.
     */
    isNumber(value: unknown): value is number {
        return typeof value === 'number';
    },

    /**
     * Check if a value is a big integer.
     *
     * @param value - The value to check.
     *
     * @returns `true` if the value is a big integer; `false` otherwise.
     */
    isBigint(value: unknown): value is bigint {
        return typeof value === 'bigint';
    },

    /**
     * Check if a value is a function.
     *
     * @param value - The value to check.
     *
     * @returns `true` if the value is a function; `false` otherwise.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isFunction(value: unknown): value is (...args: any[]) => any {
        return typeof value === 'function';
    },

    /**
     * Check if a value is a symbol.
     *
     * @param value - The value to check.
     *
     * @returns `true` if the value is a symbol; `false` otherwise.
     */
    isSymbol(value: unknown): value is symbol {
        return typeof value === 'symbol';
    },

    /**
     * Check if a value is a non-null object.
     *
     * @param value - The value to check.
     *
     * @returns `true` if the value is a non-null object; `false` otherwise.
     */
    isObject(value: unknown): value is object {
        return typeof value === 'object' && value !== null;
    },

    /**
     * Check if a value is a plain object.
     *
     * @param value - The value to check.
     *
     * @returns `true` if the value is a plain object; `false` otherwise.
     */
    isPlainObject(value: object): boolean {
        return (
            value !== null &&
            (value.constructor === Object || value.constructor === undefined)
        );
    },

    /**
     * Check if a value is a regular expression object.
     *
     * @param value - The value to check.
     *
     * @returns `true` if the value is a regular expression object; `false`
     * otherwise.
     */
    isRegex(value: object): value is RegExp {
        return value instanceof RegExp;
    },

    /**
     * Check if a value is an error object.
     *
     * @param value - The value to check.
     *
     * @returns `true` if the value is an error object; `false` otherwise.
     */
    isError(value: object): value is Error {
        return value instanceof Error;
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
export const {
    isBigint,
    isBoolean,
    isError,
    isFunction,
    isNil,
    isNull,
    isNumber,
    isObject,
    isPlainObject,
    isRegex,
    isString,
    isSymbol,
    isUndefined
} = m;
/* eslint-enable no-empty-pattern,@typescript-eslint/unbound-method */
