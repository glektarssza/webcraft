//-- NodeJS
import path from 'node:path';

//-- NPM Packages
import chalk from 'chalk';
import {program} from 'commander';

//-- Project Code
import {run} from './lib/child_proc.ts';
import {
    getVerboseEnabled,
    logError,
    logInfo,
    logVerbose,
    setVerboseEnabled
} from './lib/logging.ts';

/**
 * The command line options.
 */
interface CLIOptions {
    /**
     * The sizes of favicons to generate.
     */
    sizes: number[];

    /**
     * Whether to output verbose logs.
     */
    verbose: boolean;
}

/**
 * The root command.
 */
const command = program.createCommand();

command
    .name('generate-favicons')
    .version(
        '0.0.0',
        '--version',
        'Show the version information and then exit.'
    )
    .helpOption('--help, -h', 'Show the help information and then exit.')
    .addHelpText(
        'afterAll',
        "Copyright (c) 2025 G'lek Tarssza, all rights reserved."
    )
    .option('--verbose, -v', 'Whether to output verbose logs.', false)
    .option(
        '--sizes, -s [sizes...]',
        'The sizes of favicons to generate.',
        (arg, prev: number[]) => {
            if (command.getOptionValueSource('sizes') === 'default') {
                prev.length = 0;
                command.setOptionValueWithSource('sizes', prev, 'cli');
            }
            const size = parseInt(arg, 10);
            if (!prev.includes(size)) {
                prev.push(size);
            }
            return prev.sort((a, b) => b - a);
        },
        [256, 128, 64, 48, 32, 24, 16]
    )
    .argument(
        '[input-image]',
        'The path to the input image to generate favicons from.',
        (value) => path.resolve(value),
        path.resolve(import.meta.dirname, '../logo.svg')
    )
    .argument(
        '[output-path]',
        'The path to the location to store the generated favicons in.',
        (value) => path.resolve(value),
        path.resolve(import.meta.dirname, '../app/public/')
    )
    .showSuggestionAfterError(true)
    .allowExcessArguments(false)
    .allowUnknownOption(false)
    .exitOverride((err): void => {
        if (err.exitCode !== 0) {
            process.stdout.write(`${chalk.redBright('Fatal error')}\n`);
        }
    })
    .action(
        async (
            inputImagePath: string,
            outputPath: string,
            options: CLIOptions
        ): Promise<void> => {
            setVerboseEnabled(options.verbose);
            if (getVerboseEnabled()) {
                logInfo('Verbose logging enabled');
            }
            logInfo(
                'Generating favicons from',
                inputImagePath,
                'to',
                outputPath
            );
            logVerbose(
                'Generating favicons at sizes',
                options.sizes.join(', ')
            );
            logInfo('Generating full resolution PNG favicon...');
            await run(
                'magick',
                [
                    '-background',
                    'transparent',
                    inputImagePath,
                    '+repage',
                    path.resolve(outputPath, 'logo.png')
                ],
                {
                    shell: false,
                    stdio: ['ignore', 'pipe', 'pipe'],
                    windowsHide: true
                }
            ).catch((err: Error): void => {
                logError(err.message);
                throw new Error('Failed to generate PNG favicon!');
            });
            logInfo('Generating resized PNG favicons...');
            await Promise.all(
                options.sizes.map(async (size): Promise<void> => {
                    await run(
                        'magick',
                        [
                            '-background',
                            'transparent',
                            inputImagePath,
                            '-resize',
                            `${size}x${size}`,
                            '+repage',
                            path.resolve(outputPath, `logo-${size}.png`)
                        ],
                        {
                            shell: false,
                            stdio: ['ignore', 'pipe', 'pipe'],
                            windowsHide: true
                        }
                    ).catch((err: Error): void => {
                        logError(err.message);
                        throw new Error(
                            'Failed to generate resized PNG favicon!'
                        );
                    });
                })
            ).catch((err: Error): void => {
                logError(err.message);
                throw new Error('Failed to generate resized PNG favicons!');
            });
            logInfo('Generating ICO favicon...');
            await run(
                'magick',
                [
                    '-background',
                    'transparent',
                    inputImagePath,
                    '-define',
                    `icon:auto-resize=${options.sizes.join(',')}`,
                    path.resolve(outputPath, 'logo.ico')
                ],
                {
                    shell: false,
                    stdio: ['ignore', 'pipe', 'pipe'],
                    windowsHide: true
                }
            ).catch((err: Error): void => {
                logError(err.message);
                throw new Error('Failed to generate ICO favicon!');
            });
        }
    )
    .parseAsync()
    .then((): void => {
        process.stdout.write(`${chalk.greenBright('Success')}\n`);
    })
    .catch((err: Error): void => {
        process.stdout.write(`${chalk.redBright('Fatal error')}\n`);
        process.stdout.write(`${err.name}: ${err.message}\n`);
    });
