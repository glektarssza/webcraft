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
 * A function which can be registered via {@link addEventListener} to handle an
 * event.
 *
 * @typeParam T - The type of event to be handled.
 */
export type EventCallback<T extends Event = Event> = (event: T) => void;

/**
 * An object which can be registered via {@link addEventListener} to handle an
 * event.
 *
 * @typeParam T - The type of event to be handled.
 */
export interface EventCallbackObject<T extends Event = Event> {
    /**
     * The function which will handle the event.
     */
    handleEvent: EventCallback<T>;
}

export type EventHandler<T extends Event = Event> =
    | EventCallback<T>
    | EventCallbackObject<T>;

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

/**
 * Add a function to be called when an event is fired on the `window` object.
 *
 * @typeParam T - The type of the event target.
 * @typeParam T - The type of the event that will be handled.
 *
 * @param target - The target to register the callback on.
 * @param event - The event to register the callback for.
 * @param callback - The callback function to register.
 * @param options Any additional options for registering the callback function.
 */
export function addEventListener<
    T extends Window,
    E extends keyof WindowEventMap
>(
    target: T,
    event: E,
    callback: EventHandler<WindowEventMap[E]>,
    options?: boolean | AddEventListenerOptions
): void;

/**
 * Add a function to be called when an event is fired on the `window` object.
 *
 * @typeParam T - The type of the event target.
 * @typeParam T - The type of the event that will be handled.
 *
 * @param target - The target to register the callback on.
 * @param event - The event to register the callback for.
 * @param callback - The callback function to register.
 * @param options Any additional options for registering the callback function.
 */
export function addEventListener<
    T extends Document,
    E extends keyof DocumentEventMap
>(
    target: T,
    event: E,
    callback: EventHandler<DocumentEventMap[E]>,
    options?: boolean | AddEventListenerOptions
): void;

/**
 * Add a function to be called when an event is fired.
 *
 * @typeParam T - The type of the event target.
 *
 * @param target - The target to register the callback on.
 * @param event - The event to register the callback for.
 * @param callback - The callback function to register.
 * @param options Any additional options for registering the callback function.
 */
export function addEventListener<T extends EventTarget>(
    target: T,
    event: string,
    callback: EventHandler,
    options?: boolean | AddEventListenerOptions
): void {
    target.addEventListener(event, callback, options);
}
