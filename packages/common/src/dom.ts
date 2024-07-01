//-- Project Code
import type {Distinct} from './index';

/**
 * A unique identifier from a request to {@link m.setTimeout | setTimeout} that
 * can be used to cancel the request.
 */
export type SetTimeoutRequestID = Distinct<number>;

/**
 * A unique identifier from a request to {@link m.setInterval | setInterval}
 * that can be used to cancel the request.
 */
export type SetIntervalRequestID = Distinct<number>;

/**
 * A unique identifier from a request to
 * {@link m.requestAnimationFrame | requestAnimationFrame} that can be used to
 * cancel the request.
 */
export type AnimationFrameRequestID = Distinct<number>;

/**
 * A function that can be requested to be called after a given delay.
 *
 * @typeParam T - The types of the parameters accepted by the function.
 *
 * @param args - The arguments accepted by the function.
 */
export type SetTimeoutCallback<T extends unknown[]> = (...args: T) => void;

/**
 * A function that can be requested to be called repeatedly after a given delay.
 *
 * @typeParam T - The types of the parameters accepted by the function.
 *
 * @param args - The arguments accepted by the function.
 */
export type SetIntervalCallback<T extends unknown[]> = (...args: T) => void;

/**
 * A function that can be requested to be called when the system is ready to
 * render a new animation frame.
 *
 * @param time - The end time of the rendering of the previous frame.
 */
export type AnimationFrameCallback = (time: DOMHighResTimeStamp) => void;

/**
 * A function that can be registered onto a {@link Document} to handle events.
 */
export type DocumentEventListener<T extends keyof DocumentEventMap> = (
    event: DocumentEventMap[T]
) => void;

/**
 * A function that can be registered onto a {@link Window} to handle events.
 */
export type WindowEventListener<T extends keyof WindowEventMap> = (
    event: WindowEventMap[T]
) => void;

/**
 * A module which provides various DOM-related utilities.
 */
