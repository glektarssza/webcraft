//-- NPM Packages
import {v4 as uuidV4, validate} from 'uuid';

//-- Project Code
import type {Distinct} from './types';

/**
 * A simple unique identifier type.
 */
export type UUID = Distinct<string>;

/**
 * A module which provides utility functionality related to UUIDs.
 */
const m = {
    /**
     * Create a new unique identifier.
     *
     * @returns A new unique identifier.
     */
    createUUID(): UUID {
        return uuidV4() as UUID;
    },

    /**
     * Check if a value is a unique identifier.
     *
     * @param value - The value to check.
     *
     * @returns `true` if the value is a unique identifier; `false` otherwise.
     */
    isUUID(value: unknown): value is UUID {
        return typeof value === 'string' && validate(value);
    }
};

/**
 * Get the internal module for use in unit tests.
 *
 * @returns The internal module.
 *
 * @internal
 */
export function getInternalModule(): typeof m {
    return m;
}

/* eslint-disable @typescript-eslint/unbound-method */
export const {createUUID, isUUID} = m;
/* eslint-enable @typescript-eslint/unbound-method */
