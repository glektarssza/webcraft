async function domReady(timeout = Infinity): Promise<void> {
    if (document.readyState === 'complete') {
        return;
    }
    await new Promise<void>((resolve, reject): void => {
        if (document.readyState === 'complete') {
            resolve();
            return;
        }
        let timer: number | null = null;
        const listener = (): void => {
            if (document.readyState === 'complete') {
                if (timer !== null) {
                    clearTimeout(timer);
                }
                document.removeEventListener('readystatechange', listener);
                resolve();
            }
        };
        if (isFinite(timeout) && timeout >= 0) {
            timer = setTimeout((): void => {
                document.removeEventListener('readystatechange', listener);
                reject(
                    new Error(`DOM did not become ready within ${timeout} ms`)
                );
            }, timeout);
        }
        document.addEventListener('readystatechange', listener);
    });
}

async function main(): Promise<void> {
    await domReady();
}

main()
    .then(() => console.log('Game started normally'))
    .catch((err: Error) => {
        console.error('Fatal error during startup:');
        console.error(err);
    });
