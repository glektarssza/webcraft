//-- NodeJS
import path from 'node:path';

//-- NPM Packages
import ForkTSCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import {Configuration} from 'webpack';
import webpackMerge from 'webpack-merge';
import webpackNodeExternals from 'webpack-node-externals';

//-- Project Code
import common from './webpack.config.common';

/**
 * The development Webpack configuration.
 */
const dev: Configuration = webpackMerge(common, {
    name: 'dev',
    mode: 'development',
    devtool: 'inline-source-map',
    resolve: {},
    entry: {
        index: './src/index.ts'
    },
    output: {
        clean: true,
        path: path.resolve(__dirname, './dist/dev/'),
        filename: 'webcraft-webgl.js',
        globalObject: 'this',
        library: {
            name: {
                root: 'webcraftWebGL',
                amd: 'webcraft-webgl',
                commonjs: 'webcraft-webgl'
            },
            type: 'umd'
        }
    },
    externals: [
        webpackNodeExternals({
            importType: 'umd'
        })
    ],
    module: {
        rules: []
    },
    plugins: [
        new ForkTSCheckerWebpackPlugin({
            async: true,
            devServer: true,
            typescript: {
                configFile: path.resolve(__dirname, './src/tsconfig.json')
            }
        })
    ]
});

export default dev;
