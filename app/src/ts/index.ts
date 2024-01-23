import {getRootElement, ready} from './utils';

/**
 * The entrypoint for the application.
 */
async function main(): Promise<void> {
    await ready();
    const rootElem = getRootElement();
    //-- Setup canvas
    const canvas = document.createElement('canvas');
    rootElem.appendChild(canvas);
    canvas.classList.add('game-canvas');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    //-- Setup WebGPU
}

main()
    .then(() => {
        console.log('Application started normally');
    })
    .catch((err: Error) => {
        console.error('Fatal error during startup');
        console.error(err);
        // TODO: Display in DOM
    });
