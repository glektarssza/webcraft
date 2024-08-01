//-- Project Code
import {dom} from './lib';
import {createGame} from './app';

/**
 * The program entry point.
 */
async function main(): Promise<void> {
    await dom.onDocumentReady();
    const game = await createGame();
    const {canvas} = game.graphicsContext;
    if (canvas instanceof HTMLCanvasElement) {
        canvas.id = 'gameCanvas';
        canvas.classList.add('game-canvas');
        document.body.appendChild(canvas);
    }
}

main()
    .then((): void => {
        console.info('Application started normally');
    })
    .catch((err: Error): void => {
        console.error('Fatal error during startup');
        console.error(err);
    });
