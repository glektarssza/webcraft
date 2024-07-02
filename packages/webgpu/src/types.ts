/**
 * A canvas that a WebGPU rendering context that can be rendered to.
 */
export type Canvas = HTMLCanvasElement | OffscreenCanvas;

/**
 * A module which provides various utility typings.
 */
const m = {};

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

// eslint-disable-next-line no-empty-pattern
export const {} = m;
