//-- Project Code
import type {DocumentEventListener, WindowEventListener} from './types';

/**
 * A module which provides various functionality related to DOM events.
 */
const m = {
    /**
     * Add a callback to be triggered when an event occurs on the DOM
     * `document`.
     *
     * @param type - The type of event to add a callback for.
     * @param callback - The callback to add.
     * @param options - Any additional options for adding the callback.
     */
    addDocumentEventListener<E extends keyof DocumentEventMap>(
        type: E,
        callback: DocumentEventListener<E>,
        options?: boolean | AddEventListenerOptions
    ): void {
        globalThis.document.addEventListener(type, callback, options);
    },

    /**
     * Remove a callback from being triggered when an event occurs on the DOM
     * `document`.
     *
     * @param type - The type of event to remove a callback for.
     * @param callback - The callback to remove.
     * @param options - Any additional options for removing the callback.
     */
    removeDocumentEventListener<E extends keyof DocumentEventMap>(
        type: E,
        callback: DocumentEventListener<E>,
        options?: boolean | EventListenerOptions
    ): void {
        globalThis.document.removeEventListener(type, callback, options);
    },

    /**
     * Add a callback to be triggered when an event occurs on the DOM
     * `window`.
     *
     * @param type - The type of event to add a callback for.
     * @param callback - The callback to add.
     * @param options - Any additional options for adding the callback.
     */
    addWindowEventListener<E extends keyof WindowEventMap>(
        type: E,
        callback: WindowEventListener<E>,
        options?: boolean | AddEventListenerOptions
    ): void {
        globalThis.window.addEventListener(type, callback, options);
    },

    /**
     * Remove a callback from being triggered when an event occurs on the DOM
     * `window`.
     *
     * @param type - The type of event to remove a callback for.
     * @param callback - The callback to remove.
     * @param options - Any additional options for removing the callback.
     */
    removeWindowEventListener<E extends keyof WindowEventMap>(
        type: E,
        callback: WindowEventListener<E>,
        options?: boolean | EventListenerOptions
    ): void {
        globalThis.window.removeEventListener(type, callback, options);
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
export const {
    addDocumentEventListener,
    addWindowEventListener,
    removeDocumentEventListener,
    removeWindowEventListener
} = m;
/* eslint-enable @typescript-eslint/unbound-method */
