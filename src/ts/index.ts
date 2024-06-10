//-- Project Code
import {waitForDOMLoaded} from './dom';

/**
 * The program entry point.
 */
async function main(): Promise<void> {
    await waitForDOMLoaded();
    // TODO
}

main()
    .then((): void => {
        console.info('Application started normally');
    })
    .catch((err: Error): void => {
        console.error('Fatal error during startup');
        console.error(err);
    });
