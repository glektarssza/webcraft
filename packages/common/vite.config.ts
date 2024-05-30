//-- NPM Packages
import replacePlugin from '@rollup/plugin-replace';
import {UserConfig, defineConfig} from 'vite';

/**
 * Whether Vite is running in a unit testing environment.
 */
const isUnitTesting = process.env['VITE_UNIT_TESTING'] === 'true';

/**
 * The ViteJS configuration.
 */
const config = defineConfig(({command, mode}) => {
    const generatedConfig: UserConfig = {
        appType: 'spa',
        clearScreen: false,
        mode,
        resolve: {
            extensions: ['.ts', '.js']
        },
        build: {
            emptyOutDir: true,
            lib: {
                entry: 'src/index.ts',
                name: 'webcraft-common',
                fileName: 'webcraft-common'
            },
            rollupOptions: {
                external: [],
                output: {
                    globals: {}
                }
            }
        },
        server: {
            hmr: false,
            port: 8080
        },
        preview: {
            port: 8080
        },
        plugins: [
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
