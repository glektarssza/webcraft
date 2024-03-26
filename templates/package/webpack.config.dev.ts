//-- NodeJS
import * as path from 'node:path';

//-- NPM Packages
import ForkTSCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import type {Configuration} from 'webpack';
import webpackMerge from 'webpack-merge';
import 'webpack-dev-server';

//-- Project Code
import common from './webpack.config.common';

/**
 * The development Webpack configuration.
 */
const config: Configuration = webpackMerge(common, {
    name: 'dev',
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        port: 8080,
        hot: false,
        liveReload: false
    },
    resolve: {},
    entry: './src/index.ts',
    output: {
        clean: true,
        path: path.resolve(__dirname, './dist/dev/'),
        filename: 'webcraft-package-template.js',
        library: {
            name: {
                amd: 'webcraft-package-template',
                commonjs: 'webcraft-package-template',
                root: 'webcraftPackageTemplate'
            },
            type: 'umd',
            umdNamedDefine: true
        }
    },
    module: {
        rules: []
    },
    plugins: [
        new ForkTSCheckerWebpackPlugin({
            async: true,
            devServer: true,
            typescript: {
                configFile: path.resolve(__dirname, './src/tsconfig.json')
            }
        })
    ]
});

export default config;
