/**
 * Check whether a {@link Document} is ready to be manipulated.
 *
 * @param document - The {@link Document} to check.
 *
 * @returns `true` if the {@link Document} is ready to be manipulated; `false`
 * otherwise.
 */
export function isDocumentReady(document: Document): boolean {
    return document.readyState === 'complete';
}

/**
 * Wait for a {@link Document} to become ready to manipulate.
 *
 * @param document - The {@link Document} to wait to become ready.
 * @param timeout - The maximum duration, in milliseconds, to wait before
 * failing. A negative, non-finite, or non-numeric value is treated as an
 * indefinite waiting period.
 *
 * @returns A promise that resolves when the {@link Document} is ready to
 * manipulate or rejects if a timeout is provided and reached.
 *
 * @throws `Error`
 * Thrown if a timeout is provided and reached.
 */
export async function waitForDocument(
    document: Document,
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
        if (isFinite(timeout) && timeout >= 0) {
            timer = setTimeout((): void => {
                document.removeEventListener('readystatechange', listener);
                reject(
                    new Error(
                        `Document did not become ready within ${timeout} ms`
                    )
                );
            }, timeout);
        }
        document.addEventListener('readystatechange', listener);
    });
}
