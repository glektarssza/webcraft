//-- Project Code
import {utils} from '@glektarssza/webcraft-common';

/**
 * The program entry point.
 *
 * @returns A promise that resolves when the program has started or rejects if
 * an error occurs.
 */
async function main(): Promise<void> {
    await utils.dom.waitForDOMReady();
    // TODO
}

main()
    .then((): void => {
        console.log('Application started normally');
    })
    .catch((err: Error): void => {
        console.error('Fatal error:');
        console.error(err);
    });
