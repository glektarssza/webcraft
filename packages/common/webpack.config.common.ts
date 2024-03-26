//-- NodeJS
import * as path from 'node:path';

//-- NPM Packages
import ESLintWebpackPlugin from 'eslint-webpack-plugin';
import type {Configuration} from 'webpack';

/**
 * The common Webpack configuration elements.
 */
const config: Configuration = {
    context: path.resolve(__dirname),
    target: 'browserslist:> 0.5%, last 2 versions, not dead',
    resolve: {
        extensions: ['.ts', '.js']
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
            extensions: ['.ts'],
            files: [path.resolve(__dirname, './src/')]
        })
    ]
};

export default config;
