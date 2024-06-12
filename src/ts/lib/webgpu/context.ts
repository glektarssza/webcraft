//-- Project Code
import type {Canvas} from './types';

/**
 * A base type for all WebGPU rendering contexts.
 */
export interface BaseContext {
    /**
     * The canvas that this instance renders into.
     */
    readonly canvas: Canvas;

    /**
     * The WebGPU canvas context for the canvas that this instance renders into.
     */
    readonly canvasContext: GPUCanvasContext;

    /**
     * The WebGPU adapter being used by this instance.
     */
    readonly adapter: GPUAdapter;

    /**
     * The WebGPU device being used by this instance.
     */
    readonly device: GPUDevice;
}

/**
 * An extension of the basic WebGPU context which renders specifically to a HTML
 * canvas element.
 */
export interface HTMLCanvasContext extends BaseContext {
    /**
     * The canvas that this instance renders into.
     */
    readonly canvas: HTMLCanvasElement;
}

/**
 * An extension of the basic WebGPU context which renders specifically to a HTML
 * canvas element.
 */
export interface HTMLCanvasContext extends BaseContext {
    /**
     * The canvas that this instance renders into.
     */
    readonly canvas: HTMLCanvasElement;
}

/**
 * An extension of the basic WebGPU context which renders specifically to an
 * offscreen canvas.
 */
export interface OffscreenCanvasContext extends BaseContext {
    /**
     * The canvas that this instance renders into.
     */
    readonly canvas: OffscreenCanvas;
}

/**
 * A WebGPU rendering context.
 */
export type Context = HTMLCanvasContext | OffscreenCanvasContext;

/**
 * Options for creating a {@link Context | WebGPU rendering context}.
 */
export interface ContextCreationOptions {
    /**
     * The options for fetching a WebGPU adapter.
     */
    adapterOptions?: GPURequestAdapterOptions;

    /**
     * The options for fetching a WebGPU device.
     */
    deviceOptions?: GPUDeviceDescriptor;

    /**
     * The options for configuring the WebGPU canvas context.
     */
    canvasContextOptions?: Partial<Omit<GPUCanvasConfiguration, 'device'>>;
}

/**
 * A module which provides functionality related to a WebGPU rendering context.
 */
const m = {
    /**
     * Create a new WebGPU context.
     *
     * @param canvas - The canvas to render into.
     * @param options - The options to use to create the context.
     *
     * @returns A promise that resolves to the newly created context on success
     * or rejects if any errors occur.
     *
     * @throws `Error`
     * Thrown if the platform does not support WebGPU.
     * @throws `Error`
     * Thrown if a WebGPU adapter could not be fetched.
     * @throws `Error`
     * Thrown if a WebGPU device could not be fetched.
     * @throws `Error`
     * Thrown if a WebGPU canvas context could not be fetched.
     */
    async createContext(
        canvas: Canvas,
        options?: ContextCreationOptions
    ): Promise<Context> {
        if (!navigator.gpu) {
            throw new Error('WebGPU is not supported on this platform');
        }
        const adapter = await navigator.gpu.requestAdapter(
            options?.adapterOptions
        );
        if (!adapter) {
            throw new Error('Failed to fetch WebGPU adapter');
        }
        const device = await adapter.requestDevice(options?.deviceOptions);
        if (!adapter) {
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
            adapter,
            device,
            canvas,
            canvasContext
        } as Context;
    },

    /**
     * Create a new WebGPU context that renders to a HTML canvas.
     *
     * @param options - The options to use to create the context.
     *
     * @returns A promise that resolves to the newly created context on success
     * or rejects if any errors occur.
     *
     * @throws `Error`
     * Thrown if the platform does not support WebGPU.
     * @throws `Error`
     * Thrown if a WebGPU adapter could not be fetched.
     * @throws `Error`
     * Thrown if a WebGPU device could not be fetched.
     * @throws `Error`
     * Thrown if a WebGPU canvas context could not be fetched.
     */
    async createHTMLCanvasContext(
        options?: ContextCreationOptions
    ): Promise<HTMLCanvasContext> {
        const canvas = document.createElement('canvas');
        return (await m.createContext(canvas, options)) as HTMLCanvasContext;
    },

    /**
     * Create a new WebGPU context that renders to an offscreen canvas.
     *
     * @param width - The width of the offscreen canvas to create.
     * @param height - The height of the offscreen canvas to create.
     * @param options - The options to use to create the context.
     *
     * @returns A promise that resolves to the newly created context on success
     * or rejects if any errors occur.
     *
     * @throws `Error`
     * Thrown if the platform does not support WebGPU.
     * @throws `Error`
     * Thrown if a WebGPU adapter could not be fetched.
     * @throws `Error`
     * Thrown if a WebGPU device could not be fetched.
     * @throws `Error`
     * Thrown if a WebGPU canvas context could not be fetched.
     */
    async createOffscreenCanvasContext(
        width: number,
        height: number,
        options?: ContextCreationOptions
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
