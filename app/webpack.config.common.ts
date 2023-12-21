//-- Type Definitions
import './pug-plugin';

//-- NodeJS
import path from 'node:path';

//-- NPM Packages
import ESLintWebpackPlugin from 'eslint-webpack-plugin';
import PugPlugin from 'pug-plugin';
import TSConfigPathsWebpackPlugin from 'tsconfig-paths-webpack-plugin';
import {Configuration} from 'webpack';

/**
 * The common configuration elements for Webpack.
 */
const config: Configuration = {
    context: __dirname,
    target: 'browserslist:> 0.5%, last 2 versions, not dead',
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js'],
        plugins: [
            new TSConfigPathsWebpackPlugin({
                configFile: path.resolve(__dirname, './src/ts/tsconfig.json')
            })
        ]
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
                exclude: /node_modules|tests/,
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
                test: /\.(pug)$/,
                exclude: /node_modules/,
                use: [PugPlugin.loader]
            },
            {
                test: /\.(jpeg|jpg|png|bmp|gif)$/,
                exclude: /node_modules/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[contenthash][ext][query]'
                }
            },
            {
                test: /\.(eot|woff|woff2|ttf|otf)$/,
                exclude: /node_modules/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[contenthash][ext][query]'
                }
            }
        ]
    },
    plugins: [
        new ESLintWebpackPlugin({
            cache: false,
            extensions: ['.tsx', '.ts'],
            files: [path.resolve(__dirname, './src/ts/')]
        })
    ]
};

export default config;
