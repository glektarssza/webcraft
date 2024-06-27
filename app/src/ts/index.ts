//-- Project Code
import {domReady} from '@webcraft/common';

/**
 * Create DOM to represent an error.
 *
 * @param titleText - The text to display as the title.
 * @param bodyText - The text to display as the body.
 * @param error - The error to use as a source for a stack trace.
 *
 * @returns A DOM which can be used to display an error.
 */
function createErrorDOM(
    titleText: string,
    bodyText: string,
    error?: Error
): HTMLDivElement {
    const r = document.createElement('div');
    r.classList.add('error-container');
    const dialog = document.createElement('div');
    dialog.classList.add('error-dialog');
    r.appendChild(dialog);
    const title = document.createElement('h1');
    title.classList.add('error-title');
    title.innerText = titleText;
    dialog.appendChild(title);
    const body = document.createElement('p');
    body.classList.add('error-body');
    body.innerText = bodyText;
    dialog.appendChild(body);
    const details = document.createElement('div');
    details.classList.add('error-details');
    dialog.appendChild(details);
    const stack = document.createElement('code');
    if (error?.stack !== undefined) {
        stack.innerHTML = `<p>${error.stack.replaceAll('\n', '<br/>').replaceAll(' ', '&nbsp;')}</p>`;
    } else {
        details.classList.add('display-none');
    }
    details.appendChild(stack);
    return r;
}

/**
 * The program entry point.
 *
 * @returns A promise that resolves once the program has started or rejects if
 * a fatal error occurs during startup.
 */
async function main(): Promise<void> {
    await domReady();
}

main()
    .then((): void => {
        console.log('Application started normally');
    })
    .catch((err: Error): void => {
        console.error('Fatal error during startup');
        console.error(err);
        const elem = createErrorDOM(
            'Fatal Error',
            'A fatal error occurred during startup!',
            err
        );
        document.body.appendChild(elem);
    });
