//-- Project Code
import type {IntervalID, TimeoutID, TimerCallback} from './types';

/**
 * A module which provides various functionality related to DOM "timers".
 */
const m = {
    /**
     * Request a callback to be triggered after a given timeout.
     *
     * @param callback - The callback to trigger.
     * @param timeout - The duration, in milliseconds, to wait before triggering
     * the callback.
     * @param args - The arguments to pass to the callback.
     *
     * @returns An identifier that can be used to cancel the request before it
     * is triggered.
     *
     * @see {@link m.clearTimeout | clearTimeout}
     * @see {@link m.setInterval | setInterval}
     */
    setTimeout<T extends unknown[]>(
        callback: TimerCallback<T>,
        timeout?: number,
        ...args: T
    ): TimeoutID {
        return globalThis.setTimeout(callback, timeout, ...args) as TimeoutID;
    },

    /**
     * Cancel a previous request to {@link m.setTimeout | setTimeout}.
     *
     * @param id - The identifier of the request to cancel.
     *
     * @see {@link m.setTimeout | setTimeout}
     */
    clearTimeout(id: TimeoutID): void {
        globalThis.clearTimeout(id);
    },

    /**
     * Request a callback to be triggered repeatedly after a given timeout.
     *
     * @param callback - The callback to trigger.
     * @param timeout - The duration, in milliseconds, to wait before triggering
     * the callback.
     * @param args - The arguments to pass to the callback.
     *
     * @returns An identifier that can be used to cancel the request before it
     * is triggered.
     *
     * @see {@link m.clearInterval | clearInterval}
     * @see {@link m.setTimeout | setTimeout}
     */
    setInterval<T extends unknown[]>(
        callback: TimerCallback<T>,
        interval?: number,
        ...args: T
    ): IntervalID {
        return globalThis.setInterval(
            callback,
            interval,
            ...args
        ) as IntervalID;
    },

    /**
     * Cancel a previous request to {@link m.setInterval | setInterval}.
     *
     * @param id - The identifier of the request to cancel.
     *
     * @see {@link m.setInterval | setInterval}
     */
    clearInterval(id: IntervalID): void {
        globalThis.clearInterval(id);
    }
};

/**
 * Get the internal module for use in unit tests.
 *
 * @returns The internal module.
 */
export function getInternalModule(): typeof m {
    return m;
}

/* eslint-disable @typescript-eslint/unbound-method */
export const {clearInterval, clearTimeout, setInterval, setTimeout} = m;
/* eslint-enable @typescript-eslint/unbound-method */
