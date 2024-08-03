//-- Project Code
import type {Distinct} from '../common';

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
 * @param g - The global scope object.
 * @param callback - The function to register.
 * @param delay - The delay, in milliseconds, to call the function after.
 * @param args - The arguments to pass to the function.
 *
 * @returns An ID which can be used to cancel the request to call the function.
 */
export function setTimeout<TArgs extends unknown[]>(
    g: typeof globalThis,
    callback: TimeoutCallback<TArgs>,
    delay: number,
    ...args: TArgs
): TimeoutID {
    return g.setTimeout(callback, delay, ...args) as TimeoutID;
}

/**
 * Register a function to be called repeatedly after a given delay.
 *
 * @param g - The global scope object.
 * @param callback - The function to register.
 * @param delay - The delay, in milliseconds, to call the function after.
 * @param args - The arguments to pass to the function.
 *
 * @returns An ID which can be used to cancel the request to call the function.
 */
export function setInterval<TArgs extends unknown[]>(
    g: typeof globalThis,
    callback: IntervalCallback<TArgs>,
    delay: number,
    ...args: TArgs
): IntervalID {
    return g.setTimeout(callback, delay, ...args) as IntervalID;
}

/**
 * Register a function to be called when the system is ready to render a new
 * animation frame.
 *
 * @param g - The global scope object.
 * @param callback - The function to register.
 *
 * @returns An ID which can be used to cancel the request to call the function.
 */
export function requestAnimationFrame(
    g: typeof globalThis,
    callback: AnimationFrameCallback
): AnimationFrameID {
    return g.requestAnimationFrame(callback) as AnimationFrameID;
}

/**
 * Cancel a previously made request to call a function after a delay.
 *
 * @param g - The global scope object.
 * @param id - The ID of the request to cancel.
 */
export function clearTimeout(g: typeof globalThis, id: TimeoutID): void {
    g.clearTimeout(id);
}

/**
 * Cancel a previously made request to call a function repeatedly after a delay.
 *
 * @param g - The global scope object.
 * @param id - The ID of the request to cancel.
 */
export function clearInterval(g: typeof globalThis, id: IntervalID): void {
    g.clearInterval(id);
}

/**
 * Cancel a previously made request to call a function when the system is ready
 * to render a new animation frame.
 *
 * @param g - The global scope object.
 * @param id - The ID of the request to cancel.
 */
export function cancelAnimationFrame(
    g: typeof globalThis,
    id: IntervalID
): void {
    g.cancelAnimationFrame(id);
}
