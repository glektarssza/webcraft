//-- Project Code
import type {Distinct} from './types';

/**
 * A callback that can be passed to {@link m.setTimeout | setTimeout} to be
 * called after a delay.
 *
 * @typeParam TArgs - The types of the arguments the callback expects.
 * @typeParam TRet - The return type of the callback.
 */
export type SetTimeoutCallback<TArgs extends unknown[], TRet = unknown> = (
    ...args: TArgs
) => TRet;

/**
 * A callback that can be passed to {@link m.setInterval | setInterval} to be
 * called repeatedly on a set interval.
 *
 * @typeParam TArgs - The types of the arguments the callback expects.
 * @typeParam TRet - The return type of the callback.
 */
export type SetIntervalCallback<TArgs extends unknown[], TRet = unknown> = (
    ...args: TArgs
) => TRet;

/**
 * A callback that can be passed to
 * {@link m.requestAnimationFrame | requestAnimationFrame} to be called when the
 * browser is ready to render another frame.
 *
 * @typeParam TRet - The return type of the callback.
 */
export type RequestAnimationFrameCallback<TRet = unknown> = (
    delta: DOMHighResTimeStamp
) => TRet;

/**
 * An identifier that can be used to cancel a previous call to
 * {@link m.setTimeout | setTimeout}.
 */
export type SetTimeoutRequestID = Distinct<number>;

/**
 * An identifier that can be used to cancel a previous call to
 * {@link m.setInterval | setInterval}.
 */
export type SetIntervalRequestID = Distinct<number>;

/**
 * An identifier that can be used to cancel a previous call to
 * {@link m.requestAnimationFrame | requestAnimationFrame}.
 */
export type RequestAnimationFrameRequestID = Distinct<number>;

/**
 * A callback for when an event occurs on the DOM `document`.
 *
 * @typeParam TEvent - The name of the event which the callback is meant to
 * handle.
 */
export type DocumentEventListener<TEvent extends keyof DocumentEventMap> = (
    event: DocumentEventMap[TEvent]
) => boolean | void;

/**
 * A callback for when an event occurs on the DOM `window`.
 *
 * @typeParam TEvent - The name of the event which the callback is meant to
 * handle.
 */
export type WindowEventListener<TEvent extends keyof WindowEventMap> = (
    event: WindowEventMap[TEvent]
) => boolean | void;

/**
 * A module which provides utility functionality related to the DOM.
 */
