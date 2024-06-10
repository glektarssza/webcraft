//-- Project Code
import type {Distinct} from '../utils/index';

/**
 * A type which represents a callback for the `setTimeout` and `setInterval`
 * functions.
 *
 * @typeParam T - The types of the arguments that will be passed to the
 * callback.
 * @typeParam R - The return type of the callback.
 */
export type TimerCallback<T extends unknown[], R = unknown> = (...args: T) => R;

/**
 * A type which represents a callback fro the `requestAnimationFrame` function.
 *
 * @typeParam R - The return type of the callback.
 */
export type AnimationFrameCallback<R = unknown> = (
    delta: DOMHighResTimeStamp
) => R;

/**
 * An identifier that is returned by a call to `setTimeout` and that can be used
 * to cancel the pending timeout.
 */
export type TimeoutID = Distinct<number>;

/**
 * An identifier that is returned by a call to `setInterval` and that can be
 * used to cancel the pending repeating timeout.
 */
export type IntervalID = Distinct<number>;

/**
 * An identifier that is returned by a call to `requestAnimationFrame` and that
 * can be used to cancel the pending animation frame request.
 */
export type AnimationFrameID = Distinct<number>;

/**
 * A module which provides various DOM-related typings.
 */
const m = {};

/**
 * Get the internal module for use in unit tests.
 *
 * @returns The internal module.
 */
export function getInternalModule(): typeof m {
    return m;
}

/* eslint-disable no-empty-pattern */
export const {} = m;
/* eslint-enable no-empty-pattern */
