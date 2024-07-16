//-- Project Code
import {waitForDocument} from './utils/dom';

/**
 * The application entry point.
 *
 * @returns A promise that resolves once the application has started or rejects
 * if any errors occur during startup.
 */
async function main(): Promise<void> {
    await waitForDocument(globalThis.document);
}

main()
    .then((): void => {
        console.info('Application started normally');
    })
    .catch((err: Error): void => {
        console.error('Fatal error during startup!');
        console.error(err);
    });
