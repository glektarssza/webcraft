//-- NPM Packages
import {v1, v4, v6, v7, validate} from 'uuid';

//-- Project Code
import {Distinct} from './types';

/**
 * A universally unique identifier type.
 */
export type UUID = Distinct<string>;

/**
 * Create a new v1 UUID.
 *
 * @returns A new v1 UUID.
 */
export function createUUIDv1(): UUID {
    return v1() as UUID;
}

/**
 * Create a new v4 UUID.
 *
 * @returns A new v4 UUID.
 */
export function createUUIDv4(): UUID {
    return v4() as UUID;
}

/**
 * Create a new v6 UUID.
 *
 * @returns A new v6 UUID.
 */
export function createUUIDv6(): UUID {
    return v6() as UUID;
}

/**
 * Create a new v7 UUID.
 *
 * @returns A new v7 UUID.
 */
export function createUUIDv7(): UUID {
    return v7() as UUID;
}

/**
 * Create a new  UUID.
 *
 * @returns A new  UUID.
 */
export function createUUID(): UUID {
    return createUUIDv7();
}

/**
 * Check if a value is a UUID.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is a UUID; `false` otherwise.
 */
export function isUUID(value: unknown): value is UUID {
    return typeof value === 'string' && validate(value);
}
