//-- Project Code
import type {Context} from './context';

/**
 * A module which provides various WebGPU-related functionality.
 */
const m = {
    /**
     * Load a WebGPU texture from remote data.
     *
     * @param context - The WebGPU context that will be used to create the new
     * texture.
     * @param url - The location of the remote data to load.
     * @param options - Any additional options to use when creating the texture.
     *
     * @returns A promise that resolves to a new WebGPU texture on success or
     * rejects if any errors occur.
     *
     * @throws `Error`
     * Thrown if the remote data fails to be fetched.
     */
    async loadTexture(
        context: Context,
        url: RequestInfo | URL,
        descriptor: Omit<GPUTextureDescriptor, 'size'>
    ): Promise<GPUTexture> {
        const resp = await fetch(url);
        if (!resp.ok) {
            throw new Error('Failed to fetch remote texture');
        }
        const data = await resp.blob();
        const img = document.createElement('img');
        img.src = URL.createObjectURL(data);
        await img.decode();
        const {device} = context;
        const texture = device.createTexture({
            ...descriptor,
            size: {
                width: img.width,
                height: img.height
            }
        });
        const bmp = await createImageBitmap(img, {
            colorSpaceConversion: 'none',
            premultiplyAlpha: 'premultiply',
            imageOrientation: 'flipY'
        });
        device.queue.copyExternalImageToTexture(
            {
                source: bmp
            },
            {
                texture,
                origin: {
                    x: 0,
                    y: 0
                }
            },
            {
                width: img.width,
                height: img.height
            }
        );
        return texture;
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
export const {loadTexture} = m;
/* eslint-enable @typescript-eslint/unbound-method */
