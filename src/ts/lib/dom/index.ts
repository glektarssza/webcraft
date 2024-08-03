export * from './timers';

/**
 * Check if a {@link Document} is ready to be manipulated.
 *
 * @param document - The document to check.
 *
 * @returns `true` if the document is ready to be manipulated, `false`
 * otherwise.
 */
export function isDocumentReady(
    document: Document = globalThis.document
): boolean {
    return document.readyState === 'complete';
}

/**
 * Wait for a {@link Document} to become ready to be manipulated.
 *
 * @param document - The document to wait for.
 * @param timeout - The maximum time to wait, in milliseconds. A non-finite,
 * negative, or non-numerical value will be treated as an indefinite wait
 * period.
 *
 * @returns A promise that resolves when the document is ready to be manipulated
 * or rejects if a timeout is provided and was reached.
 */
export async function awaitDocumentReady(
    document: Document = globalThis.document,
    timeout: number = Infinity
): Promise<void> {
    if (isDocumentReady(document)) {
        return;
    }
    await new Promise<void>((resolve, reject): void => {
        if (isDocumentReady(document)) {
            resolve();
            return;
        }
        let timer: number | null = null;
        const listener = (): void => {
            if (isDocumentReady(document)) {
                if (timer !== null) {
                    clearTimeout(timer);
                }
                document.removeEventListener('readystatechange', listener);
                resolve();
            }
        };
        if (isFinite(timeout) && timeout > 0) {
            timer = setTimeout((): void => {
                document.removeEventListener('readystatechange', listener);
                reject(
                    new Error(
                        `Document did not become ready to manipulate within ${timeout} ms`
                    )
                );
            }, timeout);
        }
        document.addEventListener('readystatechange', listener);
    });
}
