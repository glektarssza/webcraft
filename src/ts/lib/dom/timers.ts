//-- Project Code
import type {Distinct} from '../common';

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
 * The ID of a call to {@link setTimeout}.
 */
export type TimeoutID = Distinct<number>;

/**
 * The ID of a call to {@link setInterval}.
 */
export type IntervalID = Distinct<number>;

/**
 * The ID of a call to {@link requestAnimationFrame}.
 */
export type AnimationFrameID = Distinct<number>;

/**
 * A function that can be registered to be called after a given delay.
 *
 * @typeParam TArgs - The types of the arguments being passed to the callback.
 *
 * @param args - The arguments being passed to the callback.
 */
export type TimeoutCallback<TArgs extends unknown[]> = (...args: TArgs) => void;

/**
 * A function that can be registered to be called repeated after a given delay.
 *
 * @typeParam TArgs - The types of the arguments being passed to the callback.
 *
 * @param args - The arguments being passed to the callback.
 */
export type IntervalCallback<TArgs extends unknown[]> = (
    ...args: TArgs
) => void;

/**
 * A function that can be registered to be called when the system is ready to
 * render a new animation frame.
 *
 * @param time - The current system time, in milliseconds.
 */
export type AnimationFrameCallback = (time: number) => void;

/**
 * Register a function to be called after a given delay.
 *
 * @param callback - The function to register.
 * @param delay - The delay, in milliseconds, to call the function after.
 * @param g - The global scope object.
 * @param args - The arguments to pass to the function.
 *
 * @returns An ID which can be used to cancel the request to call the function.
 */
export function setTimeout<TArgs extends unknown[]>(
    callback: TimeoutCallback<TArgs>,
    delay: number,
    ...args: TArgs
): TimeoutID {
    return globalObject.setTimeout(callback, delay, ...args) as TimeoutID;
}

/**
 * Register a function to be called repeatedly after a given delay.
 *
 * @param callback - The function to register.
 * @param delay - The delay, in milliseconds, to call the function after.
 * @param g - The global scope object.
 * @param args - The arguments to pass to the function.
 *
 * @returns An ID which can be used to cancel the request to call the function.
 */
export function setInterval<TArgs extends unknown[]>(
    callback: IntervalCallback<TArgs>,
    delay: number,
    ...args: TArgs
): IntervalID {
    return globalObject.setInterval(callback, delay, ...args) as IntervalID;
}

/**
 * Register a function to be called when the system is ready to render a new
 * animation frame.
 *
 * @param callback - The function to register.
 * @param g - The global scope object.
 *
 * @returns An ID which can be used to cancel the request to call the function.
 */
export function requestAnimationFrame(
    callback: AnimationFrameCallback
): AnimationFrameID {
    return globalObject.requestAnimationFrame(callback) as AnimationFrameID;
}

/**
 * Cancel a previously made request to call a function after a delay.
 *
 * @param id - The ID of the request to cancel.
 * @param g - The global scope object.
 */
export function clearTimeout(id: TimeoutID): void {
    globalObject.clearTimeout(id);
}

/**
 * Cancel a previously made request to call a function repeatedly after a delay.
 *
 * @param id - The ID of the request to cancel.
 * @param g - The global scope object.
 */
export function clearInterval(id: IntervalID): void {
    globalObject.clearInterval(id);
}

/**
 * Cancel a previously made request to call a function when the system is ready
 * to render a new animation frame.
 *
 * @param id - The ID of the request to cancel.
 * @param g - The global scope object.
 */
export function cancelAnimationFrame(id: IntervalID): void {
    globalObject.cancelAnimationFrame(id);
}
