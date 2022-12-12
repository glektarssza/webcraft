/// <reference types="Webpack-dev-server" />
import path from 'path';
import {Configuration} from 'webpack';
import webpackMerge from 'webpack-merge';

const common: Configuration = {
    context: __dirname,
    entry: {
        index: path.resolve(__dirname, './src/index.pug')
    },
    output: {
        clean: true,
        path: path.resolve(__dirname, './dist/')
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: []
    },
    plugins: []
};

const dev: Configuration = webpackMerge(common, {
    name: 'dev',
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        filename: 'app.[contenthash].js'
    },
    devServer: {
        port: 8080,
        hot: false,
        liveReload: false
    },
    module: {
        rules: []
    },
    plugins: []
});

const prod: Configuration = webpackMerge(common, {
    name: 'prod',
    mode: 'production',
    devtool: 'hidden-source-map',
    output: {
        filename: 'app.[contenthash].min.js'
    },
    module: {
        rules: []
    },
    plugins: []
});

export default [dev, prod];
