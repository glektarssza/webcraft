//-- Project Code
import {createUUID, UUID} from '../common';
import {WebGPUContext} from './context';

/**
 * A WebGPU shader.
 */
export type WebGPUShader = GPUShaderModule & {
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
 * A descriptor for creating a new {@link WebGPUShader | WebGPU shader}.
 */
export type WebGPUShaderDescriptor = GPUShaderModuleDescriptor & {
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
 * A {@link WebGPUShader | WebGPU shader} descriptor without the `code`
 * property.
 */
export type WebGPUShaderDescriptorWithoutCode = Omit<
    WebGPUShaderDescriptor,
    'code'
>;

/**
 * Create a new {@link WebGPUShader | WebGPU shader}.
 *
 * @param descriptor - The descriptor for the new instance.
 *
 * @returns The new instance.
 */
export function createWebGPUShader(
    descriptor: WebGPUShaderDescriptor
): WebGPUShader {
    const {id = createUUID(), context, ...shaderDescriptor} = descriptor;
    // TODO: Check if the context already has a resource with the same ID
    const native = context.device.createShaderModule(shaderDescriptor);
    const shader = Object.assign(native, {id, context});
    return Object.freeze(shader);
}

/**
 * Load a WebGPU shader from a remote resource.
 *
 * @param sourceUrl - The remote location of the shader source code.
 * @param descriptor - The descriptor for the new instance.
 * @param init - The options for the `fetch` request.
 *
 * @returns A promise that resolves to the new instance upon success or rejects
 * if any errors occur.
 *
 * @throws `Error`
 * Thrown if the request fails.
 */
export async function loadWebGPUShader(
    sourceUrl: URL | RequestInfo,
    descriptor: WebGPUShaderDescriptorWithoutCode,
    init?: RequestInit
): Promise<WebGPUShader> {
    const resp = await fetch(sourceUrl, init);
    if (!resp.ok) {
        throw new Error(
            `Failed to load WebGPU shader from ${resp.url} (${resp.status} - ${resp.statusText})`
        );
    }
    const code = await resp.text();
    return createWebGPUShader({...descriptor, code});
}
