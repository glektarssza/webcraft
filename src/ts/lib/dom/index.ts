//-- Project Code
export * from './types';
export * from './timers';
export * from './events';

/**
 * A module which provides various DOM-related functionality.
 */
const m = {};

/**
 * Get the internal module for use in unit tests.
 *
 * @returns The internal module.
 */
export function getInternalModule(): typeof m {
    return m;
}

/* eslint-disable no-empty-pattern */
export const {} = m;
/* eslint-enable no-empty-pattern */
