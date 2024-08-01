//-- Project Code
import type {Canvas} from './types';

/**
 * A WebGPU rendering context.
 *
 * @typeParam TCanvas - The type of canvas instances of this interface render
 * to.
 */
export interface WebGPUContextBase<TCanvas extends Canvas> {
    /**
     * The canvas this instance renders to.
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
 * A WebGPU rendering context the renders to a HTML canvas element.
 */
export type WebGPUHTMLContext = WebGPUContextBase<HTMLCanvasElement>;

/**
 * A WebGPU rendering context the renders to an offscreen canvas.
 */
export type WebGPUOffscreenContext = WebGPUContextBase<OffscreenCanvas>;

/**
 * A WebGPU rendering context.
 */
export type WebGPUContext = WebGPUHTMLContext | WebGPUOffscreenContext;

/**
 * Options for creating a new {@link WebGPUContextBase} instance.
 */
export interface WebGPUContextOptions {
    /**
     * Options for configuring the
     * {@link GPUCanvasContext | WebGPU canvas context}.
     */
    readonly canvasContext?: Partial<Omit<GPUCanvasConfiguration, 'device'>>;

    /**
     * Options for requesting the {@link GPUAdapter | WebGPU adapter}.
     */
    readonly adapter?: GPURequestAdapterOptions;

    /**
     * Options for requesting the {@link GPUDevice | WebGPU device}.
     */
    readonly device?: GPUDeviceDescriptor;
}

/**
 * Create a new {@link WebGPUContextBase | WebGPU rendering context}.
 *
 * @typeParam TCanvas - The type of canvas the new instance will render to.
 *
 * @param canvas - The canvas the new instance will render.
 * @param options - The options to use to create the new instance.
 *
 * @returns A promise that resolves to the newly created instance on success or
 * rejects if any errors occur.
 */
export async function createWebGPUContext<TCanvas extends Canvas>(
    canvas: TCanvas,
    options?: WebGPUContextOptions
): Promise<WebGPUContextBase<TCanvas>> {
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
        adapter,
        device,
        canvas,
        canvasContext
    };
}

/**
 * Create a new {@link WebGPUContextBase | WebGPU rendering context} that renders to a
 * HTML canvas element.
 *
 * @param options - The options to use to create the new instance.
 *
 * @returns A promise that resolves to the newly created instance on success or
 * rejects if any errors occur.
 */
export async function createWebGPUHTMLContext(
    options?: WebGPUContextOptions
): Promise<WebGPUHTMLContext> {
    const canvas = document.createElement('canvas');
    return createWebGPUContext(canvas, options);
}

/**
 * Create a new {@link WebGPUContextBase | WebGPU rendering context} that renders to
 * an offscreen canvas.
 *
 * @param options - The options to use to create the new instance.
 *
 * @returns A promise that resolves to the newly created instance on success or
 * rejects if any errors occur.
 */
export async function createWebGPUOffscreenContext(
    width: number,
    height: number,
    options?: WebGPUContextOptions
): Promise<WebGPUOffscreenContext> {
    const canvas = new OffscreenCanvas(width, height);
    return createWebGPUContext(canvas, options);
}
