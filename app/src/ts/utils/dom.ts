/**
 * A module containing various DOM-related utilities.
 */
const m = {
    /**
     * Wait for the DOM to become ready to manipulate.
     *
     * @param timeout - The maximum duration, in milliseconds, to wait. A
     * negative or non-finite value is equivalent to an indefinite duration.
     */
    async ready(timeout = Infinity): Promise<void> {
        if (document.readyState === 'complete') {
            return;
        }
        await new Promise<void>((resolve, reject) => {
            if (document.readyState === 'complete') {
                resolve();
                return;
            }
            let timer: number | null = null;
            const listener = () => {
                if (document.readyState === 'complete') {
                    if (timer !== null) {
                        clearTimeout(timer);
                        timer = null;
                    }
                    document.removeEventListener('readystatechange', listener);
                    resolve();
                }
            };
            if (isFinite(timeout) && timeout > 0) {
                timer = setTimeout(() => {
                    timer = null;
                    document.removeEventListener('readystatechange', listener);
                    reject(
                        new Error(
                            `DOM did not become ready to manipulate within ${timeout} milliseconds`
                        )
                    );
                }, timeout);
            }
            document.addEventListener('readystatechange', listener);
        });
    },

    /**
     * Get the root HTML element of the application.
     *
     * @returns The root HTML element of the application.
     */
    getRootElement(): HTMLElement {
        let elem = document.getElementById('app');
        if (elem !== null) {
            return elem;
        }
        elem = document.getElementById('root');
        if (elem !== null) {
            return elem;
        }
        elem = document.body.children.item(0) as HTMLElement | null;
        if (elem !== null) {
            return elem;
        }
        return document.body;
    },

    displayError(title: string, desc: string, stack?: string): void {
        const titleElem = document.getElementById('error-title');
        if (titleElem !== null) {
            titleElem.innerText = title;
        }
        const descElem = document.getElementById('error-desc');
        if (descElem !== null) {
            descElem.innerText = desc;
        }
        const stackElem = document.getElementById('error-stack');
        if (stackElem !== null && stack !== undefined) {
            stackElem.innerText = stack;
        }
        const containerElem = document.getElementById('error-container');
        if (containerElem) {
            containerElem.classList.remove('no-display');
        }
        const rootElems = Array.from(document.body.children);
        rootElems
            .filter((item) => containerElem !== null && item !== containerElem)
            .forEach((item) => item.classList.add('no-display'));
    }
};

export function getTestModule() {
    return m;
}

/* eslint-disable no-empty-pattern,@typescript-eslint/unbound-method */
export const {displayError, getRootElement, ready} = m;
/* eslint-enable no-empty-pattern,@typescript-eslint/unbound-method */
