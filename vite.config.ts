import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            enabled: true,
            all: true,
            provider: 'istanbul',
            reporter: ['text']
        },
        passWithNoTests: true,
        reporters: 'default'
    }
});
