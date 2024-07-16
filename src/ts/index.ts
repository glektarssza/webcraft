//-- Project Code
import {waitForDocument} from './utils/dom';
import {createHTMLContext} from './webgpu';

/**
 * The application entry point.
 *
 * @returns A promise that resolves once the application has started or rejects
 * if any errors occur during startup.
 */
async function main(): Promise<void> {
    await waitForDocument(globalThis.document);
    const context = await createHTMLContext({
        adapter: {
            powerPreference: 'high-performance'
        },
        canvasContext: {
            alphaMode: 'premultiplied'
        }
    });
    const {canvas} = context;
    canvas.id = 'gameCanvas';
    canvas.classList.add('game-canvas');
    globalThis.document.body.appendChild(canvas);
}

main()
    .then((): void => {
        console.info('Application started normally');
    })
    .catch((err: Error): void => {
        console.error('Fatal error during startup!');
        console.error(err);
    });
