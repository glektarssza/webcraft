//-- Project Code
import type {Distinct} from './types';

/**
 * A function that can be passed to {@link m.setTimeout | setTimeout} as the
 * callback to be triggered once the timeout has elapsed.
 *
 * @typeParam TArgs - The type of the arguments passed to the callback.
 * @typeParam TRet - The return type of the callback.
 *
 * @param args - The arguments passed to the callback via the `args` parameter
 * of {@link m.setTimeout | setTimeout}.
 */
export type TimeoutCallback<TArgs extends unknown[], TRet = unknown> = (
    ...args: TArgs
) => TRet;

/**
 * A function that can be passed to {@link m.setInterval | setInterval} as the
 * callback to be triggered once the timeout has elapsed.
 *
 * @typeParam TArgs - The type of the arguments passed to the callback.
 * @typeParam TRet - The return type of the callback.
 *
 * @param args - The arguments passed to the callback via the `args` parameter
 * of {@link m.setInterval | setInterval}.
 */
export type IntervalCallback<TArgs extends unknown[], TRet = unknown> = (
    ...args: TArgs
) => TRet;

/**
 * A function that can be passed to
 * {@link m.requestAnimationFrame | requestAnimationFrame} as the callback to be
 * triggered once the browser is ready to render the next animation frame.
 *
 * @typeParam TRet - The return type of the callback.
 *
 * @param delta - The time in milliseconds since the last frame was rendered.
 */
export type RequestAnimationFrameCallback<TRet = unknown> = (
    delta: DOMHighResTimeStamp
) => TRet;

/**
 * A type which represents the ID of a request to
 * {@link m.setTimeout | setTimeout}.
 */
export type TimeoutId = Distinct<number>;

/**
 * A type which represents the ID of a request to
 * {@link m.setInterval | setInterval}.
 */
export type IntervalId = Distinct<number>;

/**
 * A type which represents the ID of a request to
 * {@link m.requestAnimationFrame | requestAnimationFrame}.
 */
export type RequestAnimationFrameId = Distinct<number>;

/**
 * A module which provides common DOM-related utility functions.
 */
