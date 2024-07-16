//-- Project Code
import {createUUID, type UUID} from '../utils/uuid';
import type {Context} from './context';

/**
 * An object which wraps around a native WebGPU resource.
 */
export interface Resource<TNative extends GPUObjectBase> {
    /**
     * The UUID of this instance.
     */
    readonly id: UUID;

    /**
     * The WebGPU rendering context that owns this instance.
     */
    readonly context: Context;

    /**
     * The native WebGPU resource object.
     */
    readonly native: TNative;
}

/**
 * Create a new {@link Resource} from a given native WebGPU object.
 *
 * This function will add the newly created {@link Resource} to the
 * {@link Context | WebGPU rendering context's}
 * {@link Context.resources | resources} map and, by extension, its
 * {@link Context.resourceList | resource list}.
 *
 * @param context - The WebGPU rendering context that owns the native WebGPU
 * object.
 * @param native - The native WebGPU object.
 *
 * @returns The newly created {@link Resource}.
 */
export function createResourceFromNative<TNative extends GPUObjectBase>(
    context: Context,
    native: TNative
): Resource<TNative> {
    const id = createUUID();
    const resource = {
        id,
        context,
        native
    };
    context.resources.set(id, resource);
    return resource;
}
