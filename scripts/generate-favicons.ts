//-- NPM packages
import {supportsColorStderr} from 'chalk';
import {Command, CommanderError} from 'commander';

//-- NodeJS
import {inspect} from 'node:util';

//-- Project Code
import * as logging from './lib/logging.ts';

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
        //-- Does nothing
    } else if (ex instanceof Error) {
        logging.error('Fatal error!', ex);
    } else {
        logging.error('Fatal error!');
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

logging.setVerboseLoggingEnabled(opts.enableVerboseLogging);
logging.verbose('Verbose logging enabled');

console.log(opts);

process.exit(0);
