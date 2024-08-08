import {Context} from './context';

/**
 * The global scope object.
 */
let globalObject: typeof globalThis = globalThis;

/**
 * Sets the global scope object.
 *
 * This function is for use in unit tests only.
 *
 * @param object - The global scope object.
 *
 * @internal
 */
export function setGlobalObject(object: typeof globalThis): void {
    globalObject = object;
}

/**
 * Load a WebGPU shader from a remote URL.
 *
 * @param context - The WebGPU rendering context.
 * @param sourceUrl - The URL of the remote shader source code.
 * @param descriptor - An optional WebGPU shader module descriptor.
 * @param init - An optional request init object to pass to the global `fetch`
 * function.
 *
 * @returns A promise that resolves to a WebGPU shader module upon success
 * or rejects if any errors occur.
 *
 * @throws `Error`
 * Thrown if the request returned an error status.
 */
export async function loadShader(
    context: Context,
    sourceUrl: URL | RequestInfo,
    descriptor?: Omit<GPUShaderModuleDescriptor, 'code'>,
    init?: RequestInit
): Promise<GPUShaderModule> {
    const resp = await globalObject.fetch(sourceUrl, init);
    if (!resp.ok) {
        throw new Error(
            `Failed to load shader from "${resp.url}" (${resp.status} - ${resp.statusText})`
        );
    }
    const code = await resp.text();
    return context.device.createShaderModule({...descriptor, code});
}
