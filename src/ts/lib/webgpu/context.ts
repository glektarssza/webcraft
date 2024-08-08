//-- Project Code
import type {Canvas} from './types';

export interface ContextOptions {
    /**
     * The options to use for fetching the WebGPU adapter.
     */
    readonly adapterOptions?: GPURequestAdapterOptions;

    /**
     * The options to use for fetching a WebGPU device.
     */
    readonly deviceOptions?: GPUDeviceDescriptor;

    /**
     * The options to use for configuring a WebGPU canvas context.
     */
    readonly canvasContextOptions?: Partial<
        Omit<GPUCanvasConfiguration, 'device'>
    >;
}

/**
 * A base context for WebGPU rendering.
 */
export interface ContextBase<TCanvas extends Canvas> {
    /**
     * The canvas this instance is rendering to.
     */
    readonly canvas: TCanvas;

    /**
     * The WebGPU canvas context this instance is using.
     */
    readonly canvasContext: GPUCanvasContext;

    /**
     * The WebGPU adapter this instance is using.
     */
    readonly adapter: GPUAdapter;

    /**
     * The WebGPU device this instance is using.
     */
    readonly device: GPUDevice;
}

/**
 * A WebGPU context for rendering to a HTML canvas element.
 */
export type HTMLContext = ContextBase<HTMLCanvasElement>;

/**
 * A WebGPU context for rendering to an offscreen canvas.
 */
export type OffscreenContext = ContextBase<OffscreenCanvas>;

/**
 * A WebGPU context for rendering.
 */
export type Context = HTMLContext | OffscreenContext;

/**
 * Create a new WebGPU context for rendering.
 *
 * @param canvas - The canvas to render to.
 * @param options - The options to use for creating the new instance.
 *
 * @returns A promise that resolves with the new instance upon success or
 * rejects if an error occurs.
 *
 * @throws `Error`
 * Thrown if WebGPU is not supported by the platform.
 * @throws `Error`
 * Thrown if the WebGPU adapter could not be fetched.
 * @throws `Error`
 * Thrown if the WebGPU device could not be fetched.
 * @throws `Error`
 * Thrown if the WebGPU canvas context could not be fetched.
 */
export async function createContext<TCanvas extends Canvas>(
    canvas: TCanvas,
    options?: ContextOptions
): Promise<ContextBase<TCanvas>> {
    if (!navigator.gpu) {
        throw new Error('WebGPU is not supported by this platform');
    }
    const adapter = await navigator.gpu.requestAdapter(options?.adapterOptions);
    if (!adapter) {
        throw new Error('Failed to fetch WebGPU adapter');
    }
    const device = await adapter.requestDevice(options?.deviceOptions);
    if (!device) {
        throw new Error('Failed to fetch WebGPU device');
    }
    const canvasContext = canvas.getContext('webgpu');
    if (!canvasContext) {
        throw new Error('Failed to fetch WebGPU canvas context');
    }
    canvasContext.configure({
        format: navigator.gpu.getPreferredCanvasFormat(),
        ...options?.canvasContextOptions,
        device
    });
    return {
        canvas,
        canvasContext,
        adapter,
        device
    };
}

/**
 * Create a new WebGPU context for rendering to a HTML canvas element.
 *
 * @param options - The options to use for creating the new instance.
 *
 * @returns A promise that resolves with the new instance upon success or
 * rejects if an error occurs.
 */
export async function createHTMLContext(
    options?: ContextOptions
): Promise<HTMLContext> {
    const canvas = document.createElement('canvas');
    return createContext(canvas, options);
}

/**
 * Create a new WebGPU context for rendering to an offscreen canvas.
 *
 * @param width - The width of the offscreen canvas to create.
 * @param height - The height of the offscreen canvas to create.
 * @param options - The options to use for creating the new instance.
 *
 * @returns A promise that resolves with the new instance upon success or
 * rejects if an error occurs.
 */
export async function createOffscreenContext(
    width: number,
    height: number,
    options?: ContextOptions
): Promise<OffscreenContext> {
    const canvas = new OffscreenCanvas(width, height);
    return createContext(canvas, options);
}
