/// <reference types="vitest" />

//-- NodeJS
import os from 'node:os';
import path from 'node:path';

//-- NPM Packages
import replacePlugin from '@rollup/plugin-replace';
import {type UserWorkspaceConfig, defineProject} from 'vitest/config';

/**
 * The ViteJS configuration.
 */
const config = defineProject(({mode}) => {
    const conf: UserWorkspaceConfig = {
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
                name: 'webcraft-error',
                fileName(format) {
                    return `webcraft-error.${format}${mode !== 'development' ? '.min' : ''}.js`;
                }
            }
        },
        test: {
            alias: {
                '@src': path.resolve(import.meta.dirname, './src/')
            },
            browser: {
                enabled: true,
                provider: 'playwright',
                instances: [
                    {
                        browser: 'chromium',
                        headless: true
                    }
                ]
            },
            mockReset: true,
            clearMocks: true,
            unstubGlobals: true,
            unstubEnvs: true,
            dir: path.resolve(__dirname, './tests/'),
            name: 'Webcraft - Error Library',
            maxConcurrency: Math.max(Math.floor(os.cpus().length / 2), 1)
        },
        server: {
            fs: {
                strict: process.env['VITEST_VSCODE'] === undefined
            }
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
    return conf;
});

export default config;
