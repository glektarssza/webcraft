/**
 * A module which provides a error object for when an argument is outside of the
 * allowed range
 *
 * @module
 */

import {ArgError} from './argError';

/**
 * An error object for when an argument is outside of the allowed range.
 *
 * @typeParam T - The type of the argument.
 */
export class ArgRangeError<T> extends ArgError {
    /**
     * The minimum value the argument is allowed the have.
     */
    public readonly minAllowedValue: T;

    /**
     * The maximum value the argument is allowed the have.
     */
    public readonly maxAllowedValue: T;

    /**
     * Create a new instance.
     *
     * @param argName - The name of the argument which errored.
     * @param message - The message describing what went wrong.
     * @param opts - A set of additional options to control how to create the new
     * instance.
     */
    public constructor(
        argName: string,
        minAllowedValue: T,
        maxAllowedValue: T,
        message?: string,
        opts?: ErrorOptions
    ) {
        super(
            argName,
            message ??
                `Invalid argument '${argName}' (outside allowed range of '${JSON.stringify(minAllowedValue)}' to '${JSON.stringify(maxAllowedValue)}')`,
            opts
        );
        this.name = 'ArgRangeError';
        this.minAllowedValue = minAllowedValue;
        this.maxAllowedValue = maxAllowedValue;
    }
}
