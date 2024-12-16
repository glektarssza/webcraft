import {defineWorkspace} from 'vitest/config';

export default defineWorkspace([
    './app/vite.config.ts',
    './packages/common/vite.config.ts',
    './packages/logging/vite.config.ts'
]);