const m = {
    /**
     * Set a function to be called after the given number of milliseconds.
     *
     * @typeParam TArgs - The type of the arguments passed to the callback.
     *
     * @param callback - The function to be called after the timeout has
     * elapsed.
     * @param timeout - The number of milliseconds to wait before calling the
     * function.
     * @param args - The arguments to pass to the callback when it is called.
     *
     * @returns The ID of the timeout request, which can be used to cancel the
     * request.
     */
    setTimeout<TArgs extends unknown[]>(
        callback: TimeoutCallback<TArgs>,
        timeout: number,
        ...args: TArgs
    ): TimeoutId {
        return globalThis.setTimeout(callback, timeout, ...args) as TimeoutId;
    },

    /**
     * Clear a request made via {@link m.setTimeout | setTimeout}.
     *
     * @param id - The ID of the timeout request to clear.
     */
    clearTimeout(id: TimeoutId): void {
        globalThis.clearTimeout(id);
    },

    /**
     * Set a function to be called each time a given number of milliseconds
     * elapses.
     *
     * @typeParam TArgs - The type of the arguments passed to the callback.
     *
     * @param callback - The function to be called after the interval has
     * elapsed.
     * @param timeout - The number of milliseconds to wait between calls to the
     * function.
     * @param args - The arguments to pass to the callback when it is called.
     *
     * @returns The ID of the interval request, which can be used to cancel the
     * request.
     */
    setInterval<TArgs extends unknown[]>(
        callback: IntervalCallback<TArgs>,
        timeout: number,
        ...args: TArgs
    ): IntervalId {
        return globalThis.setInterval(callback, timeout, ...args) as IntervalId;
    },

    /**
     * Clear a request made via {@link m.setInterval | setInterval}.
     *
     * @param id - The ID of the interval request to clear.
     */
    clearInterval(id: IntervalId): void {
        globalThis.clearInterval(id);
    },

    /**
     * Request that the browser call a function when it is ready to render the
     * next animation frame.
     *
     * @param callback - The function to be called when the next animation frame
     * is ready to be rendered.
     */
    requestAnimationFrame(
        callback: RequestAnimationFrameCallback
    ): RequestAnimationFrameId {
        return globalThis.requestAnimationFrame(
            callback
        ) as RequestAnimationFrameId;
    },

    /**
     * Cancel a request made via
     * {@link m.requestAnimationFrame | requestAnimationFrame}.
     *
     * @param id - The ID of the request to cancel.
     */
    cancelAnimationFrame(id: RequestAnimationFrameId): void {
        globalThis.cancelAnimationFrame(id);
    },

    /**
     * Get the current ready state of the document.
     *
     * @returns The current ready state of the document.
     */
    getDocumentReadyState(): DocumentReadyState {
        return globalThis.document.readyState;
    },

    /**
     * Add an event listener to the DOM document.
     *
     * @typeParam TEvent - The type of the event to listen for.
     *
     * @param event - The event to listen for.
     * @param callback - The function to call when the event is triggered.
     * @param options - An options object that specifies characteristics about
     * the event listener.
     */
    addDocumentEventListener<TEvent extends keyof DocumentEventMap>(
        event: TEvent,
        callback: (this: Document, event: DocumentEventMap[TEvent]) => unknown,
        options?: boolean | AddEventListenerOptions
    ): void {
        globalThis.document.addEventListener(event, callback, options);
    },

    /**
     * Remove an event listener to the DOM document.
     *
     * @typeParam TEvent - The type of the event to listen for.
     *
     * @param event - The event to listen for.
     * @param callback - The function to call when the event is triggered.
     * @param options - An options object that specifies characteristics about
     * the event listener.
     */
    removeDocumentEventListener<TEvent extends keyof DocumentEventMap>(
        event: TEvent,
        callback: (this: Document, event: DocumentEventMap[TEvent]) => unknown,
        options?: boolean | AddEventListenerOptions
    ): void {
        globalThis.document.removeEventListener(event, callback, options);
    },

    /**
     * Add an event listener to the global window.
     *
     * @typeParam TEvent - The type of the event to listen for.
     *
     * @param event - The event to listen for.
     * @param callback - The function to call when the event is triggered.
     * @param options - An options object that specifies characteristics about
     * the event listener.
     */
    addWindowEventListener<TEvent extends keyof WindowEventMap>(
        event: TEvent,
        callback: (this: Window, event: WindowEventMap[TEvent]) => unknown,
        options?: boolean | AddEventListenerOptions
    ): void {
        globalThis.window.addEventListener(event, callback, options);
    },

    /**
     * Remove an event listener to the global window.
     *
     * @typeParam TEvent - The type of the event to listen for.
     *
     * @param event - The event to listen for.
     * @param callback - The function to call when the event is triggered.
     * @param options - An options object that specifies characteristics about
     * the event listener.
     */
    removeWindowEventListener<TEvent extends keyof WindowEventMap>(
        event: TEvent,
        callback: (this: Window, event: WindowEventMap[TEvent]) => unknown,
        options?: boolean | AddEventListenerOptions
    ): void {
        globalThis.window.removeEventListener(event, callback, options);
    },

    async waitForDOMReady(timeout: number = Infinity): Promise<void> {
        if (m.getDocumentReadyState() === 'complete') {
            return;
        }
        await new Promise<void>((resolve, reject): void => {
            if (m.getDocumentReadyState() === 'complete') {
                resolve();
                return;
            }
            let timer: TimeoutId | null = null;
            const listener = (): void => {
                if (m.getDocumentReadyState() === 'complete') {
                    if (timer !== null) {
                        m.clearTimeout(timer);
                    }
                    m.removeDocumentEventListener('readystatechange', listener);
                    resolve();
                    return;
                }
            };
            if (isFinite(timeout) && timeout >= 0) {
                timer = m.setTimeout(() => {
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
export const {
    addDocumentEventListener,
    addWindowEventListener,
    cancelAnimationFrame,
    clearInterval,
    clearTimeout,
    getDocumentReadyState,
    removeDocumentEventListener,
    removeWindowEventListener,
    requestAnimationFrame,
    setInterval,
    setTimeout,
    waitForDOMReady
} = m;
/* eslint-enable no-empty-pattern, @typescript-eslint/unbound-method */
