//-- NPM Packages
import {
    removeViteLogging,
    vitePlugin
} from '@remcovaes/web-test-runner-vite-plugin';

/**
 * @type {import('@web/test-runner').TestRunnerConfig}
 */
export default {
    files: './tests/**/*.spec.ts',
    nodeResolve: true,
    puppeteer: true,
    plugins: [vitePlugin()],
    filterBrowserLogs: removeViteLogging,
    coverageConfig: {
        include: ['./src/ts/**/*.ts'],
        reporters: ['html', 'text']
    }
};
