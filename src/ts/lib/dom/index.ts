//-- Project Code
import type {TimeoutID} from './types';
import {getInternalModule as getEventsModule} from './events';
import {getInternalModule as getTimersModule} from './timers';

export type * from './types';

/**
 * A module which provides various DOM-related functionality.
 */
const m = {
    ...getTimersModule(),
    ...getEventsModule(),

    /**
     * Check whether the DOM is ready.
     *
     * @returns `true` if the DOM is ready; `false` otherwise.
     */
    isDOMReady(): boolean {
        return globalThis.document.readyState === 'complete';
    },

    /**
     * Wait for the DOM to become ready.
     *
     * @param timeout - The maximum duration, in milliseconds, to wait before
     * failing.
     *
     * @returns A promise that resolves once the DOM is ready or rejects if any
     * errors occur.
     *
     * @throws `Error`
     * Thrown if a timeout is provided and was reached before the DOM became
     * ready.
     */
    async waitForDOMReady(timeout = Infinity): Promise<void> {
        if (m.isDOMReady()) {
            return;
        }
        await new Promise<void>((resolve, reject): void => {
            if (m.isDOMReady()) {
                resolve();
                return;
            }
            let timer: TimeoutID | null = null;
            const listener = (): void => {
                if (m.isDOMReady()) {
                    if (timer !== null) {
                        m.clearTimeout(timer);
                    }
                    m.removeDocumentEventListener('readystatechange', listener);
                    resolve();
                    return;
                }
            };
            if (isFinite(timeout)) {
                timer = m.setTimeout((): void => {
                    m.removeDocumentEventListener('readystatechange', listener);
                    reject(
                        new Error(
                            `DOM did not become ready within ${timeout} ms`
                        )
                    );
                }, timeout);
            }
            m.addDocumentEventListener('readystatechange', listener);
        });
    }
};

/**
 * Get the internal module for use in unit tests.
 *
 * @returns The internal module.
 */
export function getInternalModule(): typeof m {
    return m;
}

/* eslint-disable @typescript-eslint/unbound-method */
export const {
    addDocumentEventListener,
    addWindowEventListener,
    cancelAnimationFrame,
    clearInterval,
    clearTimeout,
    isDOMReady,
    removeDocumentEventListener,
    removeWindowEventListener,
    requestAnimationFrame,
    setInterval,
    setTimeout,
    waitForDOMReady
} = m;
/* eslint-enable @typescript-eslint/unbound-method */
