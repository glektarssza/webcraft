//-- Project Code
import type {Distinct} from './utilTypes';

/**
 * A unique identifier which represents a request made to call a function after
 * a given delay.
 */
export type SetTimeoutRequestID = Distinct<number>;

/**
 * A unique identifier which represents a request made to call a function
 * repeatedly after a given delay.
 */
export type SetIntervalRequestID = Distinct<number>;

/**
 * A unique identifier which represents a request made to call a function
 * when the system is ready to render a new animation frame.
 */
export type AnimationFrameRequestID = Distinct<number>;

/**
 * A function which can be registered via the {@link setTimeout} function to be
 * called after a given delay.
 *
 * @typeParam T - The types of the arguments to the function.
 */
export type SetTimeoutCallback<T extends unknown[]> = (...args: T) => void;

/**
 * A function which can be registered via the {@link setInterval} function to be
 * called repeatedly after a given delay.
 *
 * @typeParam T - The types of the arguments to the function.
 */
export type SetIntervalCallback<T extends unknown[]> = (...args: T) => void;

/**
 * A function which can be registered via the {@link requestAnimationFrame}
 * function to be called when the system is ready to render a new animation
 * frame.
 */
export type AnimationFrameCallback = (time: DOMHighResTimeStamp) => void;

/**
 * Register a function to be called after a given delay.
 *
 * @param callback - The function to be called.
 * @param delay - The delay after which to call the function, in milliseconds.
 * @param args - The arguments to pass to the function when it is called.
 *
 * @returns A unique identifier which can be used to cancel the request.
 */
export function setTimeout<T extends unknown[]>(
    callback: SetTimeoutCallback<T>,
    delay: number,
    ...args: T
): SetTimeoutRequestID {
    return globalThis.setTimeout(
        callback,
        delay,
        ...args
    ) as SetTimeoutRequestID;
}

/**
 * Register a function to be called repeatedly after a given delay.
 *
 * @param callback - The function to be called.
 * @param delay - The delay after which to call the function, in milliseconds.
 * @param args - The arguments to pass to the function when it is called.
 *
 * @returns A unique identifier which can be used to cancel the request.
 */
export function setInterval<T extends unknown[]>(
    callback: SetIntervalCallback<T>,
    delay: number,
    ...args: T
): SetIntervalRequestID {
    return globalThis.setInterval(
        callback,
        delay,
        ...args
    ) as SetIntervalRequestID;
}

/**
 * Register a function to be called when the system is ready to render a new
 * animation frame.
 *
 * @param callback - The function to be called.
 *
 * @returns A unique identifier which can be used to cancel the request.
 */
export function requestAnimationFrame(
    callback: AnimationFrameCallback
): AnimationFrameRequestID {
    return globalThis.requestAnimationFrame(
        callback
    ) as AnimationFrameRequestID;
}

/**
 * Cancel a request to call a function after a given delay.
 *
 * @param id - The unique identifier of the request to cancel.
 */
export function clearTimeout(id: SetTimeoutRequestID): void {
    globalThis.clearTimeout(id);
}

/**
 * Cancel a request to call a function repeatedly after a given delay.
 *
 * @param id - The unique identifier of the request to cancel.
 */
export function clearInterval(id: SetIntervalRequestID): void {
    globalThis.clearInterval(id);
}

/**
 * Cancel a request to call a function when the system is ready to render a new
 * animation frame.
 *
 * @param id - The unique identifier of the request to cancel.
 */
export function cancelAnimationFrame(id: AnimationFrameRequestID): void {
    globalThis.cancelAnimationFrame(id);
}
