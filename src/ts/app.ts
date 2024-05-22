import {waitForDOMReady} from './utils';

/**
 * The program entry point.
 *
 * @returns A promise that resolves once the application is started or rejects
 * if any errors occur.
 */
async function main(): Promise<void> {
    await waitForDOMReady();
}

main()
    .then((): void => {
        console.log('Application started normally');
    })
    .catch((err: Error): void => {
        console.error('Fatal error');
        console.error(err);
    });
