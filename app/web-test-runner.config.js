//-- NodeJS
const path = require('node:path');

//-- NPM Packages
const {esbuildPlugin} = require('@web/dev-server-esbuild');
const {summaryReporter} = require('@web/test-runner');

module.exports = {
    files: ['./tests/**/*.spec.ts', '!**/node_modules/**/*'],
    puppeteer: true,
    nodeResolve: true,
    plugins: [
        esbuildPlugin({
            ts: true,
            tsconfig: path.resolve(__dirname, './tests/tsconfig.json')
        })
    ],
    reporters: [summaryReporter()],
    coverageConfig: {
        report: true,
        reportDir: 'coverage',
        include: ['./src/ts/**/*.ts'],
        reporters: ['text', 'html']
    }
};
