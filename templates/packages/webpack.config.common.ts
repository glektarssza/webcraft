//-- NodeJS
import path from 'node:path';

//-- NPM Packages
import ESLintWebpackPlugin from 'eslint-webpack-plugin';
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
                configFile: path.resolve(__dirname, './src/tsconfig.json')
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
                                './src/tsconfig.json'
                            )
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new ESLintWebpackPlugin({
            cache: false,
            extensions: ['.tsx', '.ts'],
            files: [path.resolve(__dirname, './src/')]
        })
    ]
};

export default config;
