//-- NPM Packages
import {v4, validate} from 'uuid';

//-- Project Code
import {isString, type Distinct} from '../utils/types';

/**
 * A universally unique identifier.
 */
export type UUID = Distinct<string>;

/**
 * Create a new UUID.
 *
 * @returns A new UUID.
 */
export function createUUID(): UUID {
    return v4() as UUID;
}

/**
 * Check whether a value is a valid UUID.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is a valid UUID; `false` otherwise.
 */
export function isUUID(value: unknown): value is UUID {
    return isString(value) && validate(value);
}
