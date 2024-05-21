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
    let loadedModules = 0;
    const customLogger = createLogger('info');
    const generatedConfig: UserConfig = {
        appType: 'spa',
        clearScreen: false,
        mode,
        resolve: {
            extensions: ['.ts', '.js']
        },
        build: {
            emptyOutDir: true
        },
        server: {
            hmr: false,
            port: 8080,
            strictPort: true
        },
        preview: {
            port: 8080,
            strictPort: true
        },
        plugins: [
            {
                name: 'progress-plugin',
                apply() {
                    return !isUnitTesting;
                },
                load: {
                    order: 'post',
                    handler() {
                        if (loadedModules <= 0) {
                            customLogger.info('Starting module loading...');
                        }
                        loadedModules++;
                    }
                },
                transform: {
                    order: 'post',
                    handler() {
                        loadedModules--;
                        if (loadedModules <= 0) {
                            customLogger.info('Transforms completed');
                        }
                    }
                }
            },
            replacePlugin({
                preventAssignment: true,
                values: {
                    'process.env.FAKER_SEED': JSON.stringify(
                        process.env['FAKER_SEED']
                    )
                }
            })
        ]
    };
    if (command === 'serve') {
        generatedConfig.mode = 'development';
    }
    if (mode === 'development') {
        generatedConfig.build!.outDir = './dist/dev/';
        generatedConfig.build!.minify = false;
    } else {
        generatedConfig.build!.outDir = './dist/prod/';
        generatedConfig.build!.minify = true;
        generatedConfig.base = '/webcraft/';
    }
    return generatedConfig;
});

export default config;
