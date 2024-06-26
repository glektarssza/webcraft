//-- Project Code
import {getInternalModule as getContextModule} from './context';
import {getInternalModule as getShaderModule} from './shader';
import {getInternalModule as getTextureModule} from './texture';
import {getInternalModule as getGeometryModule} from './geometry';
import {getInternalModule as getMeshModule} from './mesh';

export type * from './types';

/**
 * A module which provides various WebGPU-related functionality.
 */
const m = {
    ...getContextModule(),
    ...getShaderModule(),
    ...getTextureModule(),
    ...getGeometryModule(),
    ...getMeshModule()
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
    createOffscreenCanvasContext,
    createCubeGeometry,
    geometryToTypedArray,
    loadShaderModule,
    loadTexture
} = m;
/* eslint-enable @typescript-eslint/unbound-method */
