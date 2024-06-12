/**
 * A type union of valid canvas types.
 */
export type Canvas = HTMLCanvasElement | OffscreenCanvas;

/**
 * A module which provides various WebGPU-related typings.
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
