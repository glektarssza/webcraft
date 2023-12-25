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
 * The production Webpack configuration.
 */
const prod: Configuration = webpackMerge(common, {
    name: 'prod',
    mode: 'production',
    devtool: 'hidden-source-map',
    resolve: {},
    entry: {
        index: './src/index.ts'
    },
    output: {
        clean: true,
        path: path.resolve(__dirname, './dist/prod/'),
        filename: 'webcraft-package-template.min.js',
        globalObject: 'this',
        library: {
            name: {
                root: 'webcraftPackageTemplate',
                amd: 'webcraft-package-template',
                commonjs: 'webcraft-package-template'
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
            devServer: false,
            typescript: {
                configFile: path.resolve(__dirname, './src/tsconfig.json')
            }
        })
    ]
});

export default prod;
