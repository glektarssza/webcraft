/// <reference types="webpack-dev-server" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./pug-plugin.d.ts" />
import ESLintWebpackPlugin from 'eslint-webpack-plugin';
import ForkTSCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import path from 'path';
import PugPlugin from 'pug-plugin';
import {Configuration} from 'webpack';
import webpackMerge from 'webpack-merge';

const common: Configuration = {
    context: __dirname,
    entry: {
        index: path.resolve(__dirname, './src/index.pug')
    },
    output: {
        clean: true,
        path: path.resolve(__dirname, './dist/')
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
                test: /\.(scss|sass)$/,
                exclude: /node_modules/,
                use: ['css-loader', 'postcss-loader', 'sass-loader']
            },
            {
                test: /\.(css)$/,
                exclude: /node_modules/,
                use: ['css-loader', 'postcss-loader']
            },
            {
                test: /\.(png|jpeg|jpg|bmp|gif)$/,
                exclude: /node_modules/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[contenthash][ext]'
                }
            },
            {
                test: /\.(eot|tff|otf|woff|woff2)$/,
                exclude: /node_modules/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[contenthash][ext]'
                }
            },
            {
                test: /\.(pug)$/,
                exclude: /node_modules/,
                use: [PugPlugin.loader]
            }
        ]
    },
    plugins: [
        new ESLintWebpackPlugin({
            files: path.resolve(__dirname, './src/ts/')
        }),
        new ForkTSCheckerWebpackPlugin({
            async: true,
            typescript: {
                configFile: path.resolve(__dirname, './src/ts/tsconfig.json')
            }
        })
    ]
};

const dev: Configuration = webpackMerge(common, {
    name: 'dev',
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        filename: 'js/app.[contenthash].js'
    },
    devServer: {
        port: 8080,
        hot: false,
        liveReload: false
    },
    module: {
        rules: []
    },
    plugins: [
        new PugPlugin({
            pretty: true,
            extractCss: {
                filename: 'css/app.[contenthash].css'
            }
        })
    ]
});

const prod: Configuration = webpackMerge(common, {
    name: 'prod',
    mode: 'production',
    devtool: 'hidden-source-map',
    output: {
        filename: 'js/app.[contenthash].min.js'
    },
    module: {
        rules: []
    },
    plugins: [
        new PugPlugin({
            pretty: true,
            extractCss: {
                filename: 'css/app.[contenthash].min.css'
            }
        })
    ]
});

export default [dev, prod];
