//-- Project Code
import {webgpu} from '../lib';

/**
 * The main game data structure.
 */
export interface Game {
    /**
     * The WebGPU rendering context for this instance.
     */
    readonly graphicsContext: webgpu.WebGPUContext;
}

/**
 * Create a new {@link Game | game} instance.
 *
 * @returns A promise that resolves to the new instance upon success or rejects
 * if any errors occur.
 */
export async function createGame(): Promise<Game> {
    const graphicsContext = await webgpu.createWebGPUHTMLContext({
        adapter: {
            powerPreference: 'high-performance'
        },
        canvasContext: {
            alphaMode: 'premultiplied'
        }
    });
    return {
        graphicsContext
    };
}
