//-- Project Code
import {createUUID, type UUID} from '../utils/uuid';

/**
 * A union type of all valid canvases.
 */
export type Canvas = HTMLCanvasElement | OffscreenCanvas;

/**
 * A base type for all WebGPU rendering contexts.
 *
 * @typeParam TCanvas - The type of the canvas that will be rendered into.
 */
export interface ContextBase<TCanvas extends Canvas> {
    /**
     * The unique identifier for this instance.
     */
    readonly id: UUID;

    /**
     * The WebGPU adapter for this instance.
     */
    readonly adapter: GPUAdapter;

    /**
     * The WebGPU device for this instance.
     */
    readonly device: GPUDevice;

    /**
     * The canvas this instance outputs to.
     */
    readonly canvas: TCanvas;

    /**
     * The WebGPU canvas context for this instance.
     */
    readonly canvasContext: GPUCanvasContext;
}

/**
 * Options for creating a {@link ContextBase}.
 */
export interface ContextBaseOptions {
    /**
     * Options for requesting the {@link GPUAdapter}.
     */
    adapter?: GPURequestAdapterOptions;

    /**
     * Options for requesting the {@link GPUDevice}.
     */
    device?: GPUDeviceDescriptor;

    /**
     * Options for configuring the {@link GPUCanvasContext}.
     */
    canvasContext?: Partial<Omit<GPUCanvasConfiguration, 'device'>>;
}

/**
 * A WebGPU rendering context that outputs to a HTML canvas.
 */
export type HTMLContext = ContextBase<HTMLCanvasElement>;

/**
 * A WebGPU rendering context that outputs to an offscreen canvas.
 */
export type OffscreenContext = ContextBase<OffscreenCanvas>;

/**
 * A union type of all WebGPU rendering contexts.
 */
export type Context = HTMLContext | OffscreenContext;

/**
 * Create a {@link ContextBase}.
 *
 * @param canvas - The canvas to render to.
 * @param options - The options to use for creating the new {@link ContextBase}.
 *
 * @returns A promise that resolves to the new {@link ContextBase} on success or
 * rejects if any errors occur.
 *
 * @throws `Error`
 * Thrown if WebGPU is not supported on this platform.
 * @throws `Error`
 * Thrown if a WebGPU adapter cannot be fetched.
 * @throws `Error`
 * Thrown if a WebGPU device cannot be fetched.
 * @throws `Error`
 * Thrown if a WebGPU canvas context cannot be fetched.
 */
export async function createContext<TCanvas extends Canvas>(
    canvas: TCanvas,
    options?: ContextBaseOptions
): Promise<ContextBase<TCanvas>> {
    if (!navigator.gpu) {
        throw new Error('WebGPU is not supported on this platform');
    }
    const adapter = await navigator.gpu.requestAdapter(options?.adapter);
    if (!adapter) {
        throw new Error('Failed to fetch WebGPU adapter');
    }
    const device = await adapter.requestDevice(options?.device);
    if (!device) {
        throw new Error('Failed to fetch WebGPU device');
    }
    const canvasContext = canvas.getContext('webgpu');
    if (!canvasContext) {
        throw new Error('Failed to fetch WebGPU canvas context');
    }
    canvasContext.configure({
        format: navigator.gpu.getPreferredCanvasFormat(),
        ...options?.canvasContext,
        device
    });
    return {
        id: createUUID(),
        adapter,
        device,
        canvas,
        canvasContext
    };
}

/**
 * Create a {@link HTMLContext}.
 *
 * @param options - The options to use for creating the new {@link HTMLContext}.
 *
 * @returns A promise that resolves to the new {@link HTMLContext} on success or
 * rejects if any errors occur.
 *
 * @throws `Error`
 * Thrown if WebGPU is not supported on this platform.
 * @throws `Error`
 * Thrown if a WebGPU adapter cannot be fetched.
 * @throws `Error`
 * Thrown if a WebGPU device cannot be fetched.
 * @throws `Error`
 * Thrown if a WebGPU canvas context cannot be fetched.
 */
export async function createHTMLContext(
    options?: ContextBaseOptions
): Promise<HTMLContext> {
    const canvas = globalThis.document.createElement('canvas');
    return createContext(canvas, options);
}

/**
 * Create an {@link OffscreenContext}.
 *
 * @param width - The width of the {@link OffscreenCanvas} to create and output
 * to.
 * @param height - The height of the {@link OffscreenCanvas} to create and
 * output to.
 * @param options - The options to use for creating the new
 * {@link OffscreenContext}.
 *
 * @returns A promise that resolves to the new {@link OffscreenContext} on
 * success or rejects if any errors occur.
 *
 * @throws `Error`
 * Thrown if WebGPU is not supported on this platform.
 * @throws `Error`
 * Thrown if a WebGPU adapter cannot be fetched.
 * @throws `Error`
 * Thrown if a WebGPU device cannot be fetched.
 * @throws `Error`
 * Thrown if a WebGPU canvas context cannot be fetched.
 */
export async function createOffscreenContext(
    width: number,
    height: number,
    options?: ContextBaseOptions
): Promise<OffscreenContext> {
    const canvas = new OffscreenCanvas(width, height);
    return createContext(canvas, options);
}
