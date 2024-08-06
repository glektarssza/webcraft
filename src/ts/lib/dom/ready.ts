//-- Project Code
import {addDocumentEventListener, removeDocumentEventListener} from './events';
import {clearTimeout, setTimeout, type TimeoutID} from './timers';

/**
 * The global scope object.
 */
let globalObject = globalThis;

/**
 * Set the global scope object.
 *
 * @param go - The global scope object.
 *
 * @internal
 */
export function setGlobalObject(go: typeof globalThis): void {
    globalObject = go;
}

/**
 * Reset the global scope object to the default.
 *
 * @internal
 */
export function resetGlobalObject(): void {
    globalObject = globalThis;
}

/**
 * Check if a {@link Document} is ready to be manipulated.
 *
 * @param document - The document to check.
 *
 * @returns `true` if the document is ready to be manipulated; `false`
 * otherwise.
 */
export function isDocumentReady(
    document: Document = globalObject.document
): boolean {
    return document.readyState === 'complete';
}

/**
 * Wait for a {@link Document} to become ready to be manipulated.
 *
 * @param timeout - The maximum time to wait, in milliseconds. A non-finite,
 * negative, or non-numerical value will be treated as an indefinite wait
 * period.
 * @param document - The document to become ready for manipulation.
 *
 * @returns A promise that resolves when the document is ready to be manipulated
 * or rejects if a timeout is provided and was reached.
 */
export async function awaitDocumentReady(
    timeout: number = Infinity,
    document: Document = globalObject.document
): Promise<void> {
    if (isDocumentReady(document)) {
        return;
    }
    await new Promise<void>((resolve, reject): void => {
        if (isDocumentReady(document)) {
            resolve();
            return;
        }
        let timer: TimeoutID | null = null;
        const listener = (): void => {
            if (isDocumentReady(document)) {
                if (timer !== null) {
                    clearTimeout(timer);
                }
                removeDocumentEventListener(
                    'readystatechange',
                    listener,
                    undefined,
                    document
                );
                resolve();
            }
        };
        addDocumentEventListener(
            'readystatechange',
            listener,
            undefined,
            document
        );
        if (isFinite(timeout) && timeout > 0) {
            timer = setTimeout((): void => {
                removeDocumentEventListener(
                    'readystatechange',
                    listener,
                    undefined,
                    document
                );
                reject(new Error('Document ready state timeout reached'));
            }, timeout);
        }
    });
}
