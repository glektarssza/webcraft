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
            emptyOutDir: true,
            lib: {
                formats: ['es', 'cjs', 'umd'],
                name: 'webcraft-common',
                entry: path.resolve(import.meta.dirname, './src/index.ts'),
                fileName(format) {
                    const comps: string[] = ['webcraft-common', format];
                    if (mode !== 'development') {
                        comps.push('min');
                    }
                    return comps.join('.');
                }
            }
        },
        test: {
            alias: {
                '@src': path.resolve(import.meta.dirname, './src/ts/')
            },
            coverage: {
                all: true,
                reporter: ['text', 'html']
            },
            mockReset: true,
            clearMocks: true,
            unstubGlobals: true,
            unstubEnvs: true,
            dir: './tests/',
            name: 'Webcraft',
            maxConcurrency: Math.max(Math.floor(os.cpus().length / 2), 1),
            reporters: 'default',
            passWithNoTests: true
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
