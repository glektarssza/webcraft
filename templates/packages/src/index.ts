/**
 * A module which contains common code and utilities for the Webcraft project.
 */
const m = {
    /**
     * Get the string "Hello world!".
     *
     * @returns The string "Hello world!".
     */
    helloWorld(): string {
        return 'Hello world!';
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
export const {helloWorld} = m;
/* eslint-enable no-empty-pattern,@typescript-eslint/unbound-method */
