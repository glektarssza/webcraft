/// <reference types="vitest" />

//-- NodeJS
import os from 'node:os';
import path from 'node:path';

//-- NPM Packages
import replacePlugin from '@rollup/plugin-replace';
import {defineConfig} from 'vite';

/**
 * The ViteJS configuration.
 */
const config = defineConfig(({mode}) => {
    return {
        mode,
        resolve: {
            extensions: ['.ts', '.js']
        },
        build: {
            outDir: path.resolve(import.meta.dirname, './dist/'),
            minify: mode !== 'development',
            sourcemap: mode !== 'development' ? 'hidden' : true,
            emptyOutDir: true
        },
        test: {
            alias: {
                '@src': path.resolve(import.meta.dirname, './src/ts/')
            },
            browser: {
                enabled: true,
                name: 'edge',
                provider: 'webdriverio',
                headless: true
            },
            mockReset: true,
            clearMocks: true,
            unstubGlobals: true,
            unstubEnvs: true,
            dir: './tests/',
            name: 'Webcraft',
            maxConcurrency: Math.max(Math.floor(os.cpus().length / 2), 1),
            reporters: 'default'
        },
        plugins: [
            replacePlugin({
                preventAssignment: true,
                values: {
                    FAKER_SEED: JSON.stringify(process.env['FAKER_SEED'])
                }
            })
        ]
    };
});

export default config;
