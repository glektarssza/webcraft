//-- Project Code
import type {Canvas} from './types';

/**
 * A WebGPU rendering context.
 *
 * @typeParam TCanvas - The type of canvas instances of this interface render
 * to.
 */
export interface ContextBase<TCanvas extends Canvas> {
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
export type HTMLContext = ContextBase<HTMLCanvasElement>;

/**
 * A WebGPU rendering context the renders to an offscreen canvas.
 */
export type OffscreenContext = ContextBase<OffscreenCanvas>;

/**
 * A WebGPU rendering context.
 */
export type Context = HTMLContext | OffscreenContext;

/**
 * Options for creating a new {@link ContextBase} instance.
 */
export interface ContextOptions {
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
 * Create a new {@link ContextBase | WebGPU rendering context}.
 *
 * @typeParam TCanvas - The type of canvas the new instance will render to.
 *
 * @param canvas - The canvas the new instance will render.
 * @param options - The options to use to create the new instance.
 *
 * @returns A promise that resolves to the newly created instance on success or
 * rejects if any errors occur.
 */
export async function createContext<TCanvas extends Canvas>(
    canvas: TCanvas,
    options?: ContextOptions
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
        adapter,
        device,
        canvas,
        canvasContext
    };
}

/**
 * Create a new {@link ContextBase | WebGPU rendering context} that renders to a
 * HTML canvas element.
 *
 * @param options - The options to use to create the new instance.
 *
 * @returns A promise that resolves to the newly created instance on success or
 * rejects if any errors occur.
 */
export async function createHTMLContext(
    options?: ContextOptions
): Promise<HTMLContext> {
    const canvas = document.createElement('canvas');
    return createContext(canvas, options);
}

/**
 * Create a new {@link ContextBase | WebGPU rendering context} that renders to
 * an offscreen canvas.
 *
 * @param options - The options to use to create the new instance.
 *
 * @returns A promise that resolves to the newly created instance on success or
 * rejects if any errors occur.
 */
export async function createOffscreenContext(
    width: number,
    height: number,
    options?: ContextOptions
): Promise<OffscreenContext> {
    const canvas = new OffscreenCanvas(width, height);
    return createContext(canvas, options);
}
