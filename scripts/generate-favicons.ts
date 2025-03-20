//-- NodeJS
import child_process from 'node:child_process';
import path from 'node:path';

//-- NPM Packages
import {Command, Option} from 'commander';

//-- Project Code
import {
    logError,
    logInfo,
    logVerbose,
    setVerboseLoggingEnabled
} from './lib/logging.ts';
import {whichSync} from './lib/which.ts';

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

    /**
     * Whether to actually generate resources.
     */
    dryRun: boolean;

    /**
     * The sizes of favicons to generate.
     */
    sizes: number[];
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

option = new Option('--dry-run, -d', 'Whether to actually generate resources.');
program.addOption(option);
program.setOptionValueWithSource(option.attributeName(), false, 'default');

option = new Option(
    '--sizes, -s [...sizes]',
    'The size(s) of favicons to generate.'
);
option.argParser<number[]>((value, previous) => {
    const v =
        program.getOptionValueSource('sizes') === 'default' ? [] : previous;
    value.split(',').forEach((item) => {
        const size = parseInt(item, 10);
        if (!isFinite(size)) {
            throw new Error(`Invalid size "${value}" (not finite)`);
        }
        v.push(size);
    });
    return v;
});
program.addOption(option);
program.setOptionValueWithSource(
    option.attributeName(),
    [256, 128, 64, 32, 16],
    'default'
);

program.parse(process.argv, {
    from: 'node'
});

const opts = program.opts<CLIOptions>();

if (opts.help) {
    process.stdout.write(`${program.helpInformation()}\n`);
    process.exit(0);
}

if (opts.version) {
    logInfo('v0.0.0');
    process.exit(0);
}

setVerboseLoggingEnabled(opts.verbose);

logVerbose('Arguments:', opts);

if (opts.verbose) {
    logVerbose('Verbose logging enabled');
}

/**
 * The location of the ImageMagick binary.
 */
const imageMagick = whichSync('magick');

if (!imageMagick) {
    logError('Failed to find ImageMagick!');
    process.exit(1);
}

logVerbose('Found ImageMagick at', imageMagick);

logInfo('Generating main favicon PNG...');

const pngResult: child_process.SpawnSyncReturns<string> =
    opts.dryRun ?
        {
            output: [],
            pid: 0,
            signal: null,
            status: 0,
            stderr: '',
            stdout: ''
        }
    :   child_process.spawnSync(
            imageMagick,
            [
                '-background',
                'transparent',
                path.resolve(import.meta.dirname, '../logo.svg'),
                path.resolve(import.meta.dirname, '../app/public/logo.png')
            ],
            {
                cwd: import.meta.dirname,
                encoding: 'utf-8',
                env: process.env,
                windowsHide: true,
                stdio: ['ignore', 'pipe', 'pipe'],
                shell: true
            }
        );

if (pngResult.error !== undefined) {
    logError('Failed to spawn ImageMagick!');
    logError(pngResult.error);
    process.exit(1);
}

if (pngResult.signal !== null) {
    logError('Failed to run ImageMagick!');
    logError('Process terminated with signal', pngResult.signal);
    process.exit(1);
}

if (pngResult.status !== 0) {
    logError('Failed to run ImageMagick!');
    logError('Process exited with status code', pngResult.status);
    process.exit(1);
}

logInfo('Generated main favicon PNG');

logInfo('Generating resized favicon PNGs...');

opts.sizes.forEach((size) => {
    logInfo(`Generating favicon PNG for size ${size}x${size}...`);

    const resizedResult: child_process.SpawnSyncReturns<string> =
        opts.dryRun ?
            {
                output: [],
                pid: 0,
                signal: null,
                status: 0,
                stderr: '',
                stdout: ''
            }
        :   child_process.spawnSync(
                imageMagick,
                [
                    '-background',
                    'transparent',
                    path.resolve(import.meta.dirname, '../logo.svg'),
                    '-resize',
                    `${size}x${size}`,
                    '+repage',
                    path.resolve(
                        import.meta.dirname,
                        `../app/public/logo-x${size}.png`
                    )
                ],
                {
                    cwd: import.meta.dirname,
                    encoding: 'utf-8',
                    env: process.env,
                    windowsHide: true,
                    stdio: ['ignore', 'pipe', 'pipe'],
                    shell: true
                }
            );

    if (resizedResult.error !== undefined) {
        logError('Failed to spawn ImageMagick!');
        logError(resizedResult.error);
        process.exit(1);
    }

    if (resizedResult.signal !== null) {
        logError('Failed to run ImageMagick!');
        logError('Process terminated with signal', resizedResult.signal);
        process.exit(1);
    }

    if (resizedResult.status !== 0) {
        logError('Failed to run ImageMagick!');
        logError('Process exited with status code', resizedResult.status);
        process.exit(1);
    }

    logInfo(`Generated sized favicon for size ${size}x${size}`);
});

logInfo('Generated resized favicon PNGs');

logInfo('Generating main favicon ICO...');

const icoResult: child_process.SpawnSyncReturns<string> =
    opts.dryRun ?
        {
            output: [],
            pid: 0,
            signal: null,
            status: 0,
            stderr: '',
            stdout: ''
        }
    :   child_process.spawnSync(
            imageMagick,
            [
                '-background',
                'transparent',
                path.resolve(import.meta.dirname, '../logo.svg'),
                '-define',
                `icon:auto-resize=${opts.sizes.join(',')}`,
                path.resolve(import.meta.dirname, '../app/public/favicon.ico')
            ],
            {
                cwd: import.meta.dirname,
                encoding: 'utf-8',
                env: process.env,
                windowsHide: true,
                stdio: ['ignore', 'pipe', 'pipe'],
                shell: true
            }
        );

if (icoResult.error !== undefined) {
    logError('Failed to spawn ImageMagick!');
    logError(icoResult.error);
    process.exit(1);
}

if (icoResult.signal !== null) {
    logError('Failed to run ImageMagick!');
    logError('Process terminated with signal', icoResult.signal);
    process.exit(1);
}

if (icoResult.status !== 0) {
    logError('Failed to run ImageMagick!');
    logError('Process exited with status code', icoResult.status);
    process.exit(1);
}

logInfo('Generated main favicon ICO');

logInfo('Done!');
