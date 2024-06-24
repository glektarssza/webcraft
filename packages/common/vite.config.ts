//-- NodeJS
import path from 'node:path';

//-- NPM Packages
import replacePlugin from '@rollup/plugin-replace';
import {UserConfig, createLogger, defineConfig} from 'vite';

/**
 * Whether Vite is running in a unit testing environment.
 */
const isUnitTesting = process.env['VITE_UNIT_TESTING'] === 'true';

/**
 * The ViteJS configuration.
 */
const config = defineConfig(({command, mode}) => {
    const generatedConfig: UserConfig = {
        mode,
        resolve: {
            extensions: ['.ts', '.js']
        },
        build: {
            emptyOutDir: true,
            lib: {
                entry: path.resolve(import.meta.dirname, './src/index.ts'),
                name: 'webcraft-common',
                fileName() {
                    if (generatedConfig.mode === 'development') {
                        return 'webcraft-common.js';
                    }
                    return 'webcraft-common.min.js';
                }
            }
        },
        server: {
            hmr: false
        },
        plugins: []
    };
    if (command === 'serve' && !isUnitTesting) {
        generatedConfig.mode = 'development';
        const pluginLogger = createLogger('info');
        let modulesBeingLoaded = 0;
        generatedConfig.plugins!.push({
            name: 'progress-plugin',
            load() {
                if (modulesBeingLoaded <= 0) {
                    pluginLogger.info('Starting compilation...');
                }
                modulesBeingLoaded++;
            },
            transform() {
                modulesBeingLoaded--;
                if (modulesBeingLoaded <= 0) {
                    pluginLogger.info('Compilation complete');
                }
            }
        });
    }
    if (mode === 'development') {
        generatedConfig.build!.outDir = './dist/dev/';
        generatedConfig.build!.minify = false;
    } else {
        generatedConfig.build!.outDir = './dist/prod/';
        generatedConfig.build!.minify = true;
    }
    if (isUnitTesting) {
        generatedConfig.plugins!.push(
            replacePlugin({
                preventAssignment: true,
                values: {
                    'process.env.FAKER_SEED': JSON.stringify(
                        process.env['FAKER_SEED']
                    )
                }
            })
        );
    }
    return generatedConfig;
});

export default config;
