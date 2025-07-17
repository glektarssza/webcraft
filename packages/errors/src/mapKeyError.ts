/**
 * A module which provides a common error object for when keys in a map cause an
 * error.
 *
 * @module
 */

import {BaseError} from './baseError';

/**
 * A common error object for when when keys in a map cause an error.
 */
export class MapKeyError extends BaseError {
    /**
     * The name of the key which errored.
     */
    public readonly keyName: string;

    /**
     * Create a new instance.
     *
     * @param keyName - The name of the key which errored.
     * @param message - The message describing what went wrong.
     * @param opts - A set of additional options to control how to create the new
     * instance.
     */
    public constructor(keyName: string, message?: string, opts?: ErrorOptions) {
        super(message ?? `Invalid map key '${keyName}'`, opts);
        this.name = 'MapKeyError';
        this.keyName = keyName;
    }
}
