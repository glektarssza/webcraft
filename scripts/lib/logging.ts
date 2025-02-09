//-- NPM Packages
import chalk from 'chalk';

/**
 * Whether to enable verbose logging.
 */
let isVerboseEnabled: boolean = false;

/**
 * Set whether verbose logging is enabled.
 *
 * @param value Whether verbose logging is enabled.
 */
export function setVerboseEnabled(value: boolean): void {
    isVerboseEnabled = value;
}

/**
 * Toggle whether verbose logging is enabled.
 */
export function toggleVerboseEnabled(): void {
    setVerboseEnabled(!getVerboseEnabled());
}

/**
 * Get whether verbose logging is enabled.
 *
 * @returns Whether verbose logging is enabled.
 */
export function getVerboseEnabled(): boolean {
    return isVerboseEnabled;
}

/**
 * Reset whether verbose logging is enabled.
 */
export function resetVerboseEnabled(): void {
    setVerboseEnabled(false);
}

/**
 * Log the given messages to the standard error as error messages.
 *
 * @param messages A set of messages to the standard output which will be
 * separated by spaces.
 */
export function logError(...messages: string[]): void {
    process.stderr.write(
        `[${chalk.redBright('ERROR')}] ${messages.join(' ')}\n`
    );
}

/**
 * Log the given messages to the standard output as warning messages.
 *
 * @param messages A set of messages to the standard output which will be
 * separated by spaces.
 */
export function logWarning(...messages: string[]): void {
    process.stdout.write(
        `[${chalk.yellowBright('WARN')}] ${messages.join(' ')}\n`
    );
}

/**
 * Log the given messages to the standard output as informational messages.
 *
 * @param messages A set of messages to the standard output which will be
 * separated by spaces.
 */
export function logInfo(...messages: string[]): void {
    process.stdout.write(
        `[${chalk.cyanBright('INFO')}] ${messages.join(' ')}\n`
    );
}

/**
 * Log the given messages to the standard output as verbose messages.
 *
 * @param messages A set of messages to the standard output which will be
 * separated by spaces.
 */
export function logVerbose(...messages: string[]): void {
    process.stdout.write(
        `[${chalk.magentaBright('VERBOSE')}] ${messages.join(' ')}\n`
    );
}
