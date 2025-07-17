/**
 * A module which provides an error object for when a key in a map conflicts with
 * another key.
 *
 * @module
 */

import {MapKeyError} from './mapKeyError';

/**
 * A common error object for when when a key in a map conflicts with another key.
 */
export class MapKeyConflictError extends MapKeyError {
    /**
     * Create a new instance.
     *
     * @param keyName - The name of the key which errored.
     * @param message - The message describing what went wrong.
     * @param opts - A set of additional options to control how to create the new
     * instance.
     */
    public constructor(keyName: string, message?: string, opts?: ErrorOptions) {
        super(
            keyName,
            message ?? `Invalid map key '${keyName}' (key conflict)`,
            opts
        );
        this.name = 'MapKeyConflictError';
    }
}
