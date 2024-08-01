//-- Project Code
import {createUUID, UUID} from '../common';
import {WebGPUContext} from './context';

/**
 * A WebGPU rendering pipeline.
 */
export type WebGPURenderPipeline = GPURenderPipeline & {
    /**
     * The unique ID of this instance.
     */
    readonly id: UUID;

    /**
     * The WebGPU rendering context that owns this instance.
     */
    readonly context: WebGPUContext;
};

/**
 * A descriptor for creating a new
 * {@link WebGPURenderPipeline | WebGPU rendering pipeline}.
 */
export type WebGPURenderPipelineDescriptor = GPURenderPipelineDescriptor & {
    /**
     * The unique ID of the new instance.
     *
     * A new ID will be generated if none is provided.
     */
    readonly id?: UUID;

    /**
     * The WebGPU rendering context that will own the new instance.
     */
    readonly context: WebGPUContext;
};

/**
 * Create a new {@link WebGPURenderPipeline | WebGPU rendering pipeline}.
 *
 * @param descriptor - The descriptor for the new instance.
 *
 * @returns The new instance.
 */
export function createWebGPURenderPipeline(
    descriptor: WebGPURenderPipelineDescriptor
): WebGPURenderPipeline {
    const {id = createUUID(), context, ...pipelineDescriptor} = descriptor;
    // TODO: Check if the context already has a resource with the same ID
    const native = context.device.createRenderPipeline(pipelineDescriptor);
    const pipeline = Object.assign(native, {id, context});
    return Object.freeze(pipeline);
}

/**
 * Create a new {@link WebGPURenderPipeline | WebGPU rendering pipeline}
 * asynchronously.
 *
 * @param descriptor - The descriptor for the new instance.
 *
 * @returns A promise that resolves to the new instance upon success or rejects
 * if any errors occur.
 */
export async function createWebGPURenderPipelineAsync(
    descriptor: WebGPURenderPipelineDescriptor
): Promise<WebGPURenderPipeline> {
    const {id = createUUID(), context, ...pipelineDescriptor} = descriptor;
    // TODO: Check if the context already has a resource with the same ID
    const native =
        await context.device.createRenderPipelineAsync(pipelineDescriptor);
    const pipeline = Object.assign(native, {id, context});
    return Object.freeze(pipeline);
}
