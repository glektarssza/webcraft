/**
 * The global scope object.
 */
let globalObject: typeof globalThis = globalThis;

/**
 * Sets the global scope object.
 *
 * This function is for use in unit tests only.
 *
 * @param object - The global scope object.
 *
 * @internal
 */
export function setGlobalObject(object: typeof globalThis): void {
    globalObject = object;
}

/**
 * Resets the global scope object.
 *
 * This function is for use in unit tests only.
 *
 * @internal
 */
export function resetGlobalObject(): void {
    globalObject = globalThis;
}

/**
 * Check if the DOM is ready to be manipulated.
 *
 * @returns `true` if the DOM is ready to be manipulated; `false` otherwise.
 */
export function isReady(): boolean {
    return globalObject.document.readyState === 'complete';
}

/**
 * Wait for the DOM to become ready to be manipulated.
 *
 * @param timeout - The maximum duration, in milliseconds, to wait for the DOM
 * to become ready to be manipulated. A negative, non-finite, or non-numeric
 * value will be treated as an indefinite duration.
 *
 * @returns A promise that resolves when the DOM is ready to be manipulated or
 * rejects if a timeout is provided and was reached before the DOM became ready
 * to be manipulated.
 */
export async function awaitReady(timeout: number = Infinity): Promise<void> {
    if (isReady()) {
        return;
    }
    await new Promise<void>((resolve, reject): void => {
        if (isReady()) {
            resolve();
            return;
        }
        let timer: number | null = null;
        const listener = (): void => {
            if (isReady()) {
                if (timer !== null) {
                    globalObject.clearTimeout(timer);
                }
                globalObject.document.removeEventListener(
                    'readystatechange',
                    listener
                );
                resolve();
            }
        };
        if (globalObject.isFinite(timeout) && timeout >= 0) {
            timer = globalObject.setTimeout((): void => {
                globalObject.document.removeEventListener(
                    'readystatechange',
                    listener
                );
                reject(
                    new Error(
                        `The DOM did not become ready within ${timeout} milliseconds`
                    )
                );
            });
        }
        globalObject.document.addEventListener('readystatechange', listener);
    });
}
