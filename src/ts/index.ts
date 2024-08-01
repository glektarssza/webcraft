/**
 * The program entry point.
 */
async function main(): Promise<void> {
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
