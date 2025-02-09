//-- NodeJS
import path from 'node:path';

//-- NPM Packages
import chalk from 'chalk';
import {program} from 'commander';

/**
 * The command line options.
 */
interface CLIOptions {
    /**
     * Whether to perform a dry run.
     */
    dryRun: boolean;

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
        '--dry-run',
        'Whether to perform a "dry run", which performs no actual operations.',
        false
    )
    .option(
        '--sizes, -s',
        'The sizes of favicons to generate.',
        (arg, prev) => {
            prev.push(parseInt(arg, 10));
            return prev;
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
            inputImagePath,
            outputPath,
            options: CLIOptions
        ): Promise<void> => {
            console.debug(inputImagePath);
            console.debug(outputPath);
            console.debug(options);
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
