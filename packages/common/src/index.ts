/**
 * The main entry point for the common package.
 */
const m = {
    /**
     * Get the greeting message.
     *
     * @returns The greeting message.
     */
    getMessage(): string {
        return 'Hello, world!';
    }
};

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
export const {getMessage} = m;
/* eslint-enable no-empty-pattern, @typescript-eslint/unbound-method */
