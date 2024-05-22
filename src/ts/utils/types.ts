/**
 * The return type of the `setTimeout` and `setInterval` methods.
 */
export type TimerID = ReturnType<(typeof globalThis)['setTimeout']>;

/**
 * A module which provides various type-related functionality.
 */
const m = {};

/**
 * Get the internal module for unit testing.
 *
 * @returns The internal module.
 *
 * @internal
 */
export function getInternalModule(): typeof m {
    return m;
}

/* eslint-disable no-empty-pattern, @typescript-eslint/unbound-method */
export const {} = m;
/* eslint-enable no-empty-pattern, @typescript-eslint/unbound-method */
