export {BaseError} from './baseError';
export {ArgumentError} from './argumentError';

/**
 * A module which contains the custom error classes.
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
