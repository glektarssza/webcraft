//-- Project Code
import type {Canvas} from './types';

/**
 * A WebGPU context.
 */
export interface WebGPUContext {
    /**
     * The canvas this instance is rendering to.
     */
    readonly canvas: Canvas;

    /**
     * The context for the canvas this instance is rendering to.
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
 * Options for creating a WebGPU context.
 */
export interface WebGPUContextOptions {
    /**
     * The WebGPU power preference to use.
     *
     * Defaults to `'high-performance'`.
     */
    powerPreference?: GPUPowerPreference;

    /**
     * The label to apply to the WebGPU device.
     *
     * Defaults to `'Default WebGPU device'`.
     */
    deviceLabel?: string;

    /**
     * The label to apply to the WebGPU device default queue.
     *
     * Defaults to `deviceLabel + ' device'`.
     */
    deviceDefaultQueueLabel?: string;

    /**
     * Features to require the WebGPU device to support.
     */
    requiredDeviceFeatures?: Iterable<GPUFeatureName>;

    /**
     * Limits to require the WebGPU device to support.
     */
    requiredDeviceLimits?: Record<string, number>;

    /**
     * The texture format to configuration WebgPU canvas context with.
     *
     * Defaults to the value provided by
     * `navigate.gpu.getPreferredCanvasFormat()`.
     */
    canvasContextFormat?: GPUTextureFormat;

    /**
     * The alpha mode to configuration WebgPU canvas context with.
     *
     * Defaults to `'premultiplied'`.
     */
    canvasContextAlphaMode?: GPUCanvasAlphaMode;

    /**
     * The color space to configuration WebgPU canvas context with.
     */
    canvasContextColorSpace?: PredefinedColorSpace;

    /**
     * The usage to configuration WebgPU canvas context with.
     */
    canvasContextUsage?: number;

    /**
     * The view formats to configuration WebgPU canvas context with.
     */
    canvasContextViewFormats?: Iterable<GPUTextureFormat>;
}

/**
 * A module which provides various WebGPU context functionality.
 */
const m = {
    async createWebGPUContext(
        canvas: Canvas,
        options?: WebGPUContextOptions
    ): Promise<WebGPUContext> {
        if (!navigator.gpu) {
            throw new Error('WebGPU unsupported');
        }
        const adapter = await navigator.gpu.requestAdapter({
            powerPreference: options?.powerPreference ?? 'high-performance'
        });
        if (!adapter) {
            throw new Error('Failed to get WebGPU adapter');
        }
        const device = await adapter.requestDevice({
            label: options?.deviceLabel ?? 'Default WebGPU device',
            defaultQueue: {
                label:
                    options?.deviceDefaultQueueLabel ??
                    `${options?.deviceLabel ?? 'Default WebGPU device'} queue`
            },
            requiredFeatures: options?.requiredDeviceFeatures,
            requiredLimits: options?.requiredDeviceLimits
        });
        if (!device) {
            throw new Error('Failed to get WebGPU device');
        }
        const canvasContext = canvas.getContext('webgpu');
        if (!canvasContext) {
            throw new Error('Failed to get WebGPU canvas context');
        }
        canvasContext.configure({
            device,
            format:
                options?.canvasContextFormat ??
                navigator.gpu.getPreferredCanvasFormat(),
            alphaMode: options?.canvasContextAlphaMode ?? 'premultiplied',
            colorSpace: options?.canvasContextColorSpace,
            usage: options?.canvasContextUsage,
            viewFormats: options?.canvasContextViewFormats
        });
        return {
            canvas,
            canvasContext,
            adapter,
            device
        };
    },

    async createWebGPUContextWithCanvas(
        options?: WebGPUContextOptions
    ): Promise<WebGPUContext> {
        if (!navigator.gpu) {
            throw new Error('WebGPU unsupported');
        }
        const adapter = await navigator.gpu.requestAdapter({
            powerPreference: options?.powerPreference ?? 'high-performance'
        });
        if (!adapter) {
            throw new Error('Failed to get WebGPU adapter');
        }
        const device = await adapter.requestDevice({
            label: options?.deviceLabel ?? 'Default WebGPU device',
            defaultQueue: {
                label:
                    options?.deviceDefaultQueueLabel ??
                    `${options?.deviceLabel ?? 'Default WebGPU device'} queue`
            },
            requiredFeatures: options?.requiredDeviceFeatures,
            requiredLimits: options?.requiredDeviceLimits
        });
        if (!device) {
            throw new Error('Failed to get WebGPU device');
        }
        const canvas = document.createElement('canvas');
        const canvasContext = canvas.getContext('webgpu');
        if (!canvasContext) {
            throw new Error('Failed to get WebGPU canvas context');
        }
        canvasContext.configure({
            device,
            format:
                options?.canvasContextFormat ??
                navigator.gpu.getPreferredCanvasFormat(),
            alphaMode: options?.canvasContextAlphaMode ?? 'premultiplied',
            colorSpace: options?.canvasContextColorSpace,
            usage: options?.canvasContextUsage,
            viewFormats: options?.canvasContextViewFormats
        });
        return {
            canvas,
            canvasContext,
            adapter,
            device
        };
    }
};

/**
 * Get the internal module for unit testing.
 *
 * @returns The internal module.
 *
 * @internal
 */
export function getInternalModule(): typeof m {
    return m;
}

/* eslint-disable no-empty-pattern, @typescript-eslint/unbound-method */
export const {createWebGPUContext, createWebGPUContextWithCanvas} = m;
/* eslint-enable no-empty-pattern, @typescript-eslint/unbound-method */
