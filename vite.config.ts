import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            all: true,
            provider: 'istanbul',
            reporter: ['text', 'html']
        },
        passWithNoTests: true,
        reporters: 'default'
    }
});
