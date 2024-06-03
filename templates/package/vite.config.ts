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
        optimizeDeps: {
            entries: ['./tests/**/*.spec.ts']
        },
        resolve: {
            extensions: ['.ts', '.js']
        },
        build: {
            emptyOutDir: true,
            lib: {
                entry: 'src/index.ts',
                name: 'webcraft-package-template',
                fileName: 'webcraft-package-template'
            },
            rollupOptions: {
                external: [],
                output: {
                    globals: {}
                }
            }
        },
        plugins: []
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
