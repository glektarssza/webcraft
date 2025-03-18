//-- NPM Packages
import {Chalk} from 'chalk';
import {Command, Option} from 'commander';
import {info} from 'node:console';
import {inspect} from 'node:util';

/**
 * The chalk instance for the script.
 */
const chalk = new Chalk();

/**
 * The options exposed by the command-line interface.
 */
interface CLIOptions {
    /**
     * Whether to show the help information and then exit.
     */
    help: boolean;

    /**
     * Whether to show the version information and then exit.
     */
    version: boolean;

    /**
     * Whether to enable verbose logging.
     */
    verbose: boolean;
}

/**
 * The main command-line interface program.
 */
const program = new Command('generate-favicons');

program
    .description('Generate application favicons.')
    .addHelpText(
        'afterAll',
        "Copyright (c) 2025 G'lek Tarssza, all rights reserved."
    );

program
    .allowExcessArguments(false)
    .allowUnknownOption(false)
    .helpCommand(false)
    .helpOption(false);

let option = new Option('--help, -h', 'Show help information and then exit.');
program.addOption(option);
program.setOptionValueWithSource(option.attributeName(), false, 'default');

option = new Option('--version', 'Show version information and then exit.');
program.addOption(option);
program.setOptionValueWithSource(option.attributeName(), false, 'default');

option = new Option('--verbose, -v', 'Whether to enable verbose logging.');
program.addOption(option);
program.setOptionValueWithSource(option.attributeName(), false, 'default');

program.parse(process.argv, {
    from: 'node'
});

const opts = program.opts<CLIOptions>();

if (opts.help) {
    process.stdout.write(`${program.helpInformation()}\n`);
    process.exit(0);
}

if (opts.version) {
    info('v0.0.0');
    process.exit(0);
}

if (opts.verbose) {
    process.stdout.write(
        `[${chalk.ansi256(207)('VERBOSE')}] Verbose logging enabled\n`
    );
}

process.stdout.write(
    `${inspect(opts, {
        compact: false,
        colors: chalk.level > 0,
        depth: Infinity,
        showHidden: false
    })}`
);
