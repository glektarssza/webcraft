//-- Project Code
import type {Canvas} from './types';

/**
 * A WebGPU context.
 */
export interface Context {
    /**
     * The canvas element being rendered to.
     */
    readonly canvas: Canvas;

    /**
     * The WebGPU canvas context.
     */
    readonly canvasContext: GPUCanvasContext;

    /**
     * The WebGPU adapter.
     */
    readonly adapter: GPUAdapter;

    /**
     * The WebGPU device.
     */
    readonly device: GPUDevice;
}

/**
 * A WebGPU context that renders to a HTML canvas.
 */
export interface HTMLCanvasContext extends Context {
    readonly canvas: HTMLCanvasElement;
}

/**
 * A WebGPU context that renders to an offscreen canvas.
 */
export interface OffscreenCanvasContext extends Context {
    readonly canvas: OffscreenCanvas;
}

/**
 * Options for creating a WebGPU context.
 */
export interface CreateContextOptions {
    /**
     * Options for requesting a WebGPU adapter.
     */
    readonly adapterOptions?: GPURequestAdapterOptions;

    /**
     * Options for requesting a WebGPU device.
     */
    readonly deviceOptions?: GPUDeviceDescriptor;

    /**
     * Options for configuring a WebGPU canvas context.
     */
    readonly canvasContextOptions?: Partial<
        Omit<GPUCanvasConfiguration, 'device'>
    >;
}

/**
 * A module which provides utility functionality related to WebGPU.
 */
const m = {
    /**
     * Create a WebGPU context.
     *
     * @param canvas - The canvas element to render to.
     * @param options - Options for creating the context.
     *
     * @returns A promise that resolves to a new WebGPU context on success or
     * rejects with an error on failure.
     */
    async createContext(
        canvas: Canvas,
        options: CreateContextOptions = {}
    ): Promise<Context> {
        if (!navigator.gpu) {
            throw new Error('WebGPU is not supported on this platform');
        }
        const adapter = await navigator.gpu.requestAdapter({
            powerPreference: 'high-performance',
            ...options?.adapterOptions
        });
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
            ...options.canvasContextOptions,
            device
        });
        return {
            canvas,
            canvasContext,
            adapter,
            device
        };
    },

    /**
     * Create a WebGPU context using a HTML canvas.
     *
     * @param options - Options for creating the context.
     *
     * @returns A promise that resolves to a new WebGPU context on success or
     * rejects with an error on failure.
     */
    async createHTMLCanvasContext(
        options: CreateContextOptions = {}
    ): Promise<HTMLCanvasContext> {
        const canvas = document.createElement('canvas');
        return (await m.createContext(canvas, options)) as HTMLCanvasContext;
    },

    /**
     * Create a WebGPU context using a HTML canvas.
     *
     * @param width - The width of the offscreen canvas to create.
     * @param height - The height of the offscreen canvas to create.
     * @param options - Options for creating the context.
     *
     * @returns A promise that resolves to a new WebGPU context on success or
     * rejects with an error on failure.
     */
    async createOffscreenCanvasContext(
        width: number,
        height: number,
        options: CreateContextOptions = {}
    ): Promise<OffscreenCanvasContext> {
        const canvas = new OffscreenCanvas(width, height);
        return (await m.createContext(
            canvas,
            options
        )) as OffscreenCanvasContext;
    }
};

/**
 * Get the internal module for use in unit tests.
 *
 * @returns The internal module.
 *
 * @internal
 */
export function getInternalModule(): typeof m {
    return m;
}

/* eslint-disable @typescript-eslint/unbound-method */
export const {
    createContext,
    createHTMLCanvasContext,
    createOffscreenCanvasContext
} = m;
/* eslint-enable @typescript-eslint/unbound-method */
