//-- Project Code
import type {WebGPUContext} from './context';
import {
    type WebGPUResource,
    getInternalModule as getResourceModule
} from './resource';

/**
 * A WebGPU buffer.
 */
export type WebGPUBuffer = WebGPUResource<GPUBuffer>;

/**
 * A module which provides various WebGPU buffer-related functionality.
 */
const m = {
    ...getResourceModule(),

    /**
     * Create a new WebGPU buffer.
     *
     * @param context - The WebGPU context that will own the new instance.
     * @param sizeBytes - The size of the new instance to create.
     * @param usage - The usage mode to configure the new instance with.
     * @param options - Any additional options to configure the new instance
     * with.
     *
     * @returns The new instance.
     */
    createBuffer(
        context: WebGPUContext,
        sizeBytes: number,
        usage: GPUBufferUsageFlags,
        options?: Omit<GPUBufferDescriptor, 'size' | 'usage'>
    ): WebGPUBuffer {
        const {device} = context;
        const native = device.createBuffer({
            ...options,
            size: sizeBytes,
            usage
        });
        return m.createResource(context, native);
    },

    /**
     * Upload data into a WebGPU buffer.
     *
     * @param buffer - The buffer to upload data to.
     * @param data - The data to upload.
     * @param offset - The offset into the buffer to upload the data at.
     * @param dataOffset - The offset into the data to start uploading from.
     * @param size - The amount of data from the data source to upload.
     */
    uploadData(
        buffer: WebGPUBuffer,
        data: BufferSource | SharedArrayBuffer,
        offset: GPUSize64 = 0,
        dataOffset?: GPUSize64,
        size?: GPUSize64
    ): void {
        const {device} = buffer.context;
        device.queue.writeBuffer(buffer.native, offset, data, dataOffset, size);
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
export const {createBuffer, uploadData} = m;
/* eslint-enable @typescript-eslint/unbound-method */