const m = {
    /**
     * Request a callback to be triggered after a given delay.
     *
     * @typeParam TArgs - The types of the arguments the callback expects.
     *
     * @param callback - The callback to trigger after the delay.
     * @param delay - An optional amount of time, in milliseconds, to wait. If
     * not provided it is assumed to be `0`.
     * @param args - The arguments to pass to the callback when it is triggered.
     *
     * @returns An identifier that can be used to cancel the request.
     */
    setTimeout<TArgs extends unknown[]>(
        callback: SetTimeoutCallback<TArgs>,
        delay?: number,
        ...args: TArgs
    ): SetTimeoutRequestID {
        return globalThis.setTimeout(
            callback,
            delay,
            ...args
        ) as SetTimeoutRequestID;
    },

    /**
     * Cancel a previous request to trigger a callback after a given delay.
     *
     * @param requestID - The identifier of the request to cancel.
     */
    clearTimeout(requestID: SetTimeoutRequestID): void {
        globalThis.clearTimeout(requestID);
    },

    /**
     * Request a callback to be triggered repeatedly on a set interval.
     *
     * @typeParam TArgs - The types of the arguments the callback expects.
     *
     * @param callback - The callback to trigger after each interval.
     * @param delay - An optional amount of time, in milliseconds, to wait
     * between callback triggers. If not provided it is assumed to be `0`.
     * @param args - The arguments to pass to the callback when it is triggered.
     *
     * @returns An identifier that can be used to cancel the request.
     */
    setInterval<TArgs extends unknown[]>(
        callback: SetIntervalCallback<TArgs>,
        delay?: number,
        ...args: TArgs
    ): SetIntervalRequestID {
        return globalThis.setInterval(
            callback,
            delay,
            ...args
        ) as SetIntervalRequestID;
    },

    /**
     * Cancel a previous request to trigger a callback on a given interval.
     *
     * @param requestID - The identifier of the request to cancel.
     */
    clearInterval(requestID: SetIntervalRequestID): void {
        globalThis.clearInterval(requestID);
    },

    /**
     * Add an event listener to the DOM `document`.
     *
     * @typeParam TEvent - The name of the event which the callback is being
     * registered for.
     *
     * @param eventName - The name of the event which the callback is being
     * registered for.
     * @param callback - The callback to register.
     * @param options - The options to use for registering the callback.
     */
    addDocumentEventListener<TEvent extends keyof DocumentEventMap>(
        eventName: TEvent,
        callback: DocumentEventListener<TEvent>,
        options?: boolean | AddEventListenerOptions
    ): void {
        globalThis.document.addEventListener(eventName, callback, options);
    },

    /**
     * Remove an event listener from the DOM `document`.
     *
     * @typeParam TEvent - The name of the event which the callback is being
     * removed from.
     *
     * @param eventName - The name of the event which the callback is being
     * removed from.
     * @param callback - The callback to remove.
     * @param options - The options to use for removing the callback.
     */
    removeDocumentEventListener<TEvent extends keyof DocumentEventMap>(
        eventName: TEvent,
        callback: DocumentEventListener<TEvent>,
        options?: boolean | EventListenerOptions
    ): void {
        globalThis.document.removeEventListener(eventName, callback, options);
    },

    /**
     * Add an event listener to the DOM `window`.
     *
     * @typeParam TEvent - The name of the event which the callback is being
     * registered for.
     *
     * @param eventName - The name of the event which the callback is being
     * registered for.
     * @param callback - The callback to register.
     * @param options - The options to use for registering the callback.
     */
    addWindowEventListener<TEvent extends keyof WindowEventMap>(
        eventName: TEvent,
        callback: WindowEventListener<TEvent>,
        options?: boolean | AddEventListenerOptions
    ): void {
        globalThis.window.addEventListener(eventName, callback, options);
    },

    /**
     * Remove an event listener from the DOM `window`.
     *
     * @typeParam TEvent - The name of the event which the callback is being
     * removed from.
     *
     * @param eventName - The name of the event which the callback is being
     * removed from.
     * @param callback - The callback to remove.
     * @param options - The options to use for removing the callback.
     */
    removeWindowEventListener<TEvent extends keyof WindowEventMap>(
        eventName: TEvent,
        callback: WindowEventListener<TEvent>,
        options?: boolean | EventListenerOptions
    ): void {
        globalThis.window.removeEventListener(eventName, callback, options);
    },

    /**
     * Get the `readyState` of the DOM `document`.
     *
     * @returns The `readyState` of the DOM `document`.
     */
    getDocumentReadyState(): DocumentReadyState {
        return globalThis.document.readyState;
    },

    /**
     * Check whether the DOM is fully loaded.
     *
     * @returns `true` if the DOM is fully loaded; `false` otherwise.
     */
    isDOMLoaded(): boolean {
        return m.getDocumentReadyState() === 'complete';
    },

    /**
     * Wait for the DOM to become fully loaded.
     *
     * @param timeout - The maximum duration, in milliseconds, to wait before
     * failing. A negative, non-finite, or non-numerical value will be treated
     * as an infinite timeout.
     *
     * @returns A promise that resolves once the DOM is fully loaded or rejects
     * if the timeout occurs before the DOM becomes fully loaded.
     */
    async waitForDOMLoaded(timeout = Infinity): Promise<void> {
        if (m.isDOMLoaded()) {
            return;
        }
        await new Promise<void>((resolve, reject): void => {
            if (m.isDOMLoaded()) {
                resolve();
                return;
            }
            let timeoutID: SetTimeoutRequestID | null = null;
            const listener = (): void => {
                if (m.isDOMLoaded()) {
                    if (timeoutID !== null) {
                        m.clearTimeout(timeoutID);
                    }
                    m.removeDocumentEventListener('readystatechange', listener);
                    resolve();
                    return;
                }
            };
            if (isFinite(timeout) && timeout >= 0) {
                timeoutID = m.setTimeout((): void => {
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
    },

    /**
     * Request a callback to be triggered when the browser is ready to render
     * another animation frame.
     *
     * @param callback - The callback to be triggered.
     *
     * @returns An identifier that can be used to cancel the request.
     */
    requestAnimationFrame(
        callback: RequestAnimationFrameCallback
    ): RequestAnimationFrameRequestID {
        return globalThis.requestAnimationFrame(
            callback
        ) as RequestAnimationFrameRequestID;
    },

    /**
     * Cancel a previous request to trigger a callback when the browser is ready
     * to render another animation frame.
     *
     * @param requestID - The identifier of the request to cancel.
     */
    cancelAnimationFrame(requestID: RequestAnimationFrameRequestID): void {
        globalThis.cancelAnimationFrame(requestID);
    }
};

/**
 * Get the internal module for use in unit tests.
 *
 * @returns The internal module.
 *
 * @internal
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
    getDocumentReadyState,
    isDOMLoaded,
    removeDocumentEventListener,
    removeWindowEventListener,
    requestAnimationFrame,
    setInterval,
    setTimeout,
    waitForDOMLoaded
} = m;
/* eslint-enable @typescript-eslint/unbound-method */
