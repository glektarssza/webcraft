//-- NPM packages
import {supportsColorStderr, Chalk} from 'chalk';
import {Command, CommanderError} from 'commander';

//-- NodeJS
import {inspect} from 'node:util';

/**
 * The {@link Chalk} instance to use.
 */
const chalk = new Chalk();

/**
 * The main CLI {@link Command}.
 */
const program = new Command('generate-favicons');

/**
 * The command line interface options.
 */
interface CLIOptions {
    /**
     * Whether to show the help information and then exit.
     */
    showHelp: boolean;

    /**
     * Whether to show the version information and then exit.
     */
    showVersion: boolean;

    /**
     * Whether to enable verbose logging.
     */
    enableVerboseLogging: boolean;
}

/**
 * Whether verbose logging is enabled.
 */
let verboseLoggingEnabled: boolean = false;

/**
 * Log an error message.
 *
 * @param message The message to log.
 * @param ex An optional exception to log with the message.
 */
function logError(message: string, ex?: Error): void {
    process.stderr.write(`[${chalk.ansi256(196)('ERROR')}] ${message}\n`);
    if (ex) {
        process.stderr.write(`${ex.name}: ${ex.message}\n`);
    }
}

/**
 * Log a warning message.
 *
 * @param message The message to log.
 * @param ex An optional exception to log with the message.
 */
function logWarning(message: string, ex?: Error): void {
    process.stdout.write(`[${chalk.ansi256(208)('WARN')}] ${message}\n`);
    if (ex) {
        process.stdout.write(`${ex.name}: ${ex.message}\n`);
    }
}

/**
 * Log an informational message.
 *
 * @param message The message to log.
 * @param ex An optional exception to log with the message.
 */
function logInfo(message: string, ex?: Error): void {
    process.stdout.write(`[${chalk.ansi256(111)('INFO')}] ${message}\n`);
    if (ex) {
        process.stdout.write(`${ex.name}: ${ex.message}\n`);
    }
}

/**
 * Log an informational message.
 *
 * @param message The message to log.
 * @param ex An optional exception to log with the message.
 */
function logVerbose(message: string, ex?: Error): void {
    if (!verboseLoggingEnabled) {
        return;
    }
    process.stdout.write(`[${chalk.ansi256(207)('VERBOSE')}] ${message}\n`);
    if (ex) {
        process.stdout.write(`${ex.name}: ${ex.message}\n`);
    }
}

program.allowExcessArguments(false);
program.allowUnknownOption(false);
program.helpCommand(false);
program.helpOption(false);
program.addHelpText(
    'afterAll',
    "Copyright (c) 2025 G'lek Tarssza, all rights reserved."
);

const helpOption = program.createOption(
    '--help, -h',
    'Show the help information and then exit.'
);
helpOption.attributeName = () => {
    return 'showHelp';
};
program.addOption(helpOption);

const versionOption = program.createOption(
    '--version',
    'Show the version information and then exit.'
);
versionOption.attributeName = () => {
    return 'showVersion';
};
program.addOption(versionOption);

const verboseOption = program.createOption(
    '--verbose, -v',
    'Enable verbose logging.'
);
verboseOption.attributeName = () => {
    return 'enableVerboseLogging';
};
program.addOption(verboseOption);

const sizesOption = program.createOption(
    '--size, -s <size...>',
    'Set the size of favicons to generate.'
);
sizesOption.attributeName = () => {
    return 'sizes';
};
sizesOption.argParser<number[]>((arg, prev) => {
    if (
        program.getOptionValueSource(sizesOption.attributeName()) === 'default'
    ) {
        prev.length = 0;
    }
    if (!/^\d+$/.test(arg)) {
        throw new Error(`Illegal favicon size "${arg}" (non-integer value)`);
    }
    const value = parseInt(arg, 10);
    if (!isFinite(value)) {
        throw new Error(`Illegal favicon size "${arg}" (non-finite value)`);
    }
    if (prev.includes(value)) {
        return prev;
    }
    prev.push(value);
    return prev;
});
sizesOption.default([256, 128, 64, 32, 16, 8]);
program.addOption(sizesOption);

try {
    program.parse(process.argv, {
        from: 'node'
    });
} catch (ex) {
    if (ex instanceof CommanderError) {
    } else if (ex instanceof Error) {
        logError('Fatal error!', ex);
    } else {
        logError('Fatal error!');
        process.stderr.write(
            inspect(ex, {
                compact: false,
                colors:
                    typeof supportsColorStderr === 'boolean' ?
                        supportsColorStderr
                    :   supportsColorStderr.hasBasic
            })
        );
    }
    process.exit(1);
}

const opts = program.optsWithGlobals<CLIOptions>();

if (opts.showHelp) {
    process.stdout.write(`${program.helpInformation()}\n`);
    process.exit(0);
}

if (opts.showVersion) {
    process.stdout.write(`v0.0.1\n`);
    process.exit(0);
}

verboseLoggingEnabled = opts.enableVerboseLogging;
if (verboseLoggingEnabled) {
    logInfo('Verbose logging enabled');
}

console.log(opts);

process.exit(0);
