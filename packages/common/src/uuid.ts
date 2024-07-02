//-- NPM Packages
import {v4, validate} from 'uuid';

//-- Project Code
import type {Distinct} from './types';

/**
 * A unique identifier.
 */
export type UUID = Distinct<string>;

/**
 * A module which provides various UUID-related functionality.
 */
const m = {
    /**
     * Create a new UUID.
     *
     * @returns A new UUID.
     */
    createUUID(): UUID {
        return v4() as UUID;
    },

    /**
     * Check whether a value is a UUID.
     *
     * @param - The value to check.
     *
     * @returns Whether a value is a UUID.
     */
    isUUID(value: unknown): value is UUID {
        return typeof value === 'string' && validate(value);
    }
};

/**
 * Get the internal module object for this module.
 *
 * @returns The internal module object for this module.
 *
 * @internal
 */
export function getInternalModule(): typeof m {
    return m;
}

/* eslint-disable @typescript-eslint/unbound-method */
export const {createUUID, isUUID} = m;
/* eslint-enable @typescript-eslint/unbound-method */
