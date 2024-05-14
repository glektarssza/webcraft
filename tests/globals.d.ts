declare global {
    const process: {
        env: Record<string, string> & {
            FAKER_SEED: string;
        };
    };
}

export {};
