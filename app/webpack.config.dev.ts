//-- NodeJS
import * as path from 'node:path';

//-- NPM Packages
import {Configuration} from 'webpack';
import 'webpack-dev-server';
import webpackMerge from 'webpack-merge';

//-- Project Code
import getCommonConfig from './webpack.config.common';

/**
 * Get the development Webpack configuration.
 *
 * @returns The development Webpack configuration.
 */
const getConfig = async (): Promise<Configuration> => {
    const ForkTSCheckerWebpackPlugin = await import(
        'fork-ts-checker-webpack-plugin'
    );
    const PugPlugin = await import('pug-plugin');
    const common = await getCommonConfig();
    return webpackMerge(common, {
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
                    configFile: path.resolve(
                        __dirname,
                        './src/ts/tsconfig.json'
                    )
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
};

export default getConfig;
