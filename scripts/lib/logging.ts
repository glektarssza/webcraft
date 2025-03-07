/**
 * A very minimal, simplistic logging utility.
 *
 * @module
 */

//-- NPM Packages
import {Chalk} from 'chalk';
import {inspect} from 'node:util';

/**
 * The {@link Chalk} instance.
 */
const chalkInstance = new Chalk();

/**
 * Whether verbose logging is enabled.
 */
let isVerboseEnabled = false;

/**
 * Get whether verbose logging is enabled.
 *
 * @returns Whether verbose logging is enabled.
 */
export function isVerboseLoggingEnabled(): boolean {
    return isVerboseEnabled;
}

/**
 * Set whether verbose logging is enabled.
 *
 * @param value Whether verbose logging is enabled.
 */
export function setVerboseLoggingEnabled(value: boolean): void {
    isVerboseEnabled = value;
}

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
 * Log some information as an error.
 *
 * @param data The data to log.
 */
export function error(...data: unknown[]): void {
    process.stderr.write(
        `[${chalkInstance.ansi256(160)('ERROR')}] ${data
            .map((item) => inspect(item, false, null, chalkInstance.level > 0))
            .join(' ')}\n`
    );
}

/**
 * Log some information as a warning.
 *
 * @param data The data to log.
 */
export function warn(...data: unknown[]): void {
    process.stderr.write(
        `[${chalkInstance.ansi256(208)('WARN')}] ${data
            .map((item) => inspect(item, false, null, chalkInstance.level > 0))
            .join(' ')}\n`
    );
}

/**
 * Log some information as an informational message.
 *
 * @param data The data to log.
 */
export function info(...data: unknown[]): void {
    process.stderr.write(
        `[${chalkInstance.ansi256(111)('INFO')}] ${data
            .map((item) => inspect(item, false, null, chalkInstance.level > 0))
            .join(' ')}\n`
    );
}

/**
 * Log some information as a verbose message.
 *
 * @param data The data to log.
 */
export function verbose(...data: unknown[]): void {
    if (!isVerboseLoggingEnabled()) {
        return;
    }
    process.stderr.write(
        `[${chalkInstance.ansi256(213)('VERBOSE')}] ${data
            .map((item) => inspect(item, false, null, chalkInstance.level > 0))
            .join(' ')}\n`
    );
}
