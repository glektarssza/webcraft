/**
 * A simple logging utility.
 *
 * @module
 */

//-- NodeJS
import {inspect} from 'node:util';

//-- NPM Packages
import {Chalk} from 'chalk';

/**
 * The chalk instance used by this module.
 */
const chalk = new Chalk();

/**
 * Whether verbose logging is enabled.
 */
let verboseEnabled: boolean = false;

/**
 * Get whether verbose logging is enabled.
 *
 * @returns Whether verbose logging is enabled.
 */
export function isVerboseLoggingEnabled(): boolean {
    return verboseEnabled;
}

/**
 * Set whether verbose logging is enabled.
 *
 * @param value - Whether verbose logging is enabled.
 */
export function setVerboseLoggingEnabled(value: boolean): void {
    verboseEnabled = value;
}

/**
 * Reset whether verbose logging is enabled.
 */
export function resetVerboseLoggingEnabled(): void {
    setVerboseLoggingEnabled(false);
}

/**
 * Toggle whether verbose logging is enabled.
 */
export function toggleVerboseLoggingEnabled(): void {
    setVerboseLoggingEnabled(!isVerboseLoggingEnabled());
}

/**
 * Format some object into a string.
 *
 * @param data - The data to format.
 *
 * @returns The data formatted into a string.
 */
function formatObjects(data: unknown): string {
    return typeof data === 'string' ? data : (
            inspect(data, {
                colors: chalk.level > 0,
                compact: false,
                depth: Infinity,
                showHidden: false,
                numericSeparator: false,
                breakLength: 80
            })
        );
}

/**
 * Log some data as an error message.
 *
 * @param data - The data to log.
 */
export function logError(...data: unknown[]): void {
    process.stderr.write(
        `[${chalk.ansi256(196)('ERROR')}] ${data.map(formatObjects).join(' ')}\n`
    );
}

/**
 * Log some data as a warning message.
 *
 * @param data - The data to log.
 */
export function logWarning(...data: unknown[]): void {
    process.stdout.write(
        `[${chalk.ansi256(208)('WARN')}] ${data.map(formatObjects).join(' ')}\n`
    );
}

/**
 * Log some data as an informational message.
 *
 * @param data - The data to log.
 */
export function logInfo(...data: unknown[]): void {
    process.stdout.write(
        `[${chalk.ansi256(117)('INFO')}] ${data.map(formatObjects).join(' ')}\n`
    );
}

/**
 * Log some data as a verbose message.
 *
 * @param data - The data to log.
 */
export function logVerbose(...data: unknown[]): void {
    if (!isVerboseLoggingEnabled()) {
        return;
    }
    process.stdout.write(
        `[${chalk.ansi256(207)('VERBOSE')}] ${data.map(formatObjects).join(' ')}\n`
    );
}