const m = {
    /**
     * Request that a function be called after a given delay.
     *
     * @typeParam T - The types of the parameters accepted by the function.
     *
     * @param callback - The function to request to be called after the given
     * delay.
     * @param delay - The delay, in milliseconds, after which to call the
     * provided function.
     * @param args - The arguments to pass to the function when/if it is called.
     *
     * @returns A unique identifier that can be used to cancel the request.
     */
    setTimeout<T extends unknown[]>(
        callback: SetTimeoutCallback<T>,
        delay: number,
        ...args: T
    ): SetTimeoutRequestID {
        return globalThis.setTimeout(
            callback,
            delay,
            ...args
        ) as SetTimeoutRequestID;
    },

    /**
     * Cancel a previous request to call a function after a given delay.
     *
     * @param id - The unique identifier of the request to cancel.
     */
    clearTimeout(id: SetTimeoutRequestID): void {
        globalThis.clearTimeout(id);
    },

    /**
     * Request that a function be called repeatedly after a given delay.
     *
     * @typeParam T - The types of the parameters accepted by the function.
     *
     * @param callback - The function to request to be called repeatedly after
     * the given delay.
     * @param delay - The delay, in milliseconds, after which to call the
     * provided function.
     * @param args - The arguments to pass to the function when/if it is called.
     *
     * @returns A unique identifier that can be used to cancel the request.
     */
    setInterval<T extends unknown[]>(
        callback: SetIntervalCallback<T>,
        delay: number,
        ...args: T
    ): SetIntervalRequestID {
        return globalThis.setInterval(
            callback,
            delay,
            ...args
        ) as SetIntervalRequestID;
    },

    /**
     * Cancel a previous request to call a function repeatedly after a given
     * delay.
     *
     * @param id - The unique identifier of the request to cancel.
     */
    clearInterval(id: SetIntervalRequestID): void {
        globalThis.clearInterval(id);
    },

    /**
     * Request that a function be called when the system is ready to render a
     * new animation frame.
     *
     * @param callback - The function to request to be called when the system is
     * ready to render a new animation frame.
     *
     * @returns A unique identifier that can be used to cancel the request.
     */
    requestAnimationFrame(
        callback: AnimationFrameCallback
    ): AnimationFrameRequestID {
        return globalThis.requestAnimationFrame(
            callback
        ) as AnimationFrameRequestID;
    },

    /**
     * Cancel a previous request to call a function when the system is ready to
     * render a new animation frame.
     *
     * @param id - The unique identifier of the request to cancel.
     */
    cancelAnimationFrame(id: AnimationFrameRequestID): void {
        globalThis.cancelAnimationFrame(id);
    },

    /**
     * Register a function to be called when a target fires an event.
     *
     * @typeParam T - The type of the target to register the function onto.
     *
     * @param target - The target to register the function onto.
     * @param event - The event to register the function for.
     * @param callback - The function to register.
     * @param options - Any additional options for registering the function.
     */
    addEventListener<T extends EventTarget>(
        target: T,
        event: string,
        callback: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ): void {
        target.addEventListener(event, callback, options);
    },

    /**
     * Register a function to be called when the global {@link Document} fires
     * an event.
     *
     * @typeParam T - The type of the event to register the function onto.
     *
     * @param event - The event to register the function for.
     * @param callback - The function to register.
     * @param options - Any additional options for registering the function.
     */
    addDocumentEventListener<T extends keyof DocumentEventMap>(
        event: T,
        callback: DocumentEventListener<T>,
        options?: boolean | AddEventListenerOptions
    ): void {
        globalThis.document.addEventListener(event, callback, options);
    },

    /**
     * Register a function to be called when the global {@link Window} fires
     * an event.
     *
     * @typeParam T - The type of the event to register the function onto.
     *
     * @param event - The event to register the function for.
     * @param callback - The function to register.
     * @param options - Any additional options for registering the function.
     */
    addWindowEventListener<T extends keyof WindowEventMap>(
        event: T,
        callback: WindowEventListener<T>,
        options?: boolean | AddEventListenerOptions
    ): void {
        globalThis.window.addEventListener(event, callback, options);
    },

    /**
     * Unregister a function to be called when a target fires an event.
     *
     * @typeParam T - The type of the target to register the function onto.
     *
     * @param target - The target to register the function onto.
     * @param event - The event to register the function for.
     * @param callback - The function to register.
     * @param options - Any additional options for registering the function.
     */
    removeEventListener<T extends EventTarget>(
        target: T,
        event: string,
        callback: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions
    ): void {
        target.removeEventListener(event, callback, options);
    },

    /**
     * Unregister a function to be called when the global {@link Document} fires
     * an event.
     *
     * @typeParam T - The type of the event to register the function onto.
     *
     * @param event - The event to register the function for.
     * @param callback - The function to register.
     * @param options - Any additional options for registering the function.
     */
    removeDocumentEventListener<T extends keyof DocumentEventMap>(
        event: T,
        callback: DocumentEventListener<T>,
        options?: boolean | EventListenerOptions
    ): void {
        globalThis.document.removeEventListener(event, callback, options);
    },

    /**
     * Unregister a function to be called when the global {@link Window} fires
     * an event.
     *
     * @typeParam T - The type of the event to register the function onto.
     *
     * @param event - The event to register the function for.
     * @param callback - The function to register.
     * @param options - Any additional options for registering the function.
     */
    removeWindowEventListener<T extends keyof WindowEventMap>(
        event: T,
        callback: WindowEventListener<T>,
        options?: boolean | EventListenerOptions
    ): void {
        globalThis.window.removeEventListener(event, callback, options);
    },

    /**
     * Check whether the DOM is ready to manipulate.
     *
     * @returns Whether the DOM is ready to manipulate.
     */
    isDOMReady(): boolean {
        return globalThis.document.readyState === 'complete';
    },

    /**
     * Wait for the DOM to become ready to manipulate.
     *
     * @param timeout - The maximum duration, in milliseconds, to wait before
     * erroring. Negative, non-finite, or non-numerical values will be treated
     * as an indefinite waiting period.
     *
     * @returns A promise that resolves when the DOM is ready to be manipulated
     * or rejects if a timeout was provided and reached.
     *
     * @throws `Error`
     * Thrown if a timeout was provided and reached.
     */
    async domReady(timeout = Infinity): Promise<void> {
        if (m.isDOMReady()) {
            return;
        }
        await new Promise<void>((resolve, reject): void => {
            if (m.isDOMReady()) {
                resolve();
                return;
            }
            let timer: SetTimeoutRequestID | null = null;
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
 * Get the internal module object for this module.
 *
 * @returns The internal module object for this module.
 *
 * @internal
 */
export function getInternalModule(): typeof m {
    return m;
}

/* eslint-disable @typescript-eslint/unbound-method */
export const {
    addDocumentEventListener,
    addEventListener,
    addWindowEventListener,
    cancelAnimationFrame,
    clearInterval,
    clearTimeout,
    domReady,
    isDOMReady,
    removeDocumentEventListener,
    removeEventListener,
    removeWindowEventListener,
    requestAnimationFrame,
    setInterval,
    setTimeout
} = m;
/* eslint-enable @typescript-eslint/unbound-method */
