//-- Project Code
import type {Distinct} from '../utils/types';

/**
 * A type union of valid canvas types.
 */
export type Canvas = HTMLCanvasElement | OffscreenCanvas;

/**
 * A simple vertex in 3D space.
 */
export type Vertex = Distinct<[number, number, number]>;

/**
 * A simple 3D normal.
 */
export type Normal = Distinct<[number, number, number]>;

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
