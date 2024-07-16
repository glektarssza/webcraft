//-- Project Code
import type {Context} from './context';
import {createResourceFromNative, type Resource} from './resource';

/**
 * A WebGPU buffer.
 */
export type Buffer = Resource<GPUBuffer>;

/**
 * Options for creating a {@link Buffer}.
 */
export type BufferOptions = Omit<GPUBufferDescriptor, 'size' | 'usage'>;

/**
 * Create a new {@link Buffer}.
 *
 * @param context - The {@link Context} that will own the new {@link Buffer}.
 * @param size - The size of the {@link Buffer} to create, in bytes.
 * @param usage - The usage flags to create the new {@link Buffer} with.
 * @param options - Any additional options to create the {@link Buffer} with.
 *
 * @returns The newly created {@link Buffer}.
 */
export function createBuffer(
    context: Context,
    size: GPUSize64,
    usage: GPUBufferUsageFlags,
    options?: BufferOptions
): Buffer {
    const {device} = context;
    const native = device.createBuffer({
        size,
        usage,
        ...options
    });
    return createResourceFromNative(context, native);
}

/**
 * Create a new {@link Buffer} filled with some data.
 *
 * @param context - The {@link Context} that will own the new {@link Buffer}.
 * @param data - The data to create the {@link Buffer} with.
 * @param usage - The usage flags to create the new {@link Buffer} with.
 * @param options - Any additional options to create the {@link Buffer} with.
 *
 * @returns The newly created {@link Buffer}.
 */
export function createBufferWithData(
    context: Context,
    data: BufferSource | SharedArrayBuffer,
    usage: GPUBufferUsageFlags,
    options?: BufferOptions
): Buffer {
    const buffer = createBuffer(context, data.byteLength, usage, options);
    uploadDataToBuffer(buffer, data);
    return buffer;
}

/**
 * Upload data to a {@link Buffer}.
 *
 * @param buffer - The {@link Buffer} to upload data into.
 * @param data - The data to upload into the buffer.
 * @param bufferOffset - The offset into the {@link Buffer} to upload the data
 * at.
 */
export function uploadDataToBuffer(
    buffer: Buffer,
    data: BufferSource | SharedArrayBuffer,
    bufferOffset: GPUSize64 = 0
): void {
    const {device} = buffer.context;
    device.queue.writeBuffer(buffer.native, bufferOffset, data);
}

/**
 * Upload data to a {@link Buffer}.
 *
 * @param buffer - The {@link Buffer} to upload data into.
 * @param data - The data to upload into the buffer.
 * @param size - The amount of data to upload. Given in elements if `data` is a
 * typed array or bytes otherwise.
 * @param bufferOffset - The offset into the {@link Buffer} to upload the data
 * at.
 */
export function uploadDataSliceToBuffer(
    buffer: Buffer,
    data: BufferSource | SharedArrayBuffer,
    size: GPUSize64,
    bufferOffset: GPUSize64 = 0
): void {
    const {device} = buffer.context;
    device.queue.writeBuffer(buffer.native, bufferOffset, data, 0, size);
}

/**
 * Upload data to a {@link Buffer}.
 *
 * @param buffer - The {@link Buffer} to upload data into.
 * @param data - The data to upload into the buffer.
 * @param dataOffset - The offset into the data to upload data from. Given in
 * elements if `data` is a typed array or bytes otherwise.
 * @param bufferOffset - The offset into the {@link Buffer} to upload the data
 * at.
 */
export function uploadOffsetDataToBuffer(
    buffer: Buffer,
    data: BufferSource | SharedArrayBuffer,
    dataOffset: GPUSize64,
    bufferOffset: GPUSize64 = 0
): void {
    const {device} = buffer.context;
    device.queue.writeBuffer(buffer.native, bufferOffset, data, dataOffset);
}

/**
 * Upload data to a {@link Buffer}.
 *
 * @param buffer - The {@link Buffer} to upload data into.
 * @param data - The data to upload into the buffer.
 * @param dataOffset - The offset into the data to upload data from. Given in
 * elements if `data` is a typed array or bytes otherwise.
 * @param size - The amount of data to upload. Given in elements if `data` is a
 * typed array or bytes otherwise.
 * @param bufferOffset - The offset into the {@link Buffer} to upload the data
 * at.
 */
export function uploadOffsetDataSliceToBuffer(
    buffer: Buffer,
    data: BufferSource | SharedArrayBuffer,
    dataOffset: GPUSize64,
    size: GPUSize64,
    bufferOffset: GPUSize64 = 0
): void {
    const {device} = buffer.context;
    device.queue.writeBuffer(
        buffer.native,
        bufferOffset,
        data,
        dataOffset,
        size
    );
}
