declare global {
    /**
     * The mock `process` object.
     */
    interface Process {
        /**
         * The environment variables.
         */
        env: Record<string, string> & {
            /**
             * An optional seed to pass to the `Faker` instance.
             */
            FAKER_SEED?: string;
        };
    }

    /**
     * The mock `process` object.
     */
    const process: Process;
}

export {};
