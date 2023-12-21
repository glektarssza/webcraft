//-- Type Definitions
import 'webpack-dev-server';
import './pug-plugin';

//-- NodeJS
import path from 'node:path';

//-- NPM Packages
import ForkTSCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import PugPlugin from 'pug-plugin';
import {Configuration} from 'webpack';
import webpackMerge from 'webpack-merge';

//-- Project Code
import common from './webpack.config.common';

/**
 * The development Webpack configuration.
 */
const dev: Configuration = webpackMerge(common, {
    name: 'dev',
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        port: 8080,
        hot: false,
        liveReload: false
    },
    resolve: {},
    entry: {
        index: './src/index.pug'
    },
    output: {
        clean: true,
        path: path.resolve(__dirname, './dist/dev/')
    },
    module: {
        rules: []
    },
    plugins: [
        new ForkTSCheckerWebpackPlugin({
            async: true,
            devServer: true,
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

export default dev;
