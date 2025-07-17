/**
 * A module which provides a common base argument error object.
 *
 * @module
 */

import {BaseError} from './baseError';

/**
 * A base argument error object that other argument errors can extend from.
 */
export class ArgError extends BaseError {
    /**
     * The name of the argument which errored.
     */
    public readonly argName: string;

    /**
     * Create a new instance.
     *
     * @param argName - The name of the argument which errored.
     * @param message - The message describing what went wrong.
     * @param opts - A set of additional options to control how to create the new
     * instance.
     */
    public constructor(argName: string, message?: string, opts?: ErrorOptions) {
        super(message ?? `Invalid argument '${argName}'`, opts);
        this.name = 'ArgError';
        this.argName = argName;
    }
}
