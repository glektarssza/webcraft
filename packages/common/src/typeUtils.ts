/**
 * Get whether a value is `null`.
 *
 * @param value - The value to check.
 *
 * @returns Whether the value is `null`.
 */
export function isNull(value: unknown): value is null {
    return value === null;
}

/**
 * Get whether a value is `undefined`.
 *
 * @param value - The value to check.
 *
 * @returns Whether the value is `undefined`.
 */
export function isUndefined(value: unknown): value is undefined {
    return value === undefined;
}

/**
 * Get whether a value is `null` or `undefined`.
 *
 * @param value - The value to check.
 *
 * @returns Whether the value is `null` or `undefined`.
 */
export function isNil(value: unknown): value is null | undefined {
    return isNull(value) || isUndefined(value);
}

/**
 * Get whether a value is a `string`.
 *
 * @param value - The value to check.
 *
 * @returns Whether the value is a `string`.
 */
export function isString(value: unknown): value is string {
    return typeof value === 'string';
}

/**
 * Get whether a value is an empty `string`.
 *
 * @param value - The value to check.
 *
 * @returns Whether the value is an empty `string`.
 */
export function isEmptyString(value: string): boolean {
    return value.length === 0;
}

/**
 * Get whether a value is a `string` containing only whitespace characters.
 *
 * @param value - The value to check.
 *
 * @returns Whether the value is a `string` containing only whitespace
 */
export function isWhitespaceString(value: string): boolean {
    return value.trim().length === 0;
}

/**
 * Get whether a value is an empty `string` or a `string` containing only
 * whitespace characters.
 *
 * @param value - The value to check.
 *
 * @returns Whether the value is an empty `string` or a `string` containing
 * only whitespace characters.
 */
export function isEmptyOrWhitespaceString(value: string): boolean {
    return isEmptyString(value) || isWhitespaceString(value);
}

/**
 * Get whether a value is a `boolean`.
 *
 * @param value - The value to check.
 *
 * @returns Whether the value is a `boolean`.
 */
export function isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean';
}

/**
 * Get whether a value is a `number`.
 *
 * @param value - The value to check.
 *
 * @returns Whether the value is a `number`.
 */
export function isNumber(value: unknown): value is number {
    return typeof value === 'number';
}

/**
 * Get whether a value is a `bigint`.
 *
 * @param value - The value to check.
 *
 * @returns Whether the value is a `bigint`.
 */
export function isBigInt(value: unknown): value is bigint {
    return typeof value === 'bigint';
}

/**
 * Get whether a value is a `symbol`.
 *
 * @param value - The value to check.
 *
 * @returns Whether the value is a `symbol`.
 */
export function isSymbol(value: unknown): value is symbol {
    return typeof value === 'symbol';
}

/**
 * Get whether a value is a `function`.
 *
 * @param value - The value to check.
 *
 * @returns Whether the value is a `function`.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(value: unknown): value is Function {
    return typeof value === 'function';
}

/**
 * Get whether a value is an `object`.
 *
 * @param value - The value to check.
 *
 * @returns Whether the value is an `object`.
 */
export function isObject(value: unknown): value is object {
    return typeof value === 'object' && !isNull(value);
}

/**
 * Get whether a value is a plain `object`.
 *
 * @param value - The value to check.
 *
 * @returns Whether the value is a plain `object`.
 */
export function isPlainObject(value: unknown): value is object {
    return isObject(value) && Object.getPrototypeOf(value) === Object.prototype;
}

/**
 * Get whether a value is a `Date`.
 *
 * @param value - The value to check.
 *
 * @returns Whether the value is a `Date`.
 */
export function isDate(value: unknown): value is Date {
    return value instanceof Date;
}

/**
 * Get whether a value is an `Array`.
 *
 * @param value - The value to check.
 *
 * @returns Whether the value is an `Array`.
 */
export function isArray(value: unknown): value is unknown[] {
    return Array.isArray(value);
}

/**
 * Get whether a value is an `Error`.
 *
 * @param value - The value to check.
 *
 * @returns Whether the value is an `Error`.
 */
export function isError(value: unknown): value is Error {
    return value instanceof Error;
}

/**
 * Get whether a value is a `RegExp`.
 *
 * @param value - The value to check.
 *
 * @returns Whether the value is a `RegExp`.
 */
export function isRegExp(value: unknown): value is RegExp {
    return value instanceof RegExp;
}
