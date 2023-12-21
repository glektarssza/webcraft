//-- NPM Packages
import {Configuration} from 'webpack';

/**
 * The common configuration elements for Webpack.
 */
const config: Configuration = {
    context: __dirname,
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js'],
        plugins: []
    },
    module: {
        rules: []
    },
    plugins: []
};

export default config;
