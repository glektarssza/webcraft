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
 * A function that can handle events being fired by a {@link Document}.
 *
 * @typeParam TEvent - The type of event that will be handled by functions of
 * this type.
 *
 * @param event - The event being passed along.
 */
export type DocumentEventListener<TEvent extends keyof DocumentEventMap> = (
    this: Document,
    event: DocumentEventMap[TEvent]
) => void;

/**
 * A function that can handle events being fired by a {@link Window}.
 *
 * @typeParam TEvent - The type of event that will be handled by functions of
 * this type.
 *
 * @param event - The event being passed along.
 */
export type WindowEventListener<TEvent extends keyof WindowEventMap> = (
    this: Window,
    event: WindowEventMap[TEvent]
) => void;

/**
 * Add a function to be called when a {@link Document} fires an event.
 *
 * @param event - The event to add the function as a listener for.
 * @param listener - The function to add as a listener.
 * @param options - Any additional options to use when adding the function or a
 * boolean to specify whether to add the function to the `capture` phase.
 * @param document - The document to add the function as a listener to.
 */
export function addDocumentEventListener<TEvent extends keyof DocumentEventMap>(
    event: TEvent,
    listener: DocumentEventListener<TEvent>,
    options?: boolean | AddEventListenerOptions,
    document: Document = globalObject.document
): void {
    document.addEventListener(event, listener, options);
}

/**
 * Remove a function to be called when a {@link Document} fires an event.
 *
 * @param event - The event to remove the function as a listener for.
 * @param listener - The function to remove as a listener.
 * @param options - Any additional options to use when removing the function or
 * a boolean to specify whether to remove the function from the `capture` phase.
 * @param document - The document to remove the function as a listener from.
 */
export function removeDocumentEventListener<
    TEvent extends keyof DocumentEventMap
>(
    event: TEvent,
    listener: DocumentEventListener<TEvent>,
    options?: boolean | EventListenerOptions,
    document: Document = globalObject.document
): void {
    document.removeEventListener(event, listener, options);
}

/**
 * Add a function to be called when a {@link Window} fires an event.
 *
 * @param event - The event to add the function as a listener for.
 * @param listener - The function to add as a listener.
 * @param options - Any additional options to use when adding the function or a
 * boolean to specify whether to add the function to the `capture` phase.
 * @param window - The window to add the function as a listener to.
 */
export function addWindowEventListener<TEvent extends keyof WindowEventMap>(
    event: TEvent,
    listener: WindowEventListener<TEvent>,
    options?: boolean | AddEventListenerOptions,
    window: Window = globalObject.window
): void {
    window.addEventListener(event, listener, options);
}

/**
 * Remove a function to be called when a {@link Window} fires an event.
 *
 * @param event - The event to remove the function as a listener for.
 * @param listener - The function to remove as a listener.
 * @param options - Any additional options to use when removing the function or
 * a boolean to specify whether to remove the function from the `capture` phase.
 * @param window - The window to remove the function as a listener from.
 */
export function removeWindowEventListener<TEvent extends keyof WindowEventMap>(
    event: TEvent,
    listener: WindowEventListener<TEvent>,
    options?: boolean | EventListenerOptions,
    window: Window = globalObject.window
): void {
    window.removeEventListener(event, listener, options);
}
