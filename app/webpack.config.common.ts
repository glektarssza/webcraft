//-- NodeJS
import * as path from 'node:path';

//-- NPM Packages
import TSConfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import {Configuration} from 'webpack';

//-- Project Code
import './pug-plugin';

/**
 * Get the common Webpack configuration.
 *
 * @returns The common Webpack configuration elements.
 */
const getConfig = async (): Promise<Configuration> => {
    const ESLintWebpackPlugin = await import('eslint-webpack-plugin');
    const PugPlugin = await import('pug-plugin');
    return {
        context: path.resolve(__dirname),
        target: 'browserlist:> 0.5%, last 2 versions, not dead',
        resolve: {
            extensions: ['.ts', '.js'],
            plugins: [
                new TSConfigPathsPlugin({
                    configFile: path.resolve(
                        __dirname,
                        './src/ts/tsconfig.json'
                    )
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
                extensions: ['.ts'],
                files: [path.resolve(__dirname, './src/ts/')]
            })
        ]
    };
};

export default getConfig;
