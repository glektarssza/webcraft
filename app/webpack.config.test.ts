//-- NodeJS
import * as path from 'node:path';

//-- NPM Packages
import TSConfigPathsWebpackPlugin from 'tsconfig-paths-webpack-plugin';
import {Configuration} from 'webpack';
import 'webpack-dev-server';
import webpackMerge from 'webpack-merge';

//-- Project Code
import getCommonConfig from './webpack.config.common';

/**
 * Get the testing Webpack configuration.
 *
 * @returns The testing Webpack configuration.
 */
const getConfig = async (): Promise<Configuration> => {
    const ESLintWebpackPlugin = await import('eslint-webpack-plugin');
    const ForkTSCheckerWebpackPlugin = await import(
        'fork-ts-checker-webpack-plugin'
    );
    const common = await getCommonConfig();
    return webpackMerge(common, {
        name: 'test',
        mode: 'development',
        devtool: 'inline-source-map',
        devServer: {
            port: 8080,
            hot: false,
            liveReload: false
        },
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
                devServer: true,
                typescript: {
                    configFile: path.resolve(
                        __dirname,
                        './src/ts/tsconfig.json'
                    )
                }
            }),
            new ForkTSCheckerWebpackPlugin({
                async: true,
                devServer: true,
                typescript: {
                    configFile: path.resolve(__dirname, './tests/tsconfig.json')
                }
            }),
            new ESLintWebpackPlugin({
                extensions: ['.ts'],
                files: [path.resolve(__dirname, './tests/')]
            })
        ]
    });
};

export default getConfig;
