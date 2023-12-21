//-- Type Definitions
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
 * The production Webpack configuration.
 */
const prod: Configuration = webpackMerge(common, {
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
            pretty: false,
            css: {
                filename: 'css/app.[contenthash].min.css'
            },
            js: {
                filename: 'js/app.[contenthash].min.js'
            }
        })
    ]
});

export default prod;
