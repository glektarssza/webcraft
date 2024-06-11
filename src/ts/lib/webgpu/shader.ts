//-- Project Code
import type {Context} from './context';

/**
 * A module which provides various WebGPU-related functionality.
 */
const m = {
    /**
     * Load a WebGPU shader module from remote source code.
     *
     * @param context - The WebGPU context that will be used to create the new
     * shader module.
     * @param url - The location of the remote source code to load.
     * @param options - Any additional options to use when creating the shader
     * module.
     *
     * @returns A promise that resolves to a new WebGPU shader module on success
     * or rejects if any errors occur.
     *
     * @throws `Error`
     * Thrown if the remote source code fails to be fetched.
     */
    async loadShaderModule(
        context: Context,
        url: RequestInfo | URL,
        options?: Omit<GPUShaderModuleDescriptor, 'code'>
    ): Promise<GPUShaderModule> {
        const resp = await fetch(url);
        if (!resp.ok) {
            throw new Error('Failed to fetch remote shader module source code');
        }
        const code = await resp.text();
        const {device} = context;
        return device.createShaderModule({
            ...options,
            code
        });
    }
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
export const {loadShaderModule} = m;
/* eslint-enable @typescript-eslint/unbound-method */
