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
            outDir: path.resolve(
                import.meta.dirname,
                `./dist/${mode !== 'development' ? 'prod' : 'dev'}/`
            ),
            minify: mode !== 'development',
            sourcemap: mode !== 'development' ? 'hidden' : true,
            emptyOutDir: true,
            lib: {
                entry: path.resolve(import.meta.dirname, './src/index.ts'),
                formats: ['es', 'cjs', 'umd'],
                name: 'webcraft-package-template',
                fileName(format) {
                    return `webcraft-package-template.${format}${mode !== 'development' ? '.min' : ''}.js`;
                }
            }
        },
        test: {
            alias: {
                '@src': path.resolve(import.meta.dirname, './src/')
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
            name: 'Webcraft - Package Template',
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
