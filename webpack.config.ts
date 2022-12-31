/// <reference types="node" />
/// <reference types="webpack-dev-server" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./pug-plugin.d.ts" />

import ESLintWebpackPlugin from 'eslint-webpack-plugin';
import ForkTSCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import path from 'path';
import PugPlugin from 'pug-plugin';
import {Configuration} from 'webpack';
import webpackMerge from 'webpack-merge';

/**
 * The common Webpack configuration elements.
 */
const common: Configuration = {
    context: __dirname,
    output: {
        clean: true,
        path: path.resolve(__dirname, './dist/')
    },
    entry: {
        index: './src/index.pug'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js']
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.(tsx|ts|jsx|js|scss|sass|less|css)$/,
                exclude: /node_modules/,
                use: ['source-map-loader']
            },
            {
                test: /\.(tsx|ts)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            configFile: path.resolve(
                                __dirname,
                                './src/ts/tsconfig.json'
                            )
                        }
                    }
                ]
            },
            {
                test: /\.(sass|scss)$/,
                exclude: /node_modules/,
                use: ['css-loader', 'postcss-loader', 'sass-loader']
            },
            {
                test: /\.(css)$/,
                exclude: /node_modules/,
                use: ['css-loader', 'postcss-loader']
            },
            {
                test: /\.(pug)$/,
                exclude: /node_modules/,
                use: [PugPlugin.loader]
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|webp)$/,
                exclude: /node_modules/,
                type: 'asset/resource',
                generator: {
                    filename: 'img/[name].[contenthash][ext]'
                }
            },
            {
                test: /\.(ttf|otf|woff|woff2|eot)$/,
                exclude: /node_modules/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name].[contenthash][ext]'
                }
            }
        ]
    },
    plugins: [
        new ESLintWebpackPlugin({
            files: path.relative(__dirname, './src/ts/')
        })
    ]
};

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
        liveReload: true
    },
    module: {
        rules: []
    },
    plugins: [
        new PugPlugin({
            pretty: true,
            js: {
                filename: 'js/app.[contenthash].js'
            },
            css: {
                filename: 'css/app.[contenthash].css'
            }
        }),
        new ForkTSCheckerWebpackPlugin({
            async: true,
            devServer: true,
            typescript: {
                configFile: path.resolve(__dirname, './src/ts/tsconfig.json')
            }
        })
    ]
});

/**
 * The production Webpack configuration.
 */
const prod: Configuration = webpackMerge(common, {
    name: 'prod',
    mode: 'production',
    devtool: 'hidden-source-map',
    module: {
        rules: []
    },
    plugins: [
        new PugPlugin({
            pretty: false,
            js: {
                filename: 'js/app.[contenthash].min.js'
            },
            css: {
                filename: 'css/app.[contenthash].min.css'
            }
        }),
        new ForkTSCheckerWebpackPlugin({
            async: true,
            devServer: false,
            typescript: {
                configFile: path.resolve(__dirname, './src/ts/tsconfig.json')
            }
        })
    ]
});

export default [dev, prod];
