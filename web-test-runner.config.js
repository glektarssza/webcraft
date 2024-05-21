//-- NPM Packages
import {
    removeViteLogging,
    vitePlugin
} from '@remcovaes/web-test-runner-vite-plugin';
import {puppeteerLauncher} from '@web/test-runner-puppeteer';

/**
 * @type {import('@web/test-runner').TestRunnerConfig}
 */
export default {
    files: './tests/**/*.spec.ts',
    nodeResolve: true,
    browsers: [puppeteerLauncher()],
    plugins: [vitePlugin()],
    filterBrowserLogs: removeViteLogging,
    coverageConfig: {
        include: ['./src/ts/**/*.ts'],
        reporters: ['html', 'text']
    }
};
