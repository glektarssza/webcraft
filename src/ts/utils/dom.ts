//-- Project Code
import type {TimerID} from './types';

/**
 * A module which provides various DOM-related functionality.
 */
const m = {
    /**
     * Wait for the DOM to become ready to manipulate.
     *
     * @param timeout - The duration to wait, in milliseconds, before failing.
     * Negative, non-finite, and non-numerical values will be treated as an
     * infinite duration.
     *
     * @returns A promise that resolves once the DOM is ready to manipulate or
     * rejects if the timeout is provided and reached.
     *
     * @throws `Error`
     * Thrown if the timeout is provided and reached.
     */
    async waitForDOMReady(timeout = Infinity): Promise<void> {
        if (document.readyState === 'complete') {
            return;
        }
        await new Promise<void>((resolve, reject): void => {
            if (document.readyState === 'complete') {
                resolve();
                return;
            }
            let timer: TimerID | null = null;
            const listener = (): void => {
                if (document.readyState === 'complete') {
                    if (timer !== null) {
                        clearTimeout(timer);
                    }
                    document.removeEventListener('readystatechange', listener);
                    resolve();
                }
            };
            if (isFinite(timeout) && timeout >= 0) {
                timer = setTimeout((): void => {
                    document.removeEventListener('readystatechange', listener);
                    reject(
                        new Error(
                            `DOM did not become ready within ${timeout} ms`
                        )
                    );
                }, timeout);
            }
            document.addEventListener('readystatechange', listener);
        });
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
export const {waitForDOMReady} = m;
/* eslint-enable no-empty-pattern, @typescript-eslint/unbound-method */
