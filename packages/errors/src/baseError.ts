/**
 * A module which provides a common base error object.
 *
 * @module
 */

/**
 * A base error object that other errors can extend from.
 */
export class BaseError extends Error {
    /**
     * Create a new instance.
     *
     * @param message - The message describing what went wrong.
     * @param opts - A set of additional options to control how to create the new
     * instance.
     */
    public constructor(message?: string, opts?: ErrorOptions) {
        super(message, opts);
        this.name = 'BaseError';
    }
}
