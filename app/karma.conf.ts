//-- NodeJS
import path from 'path';

//-- NPM Packages
import {Config, ConfigOptions} from 'karma';
import {executablePath} from 'puppeteer';

//-- Project Code
import webpackConfig from './webpack.config.test';

/**
 * Get the Karma configuration.
 *
 * @param config - The Karma configuration API object.
 */
function getConfig(config: Config) {
    let puppeteerExecutable = null;
    try {
        puppeteerExecutable = executablePath();
    } catch {
        //-- Silence error
    }
    if (puppeteerExecutable) {
        process.env['CHROME_BIN'] = puppeteerExecutable;
    }
    config.set({
        basePath: path.resolve(__dirname),
        plugins: [
            'karma-webpack',
            'karma-sourcemap-loader',
            'karma-mocha',
            'karma-chrome-launcher',
            'karma-spec-reporter',
            'karma-coverage-istanbul-reporter'
        ],
        frameworks: ['mocha', 'webpack'],
        preprocessors: {
            'src/**/*.ts': ['webpack', 'sourcemap'],
            'tests/**/*.ts': ['webpack', 'sourcemap']
        },
        files: [
            {
                pattern: 'src/**/*.ts',
                served: true,
                watched: false,
                //-- Set to "true" for all file coverage
                included: true
            },
            {
                pattern: 'tests/**/*.ts',
                served: true,
                watched: false,
                included: true
            }
        ],
        failOnEmptyTestSuite: false,
        reporters: ['spec', 'coverage-istanbul'],
        webpack: webpackConfig,
        coverageIstanbulReporter: {
            reports: ['text', 'html'],
            dir: path.resolve(__dirname, './coverage/'),
            combineBrowserReports: true,
            fixWebpackSourcePaths: true,
            skipFilesWithNoCoverage: true,
            'report-config': {
                html: {
                    subdir: 'html'
                }
            }
        },
        sourceMapLoader: {
            remapPrefixes: {
                'webpack://webcraft-common': path.resolve(__dirname)
            }
        }
    } as ConfigOptions);
}

export default getConfig;
