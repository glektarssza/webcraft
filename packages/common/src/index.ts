export {ArgumentError, BaseError} from './errors';

/**
 * A module which contains common code and utilities for the Webcraft project.
 */
const m = {};

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

/* eslint-disable no-empty-pattern */
export const {} = m;
/* eslint-enable no-empty-pattern */
