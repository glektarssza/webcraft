//-- Project Code
import {getInternalModule as getContextModule} from './context';

export type * from './types';

/**
 * A module which provides various WebGPU-related functionality.
 */
const m = {
    ...getContextModule()
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
    createContext,
    createHTMLCanvasContext,
    createOffscreenCanvasContext
} = m;
/* eslint-enable @typescript-eslint/unbound-method */
