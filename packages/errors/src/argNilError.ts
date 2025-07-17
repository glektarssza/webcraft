/**
 * A module which provides a error object for when an argument is `null` or
 * `undefined`.
 *
 * @module
 */

import {ArgError} from './argError';

/**
 * An error object for when an argument is `null` or `undefined`.
 */
export class ArgNilError extends ArgError {
    /**
     * Create a new instance.
     *
     * @param argName - The name of the argument which errored.
     * @param message - The message describing what went wrong.
     * @param opts - A set of additional options to control how to create the new
     * instance.
     */
    public constructor(argName: string, message?: string, opts?: ErrorOptions) {
        super(
            argName,
            message ?? `Invalid argument '${argName}' (null or undefined)`,
            opts
        );
        this.name = 'ArgNilError';
    }
}
