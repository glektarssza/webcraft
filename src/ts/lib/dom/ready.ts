/**
 * The global object.
 */
let globalObject: typeof globalThis = globalThis;

/**
 * Set the global object for unit testing.
 *
 * @param go - The global object to be used.
 */
export function setGlobalObject(go: typeof globalThis): void {
    globalObject = go;
}

/**
 * Reset the global object for unit testing.
 */
export function resetGlobalObject(): void {
    globalObject = globalThis;
}

/**
 * Check if the global {@link Document} is ready to be manipulated.
 *
 * @returns `true` if the global {@link Document} is ready to be
 * manipulated; `false` otherwise.
 */
export function isDocumentReady(): boolean {
    return globalObject.document.readyState === 'complete';
}

/**
 * Wait for the global {@link Document} to be ready to be manipulated.
 *
 * @param timeout - The maximum duration, in milliseconds, to wait for the
 * global {@link Document} to be ready to be manipulated. A negative,
 * non-finite, or non-numerical value will be treated as an indefinite
 * timeout.
 *
 * @returns A promise that resolves when the global {@link Document} is
 * ready to be manipulated or rejects if a timeout is provided and was
 * reached before the global {@link Document} became ready to be
 * manipulated.
 */
export async function waitForDocumentReady(
    timeout: number = Infinity
): Promise<void> {
    if (isDocumentReady()) {
        return;
    }
    await new Promise<void>((resolve, reject): void => {
        if (isDocumentReady()) {
            resolve();
            return;
        }
        let timeoutId: number | null = null;
        const listener = (): void => {
            if (isDocumentReady()) {
                if (timeoutId !== null) {
                    globalObject.clearTimeout(timeoutId);
                }
                globalObject.document.removeEventListener(
                    'readystatechange',
                    listener
                );
                resolve();
                return;
            }
        };
        if (isFinite(timeout) && timeout >= 0) {
            timeoutId = globalObject.setTimeout((): void => {
                globalObject.document.removeEventListener(
                    'readystatechange',
                    listener
                );
                reject(
                    new Error(
                        `Document did not become ready to manipulate within ${timeout} ms`
                    )
                );
            }, timeout);
        }
        globalObject.document.addEventListener('readystatechange', listener);
    });
}
