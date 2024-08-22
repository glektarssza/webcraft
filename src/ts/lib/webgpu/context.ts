//-- Project Code
import type {Canvas} from './type';

/**
 * The global object.
 */
let globalObject: typeof globalThis = globalThis;

/**
 * Set the global object for unit testing.
 *
 * @param go - The global object to be used.
 */
export function setGlobalObject(go: typeof globalThis): void {
    globalObject = go;
}

/**
 * Reset the global object for unit testing.
 */
export function resetGlobalObject(): void {
    globalObject = globalThis;
}

/**
 * Options for creating a {@link ContextBase}.
 */
export interface ContextBaseOptions {
    /**
     * Options for requesting a {@link GPUAdapter | WebGPU adapter}.
     */
    readonly adapter?: GPURequestAdapterOptions;

    /**
     * Options for requesting a {@link GPUDevice | WebGPU device}.
     */
    readonly device?: GPUDeviceDescriptor;

    /**
     * Options for configuring a
     * {@link GPUCanvasContext | WebGPU canvas context}.
     */
    readonly canvasContext?: Partial<Omit<GPUCanvasConfiguration, 'device'>>;
}

/**
 * The base WebGPU rendering context type.
 *
 * @typeParam TCanvas - The type of canvas to render to.
 */
export interface ContextBase<TCanvas extends Canvas> {
    /**
     * The WebGPU adapter being used by this instance.
     */
    readonly adapter: GPUAdapter;

    /**
     * The WebGPU device being used by this instance.
     */
    readonly device: GPUDevice;

    /**
     * The canvas being used by this instance.
     */
    readonly canvas: TCanvas;

    /**
     * The canvas context being used by this instance.
     */
    readonly canvasContext: GPUCanvasContext;
}

/**
 * A WebGPU rendering context that renders to a HTML canvas.
 */
export type HTMLContext = ContextBase<HTMLCanvasElement>;

/**
 * A WebGPU rendering context that renders to an offscreen canvas.
 */
export type OffscreenContext = ContextBase<OffscreenCanvas>;

/**
 * A type union of all WebGPU rendering context types.
 */
export type Context = HTMLContext | OffscreenContext;

/**
 * Creates a new WebGPU rendering context.
 *
 * @typeParam TCanvas - The type of canvas to render to.
 *
 * @param canvas - The canvas to render to.
 * @param options - The options to use when creating the new instance.
 *
 * @returns A promise that resolves with the new rendering context upon success
 * or rejects if an error occurs.
 *
 * @throws `Error`
 * Thrown if the platform does not support WebGPU.
 * @throws `Error`
 * Thrown if the WebGPU adapter could not be fetched.
 * @throws `Error`
 * Thrown if the WebGPU device could not be fetched.
 * @throws `Error`
 * Thrown if the WebGPU canvas context could not be fetched.
 */
export async function createContext<TCanvas extends Canvas>(
    canvas: TCanvas,
    options?: ContextBaseOptions
): Promise<ContextBase<TCanvas>> {
    if (!globalObject.navigator.gpu) {
        throw new Error('WebGPU is not supported on this platform');
    }
    const adapter = await globalObject.navigator.gpu.requestAdapter(
        options?.adapter
    );
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
        format: globalObject.navigator.gpu.getPreferredCanvasFormat(),
        ...options?.canvasContext,
        device
    });
    return {adapter, device, canvas, canvasContext};
}

/**
 * Creates a new WebGPU rendering context that renders to a HTML canvas.
 *
 * @param options - The options to use when creating the new instance.
 *
 * @returns A promise that resolves with the new rendering context upon success
 * or rejects if an error occurs.
 */
export async function createHTMLContext(
    options?: ContextBaseOptions
): Promise<HTMLContext> {
    const canvas = globalObject.document.createElement('canvas');
    return createContext(canvas, options);
}

/**
 * Creates a new WebGPU rendering context that renders to an offscreen canvas.
 *
 * @param width - The width of the offscreen canvas to create.
 * @param height - The height of the offscreen canvas to create.
 * @param options - The options to use when creating the new instance.
 *
 * @returns A promise that resolves with the new rendering context upon success
 * or rejects if an error occurs.
 */
export async function createOffscreenContext(
    width: number,
    height: number,
    options?: ContextBaseOptions
): Promise<OffscreenContext> {
    const canvas = new globalObject.OffscreenCanvas(width, height);
    return createContext(canvas, options);
}
