//-- Project Code
import type {Canvas} from './types';
import type {WebGPUResource} from './resource';
import {UUID} from '@webcraft/common';

/**
 * A WebGPU rendering context.
 *
 * @typeParam T - The type of the canvas associated with this context.
 */
export interface WebGPUContextBase<T extends Canvas> {
    /**
     * The WebGPU adapter associated with this context.
     */
    readonly adapter: GPUAdapter;

    /**
     * The WebGPU device associated with this context.
     */
    readonly device: GPUDevice;

    /**
     * The canvas associated with this context.
     */
    readonly canvas: T;

    /**
     * The WebGPU canvas context associated with this context.
     */
    readonly canvasContext: GPUCanvasContext;

    /**
     * A list of WebGPU resources owned by this instance.
     */
    readonly resources: WebGPUResource<GPUObjectBase>[];

    /**
     * A map of WebGPU resources owned by this instance to their unique
     * identifiers.
     */
    readonly resourceMap: Map<UUID, WebGPUResource<GPUObjectBase>>;
}

/**
 * The options to use when creating a WebGPU context.
 */
export interface WebGPUContextOptions {
    /**
     * The options to use when requesting a WebGPU adapter.
     */
    readonly adapter?: GPURequestAdapterOptions;

    /**
     * The options to use when requesting a WebGPU device.
     */
    readonly device?: GPUDeviceDescriptor;

    /**
     * The options to use when configuring the WebGPU canvas context.
     */
    readonly canvasContext?: Partial<Omit<GPUCanvasConfiguration, 'device'>>;
}

/**
 * A WebGPU rendering context associated with a HTML canvas element.
 */
export type WebGPUHTMLContext = WebGPUContextBase<HTMLCanvasElement>;

/**
 * A WebGPU rendering context associated with an offscreen canvas.
 */
export type WebGPUOffscreenContext = WebGPUContextBase<OffscreenCanvas>;

/**
 * A WebGPU rendering context.
 */
export type WebGPUContext = WebGPUHTMLContext | WebGPUOffscreenContext;

/**
 * A module which provides various WebGPU context-related functionality.
 */
const m = {
    /**
     * Create a WebGPU rendering context associated with a canvas.
     *
     * @typeParam T - The type of the canvas associated with the context.
     *
     * @param canvas - The canvas to create a WebGPU rendering context for.
     * @param options - The options to use when creating the WebGPU context.
     *
     * @returns A promise which resolves with the WebGPU rendering context upon
     * success or rejects if an error occurs.
     */
    async createContext<T extends Canvas>(
        canvas: T,
        options?: WebGPUContextOptions
    ): Promise<WebGPUContextBase<T>> {
        if (!navigator.gpu) {
            throw new Error('WebGPU is not supported by this platform');
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
        const resourceMap = new Map<UUID, WebGPUResource<GPUObjectBase>>();
        return {
            adapter,
            device,
            canvas,
            canvasContext,
            resourceMap,
            get resources() {
                return Array.from(resourceMap.values());
            }
        };
    },

    /**
     * Create a WebGPU rendering context associated with a HTML canvas element.
     *
     * @param options - The options to use when creating the WebGPU context.
     *
     * @returns A promise which resolves with the WebGPU rendering context upon
     * success or rejects if an error occurs.
     */
    createHTMLContext: async (
        options?: WebGPUContextOptions
    ): Promise<WebGPUHTMLContext> => {
        const canvas = document.createElement('canvas');
        return m.createContext(canvas, options);
    },

    /**
     * Create a WebGPU rendering context associated with an offscreen canvas.
     *
     * @param width - The width of the offscreen canvas.
     * @param height - The height of the offscreen canvas.
     * @param options - The options to use when creating the WebGPU context.
     *
     * @returns A promise which resolves with the WebGPU rendering context upon
     * success or rejects if an error occurs.
     */
    createOffscreenContext: async (
        width: number,
        height: number,
        options?: WebGPUContextOptions
    ): Promise<WebGPUOffscreenContext> => {
        const canvas = new OffscreenCanvas(width, height);
        return m.createContext(canvas, options);
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
export const {createContext, createHTMLContext, createOffscreenContext} = m;
/* eslint-enable @typescript-eslint/unbound-method */
