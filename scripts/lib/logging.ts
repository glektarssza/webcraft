/**
 * A module which provides some simple logging utilities.
 *
 * @module
 */

//-- NPM Packages
import {Chalk} from 'chalk';

//-- NodeJS
import {inspect} from 'node:util';

/**
 * The Chalk instance.
 */
const chalkInstance = new Chalk();

/**
 * Whether verbose logging is enabled.
 */
let verboseEnabled: boolean = false;

/**
 * Get whether verbose logging is enabled.
 *
 * @returns Whether verbose logging is enabled.
 */
export function getVerboseEnabled(): boolean {
    return verboseEnabled;
}

/**
 * Set whether verbose logging is enabled.
 *
 * @param value Whether verbose logging is enabled.
 */
export function setVerboseEnabled(value: boolean): void {
    verboseEnabled = value;
}

/**
 * Reset whether verbose logging is enabled.
 */
export function resetVerboseEnabled(): void {
    setVerboseEnabled(false);
}

/**
 * Toggle whether verbose logging is enabled.
 */
export function toggleVerboseEnabled(): void {
    setVerboseEnabled(!getVerboseEnabled());
}

/**
 * Log some data as an error message.
 *
 * @param data The data to log.
 */
export function error(...data: unknown[]): void {
    process.stderr.write(
        `[${chalkInstance.ansi256(196)('ERROR')}] ${data
            .map((item: unknown): string => {
                return typeof item === 'string' ? item : (
                        inspect(item, false, null, chalkInstance.level > 0)
                    );
            })
            .join(' ')}\n`
    );
}

/**
 * Log some data as a warning message.
 *
 * @param data The data to log.
 */
export function warn(...data: unknown[]): void {
    process.stdout.write(
        `[${chalkInstance.ansi256(208)('WARN')}] ${data
            .map((item: unknown): string => {
                return typeof item === 'string' ? item : (
                        inspect(item, false, null, chalkInstance.level > 0)
                    );
            })
            .join(' ')}\n`
    );
}

/**
 * Log some data as an informational message.
 *
 * @param data The data to log.
 */
export function info(...data: unknown[]): void {
    process.stdout.write(
        `[${chalkInstance.ansi256(117)('INFO')}] ${data
            .map((item: unknown): string => {
                return typeof item === 'string' ? item : (
                        inspect(item, false, null, chalkInstance.level > 0)
                    );
            })
            .join(' ')}\n`
    );
}

/**
 * Log some data as a verbose message.
 *
 * @param data The data to log.
 */
export function verbose(...data: unknown[]): void {
    if (!getVerboseEnabled()) {
        return;
    }
    process.stdout.write(
        `[${chalkInstance.ansi256(207)('VERBOSE')}] ${data
            .map((item: unknown): string => {
                return typeof item === 'string' ? item : (
                        inspect(item, false, null, chalkInstance.level > 0)
                    );
            })
            .join(' ')}\n`
    );
}
