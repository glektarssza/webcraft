import {defineWorkspace} from 'vitest/config';

export default defineWorkspace([
    {
        extends: './vite.config.ts',
        test: {
            name: 'root'
        }
    },
    './app/vite.config.ts',
    './packages/common/vite.config.ts',
    './packages/logging/vite.config.ts'
]);
