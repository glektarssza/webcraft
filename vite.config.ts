//-- NPM Packages
import {UserConfig, defineConfig} from 'vite';

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
        }
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
