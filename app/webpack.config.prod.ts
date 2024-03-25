//-- NodeJS
import * as path from 'node:path';

//-- NPM Packages
import {Configuration} from 'webpack';
import webpackMerge from 'webpack-merge';

//-- Project Code
import getCommonConfig from './webpack.config.common';

/**
 * Get the production Webpack configuration.
 *
 * @returns The production Webpack configuration.
 */
const getConfig = async (): Promise<Configuration> => {
    const ForkTSCheckerWebpackPlugin = await import(
        'fork-ts-checker-webpack-plugin'
    );
    const PugPlugin = await import('pug-plugin');
    const common = await getCommonConfig();
    return webpackMerge(common, {
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
