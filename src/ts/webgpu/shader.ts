//-- Project Code
import type {Context} from './context';
import {createResourceFromNative, type Resource} from './resource';

/**
 * A WebGPU shader.
 */
export type Shader = Resource<GPUShaderModule>;

/**
 * Options for creating a {@link Shader}.
 */
export type ShaderOptions = Omit<GPUShaderModuleDescriptor, 'code'>;

/**
 * Create a new {@link Shader}.
 *
 * @param context - The {@link Context} that will own the new {@link Shader}.
 * @param code - The source code to use to create the new {@link Shader}.
 * @param options - Any additional options to create the {@link Shader} with.
 *
 * @returns The newly created {@link Shader}.
 */
export function createShader(
    context: Context,
    code: string,
    options?: ShaderOptions
): Shader {
    const {device} = context;
    const native = device.createShaderModule({
        code,
        ...options
    });
    return createResourceFromNative(context, native);
}

/**
 * Create a new {@link Shader} from remote source code.
 *
 * @param context - The {@link Context} that will own the new {@link Shader}.
 * @param codeUrl - The location of the remote source code to use to create the
 * new {@link Shader}.
 * @param options - Any additional options to create the {@link Shader} with.
 *
 * @returns A promise that resolves to the newly created {@link Shader} on
 * success or rejects if any errors occur.
 *
 * @throws `Error`
 * Thrown if the remote source code fails to be fetched.
 */
export async function loadShader(
    context: Context,
    codeUrl: URL | RequestInfo,
    options?: ShaderOptions
): Promise<Shader> {
    const resp = await fetch(codeUrl);
    if (!resp.ok) {
        throw new Error(
            `Failed to fetch "${resp.url} (${resp.status} - ${resp.statusText})"`
        );
    }
    const code = await resp.text();
    return createShader(context, code, options);
}
