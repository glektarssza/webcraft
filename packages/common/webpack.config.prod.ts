//-- NodeJS
import * as path from 'node:path';

//-- NPM Packages
import ForkTSCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import type {Configuration} from 'webpack';
import webpackMerge from 'webpack-merge';

//-- Project Code
import common from './webpack.config.common';

/**
 * The production Webpack configuration.
 */
const config: Configuration = webpackMerge(common, {
    name: 'prod',
    mode: 'production',
    devtool: 'hidden-source-map',
    resolve: {},
    entry: './src/index.ts',
    output: {
        clean: true,
        path: path.resolve(__dirname, './dist/prod/'),
        filename: 'webcraft-common.min.js',
        library: {
            name: {
                amd: 'webcraft-common',
                commonjs: 'webcraft-common',
                root: 'webcraftCommon'
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
            devServer: false,
            typescript: {
                configFile: path.resolve(__dirname, './src/tsconfig.json')
            }
        })
    ]
});

export default config;
