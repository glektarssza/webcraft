//-- Project Code
import {type UUID, createUUID} from '@webcraft/common';
import type {WebGPUContext} from './context';

/**
 * A WebGPU resource.
 *
 * @typeParam T - The type of WebGPU object wrapped by this object.
 */
export interface WebGPUResource<T extends GPUObjectBase> {
    /**
     * The unique identifier of this instance.
     */
    readonly id: UUID;

    /**
     * The WebGPU rendering context that owns this instance.
     */
    readonly context: WebGPUContext;

    /**
     * The native object wrapped by this instance.
     */
    readonly native: T;
}

/**
 * A module which provides various WebGPU resource-related functionality.
 */
const m = {
    /**
     * Create a new WebGPU resource.
     *
     * @typeParam T - The type of WebGPU object which will be wrapped by the
     * new WebGPU resource.
     *
     * @param context - The WebGPU rendering context that will own the new
     * instance.
     * @param native - The WebGPU object that will be wrapped by the new
     * instance.
     *
     * @returns The new instance.
     */
    createResource<T extends GPUObjectBase>(
        context: WebGPUContext,
        native: T
    ): WebGPUResource<T> {
        const resource: WebGPUResource<T> = {
            id: createUUID(),
            context,
            native
        };
        context.resourceMap.set(resource.id, resource);
        return resource;
    }
};

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

/* eslint-disable @typescript-eslint/unbound-method */
export const {createResource} = m;
/* eslint-enable @typescript-eslint/unbound-method */
