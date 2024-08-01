export async function domReady(): Promise<void> {
    if (globalThis.document.readyState === 'complete') {
        return;
    }
    await new Promise<void>((resolve): void => {
        if (globalThis.document.readyState === 'complete') {
            resolve();
            return;
        }
        const listener = (): void => {
            if (globalThis.document.readyState === 'complete') {
                globalThis.document.removeEventListener(
                    'readystatechange',
                    listener
                );
                resolve();
            }
        };
        globalThis.document.addEventListener('readystatechange', listener);
    });
}

export interface WebGPUContext {
    readonly adapter: GPUAdapter;
    readonly device: GPUDevice;
    readonly canvas: HTMLCanvasElement;
    readonly canvasContext: GPUCanvasContext;
}

export async function createWebGPUContext(): Promise<WebGPUContext> {
    if (!navigator.gpu) {
        throw new Error('WebGPU is not supported');
    }
    const adapter = await navigator.gpu.requestAdapter({
        powerPreference: 'high-performance'
    });
    if (!adapter) {
        throw new Error('No WebGPU adapter found');
    }
    const device = await adapter.requestDevice();
    if (!device) {
        throw new Error('No WebGPU device found');
    }
    const canvas = globalThis.document.createElement('canvas');
    const canvasContext = canvas.getContext('webgpu');
    if (!canvasContext) {
        throw new Error('Failed to create WebGPU context');
    }
    canvasContext.configure({
        device,
        format: navigator.gpu.getPreferredCanvasFormat(),
        alphaMode: 'premultiplied'
    });
    return {adapter, device, canvas, canvasContext};
}
