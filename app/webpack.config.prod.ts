//-- NodeJS
import * as path from 'node:path';

//-- NPM Packages
import ForkTSCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import PugPlugin from 'pug-plugin';
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
    entry: {
        index: './src/index.pug'
    },
    output: {
        clean: true,
        path: path.resolve(__dirname, './dist/prod/')
    },
    module: {
        rules: []
    },
    plugins: [
        new ForkTSCheckerWebpackPlugin({
            async: true,
            devServer: false,
            typescript: {
                configFile: path.resolve(__dirname, './src/ts/tsconfig.json')
            }
        }),
        new PugPlugin({
            pretty: true,
            css: {
                filename: 'css/app.[contenthash].css'
            },
            js: {
                filename: 'js/app.[contenthash].js'
            }
        })
    ]
});

export default config;
