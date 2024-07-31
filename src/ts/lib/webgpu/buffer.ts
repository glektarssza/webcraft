//-- Project Code
import {createUUID, UUID} from '../common';
import {Context} from './context';

/**
 * A WebGPU buffer.
 */
export type WebGPUBuffer = GPUBuffer & {
    /**
     * The unique ID of this instance.
     */
    readonly id: UUID;

    /**
     * The WebGPU rendering context that owns this instance.
     */
    readonly context: Context;
};

export type WebGPUBufferDescriptor = GPUBufferDescriptor & {
    /**
     * The unique ID of the new instance.
     *
     * A new ID will be generated if none is provided.
     */
    readonly id?: UUID;

    /**
     * The WebGPU rendering context that will own the new instance.
     */
    readonly context: Context;
};

/**
 * A WebGPU buffer descriptor without the `size` property.
 */
export type WebGPUBufferDescriptorWithoutSize = Omit<
    WebGPUBufferDescriptor,
    'size'
>;

/**
 * Create a new {@link WebGPUBuffer | WebGPU buffer}.
 *
 * @param descriptor - The descriptor for the new instance.
 *
 * @returns The new instance.
 */
export function createWebGPUBuffer(
    descriptor: WebGPUBufferDescriptor
): WebGPUBuffer {
    const {id = createUUID(), context, ...bufferDescriptor} = descriptor;
    // TODO: Check if the context already has a resource with the same ID
    const native = context.device.createBuffer(bufferDescriptor);
    const buffer = Object.assign(native, {id, context});
    return Object.freeze(buffer);
}

/**
 * Upload data to a {@link WebGPUBuffer | WebGPU buffer}.
 *
 * @param buffer - The buffer to upload data to.
 * @param data - The data to upload.
 * @param bufferOffset - The offset, in bytes, into the buffer to start writing data
 * at.
 * @param dataOffset - The offset, in bytes, into the data to start reading data
 * at. If the data is a `TypedArray` then this value is in elements; otherwise
 * it is in bytes.
 * @param size - The amount of data to write into the buffer. If the data is a
 * `TypedArray` then this value is in elements; otherwise it is in bytes.
 */
export function uploadDataToWebGPUBuffer(
    buffer: WebGPUBuffer,
    bufferOffset: GPUSize64,
    data: BufferSource | SharedArrayBuffer,
    dataOffset?: GPUSize64,
    size?: GPUSize64
): void {
    const {device} = buffer.context;
    device.queue.writeBuffer(buffer, bufferOffset, data, dataOffset, size);
}

/**
 * Create a new {@link WebGPUBuffer | WebGPU buffer} and upload data to it.
 *
 * @param descriptor - The descriptor for the new instance.
 * @param data - The data to upload.
 *
 * @returns The new instance.
 */
export function createBufferFromData(
    descriptor: WebGPUBufferDescriptorWithoutSize,
    data: BufferSource | SharedArrayBuffer
): WebGPUBuffer {
    const buffer = createWebGPUBuffer({
        ...descriptor,
        size: data.byteLength
    });
    uploadDataToWebGPUBuffer(buffer, 0, data);
    return buffer;
}
