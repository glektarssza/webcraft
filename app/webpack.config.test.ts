//-- NodeJS
import path from 'node:path';

//-- NPM Packages
import ESLintWebpackPlugin from 'eslint-webpack-plugin';
import ForkTSCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import TSConfigPathsWebpackPlugin from 'tsconfig-paths-webpack-plugin';
import {Configuration} from 'webpack';
import webpackMerge from 'webpack-merge';

//-- Project Code
import common from './webpack.config.common';

/**
 * The testing Webpack configuration.
 */
const test: Configuration = webpackMerge(common, {
    name: 'test',
    mode: 'development',
    devtool: 'inline-source-map',
    resolve: {
        plugins: [
            new TSConfigPathsWebpackPlugin({
                configFile: path.resolve(__dirname, './tests/tsconfig.json')
            })
        ]
    },
    module: {
        rules: [
            {
                enforce: 'post',
                test: /\.(tsx|ts)$/,
                exclude: /node_modules|tests/,
                use: [
                    {
                        loader: '@jsdevtools/coverage-istanbul-loader',
                        options: {
                            esModules: true,
                            produceSourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.(tsx|ts)$/,
                exclude: /node_modules|src/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            configFile: path.resolve(
                                __dirname,
                                './tests/tsconfig.json'
                            )
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new ForkTSCheckerWebpackPlugin({
            async: true,
            devServer: false,
            typescript: {
                configFile: path.resolve(__dirname, './src/ts/tsconfig.json')
            }
        }),
        new ForkTSCheckerWebpackPlugin({
            async: true,
            devServer: false,
            typescript: {
                configFile: path.resolve(__dirname, './tests/tsconfig.json')
            }
        }),
        new ESLintWebpackPlugin({
            extensions: ['.tsx', '.ts'],
            files: [path.resolve(__dirname, './tests/')]
        })
    ]
});

export default test;
