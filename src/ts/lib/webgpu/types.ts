/**
 * A canvas which a WebGPU context can render to.
 */
export type Canvas = HTMLCanvasElement | OffscreenCanvas;

/**
 * A module which provides various WebGPU types.
 */
const m = {};

/**
 * Get the internal module for unit testing.
 *
 * @returns The internal module.
 *
 * @internal
 */
export function getInternalModule(): typeof m {
    return m;
}

/* eslint-disable no-empty-pattern, @typescript-eslint/unbound-method */
export const {} = m;
/* eslint-enable no-empty-pattern, @typescript-eslint/unbound-method */
