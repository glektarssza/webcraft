import {BaseError} from './baseError';

/**
 * A base class for all argument-related errors to extend from.
 */
export class ArgumentError extends BaseError {
    /**
     * The name of the argument that was invalid.
     */
    public readonly argumentName: string;

    /**
     * Create a new instance.
     *
     * @param argumentName - The name of the argument that was invalid.
     * @param message - A string describing the nature of the error.
     * @param inner - The error which caused the new instance to be created.
     */
    public constructor(argumentName: string, message?: string, inner?: Error) {
        super(message ?? `Invalid argument "${argumentName}"`, inner);
        this.argumentName = argumentName;
    }
}

/**
 * A module which contains the {@link ArgumentError | argument error} class.
 */
const m = {};

/**
 * Get the module object for use in unit tests.
 *
 * @returns The module object for use in unit tests.
 *
 * @internal
 */
export function getTestModule() {
    return m;
}

/* eslint-disable no-empty-pattern */
export const {} = m;
/* eslint-enable no-empty-pattern */
