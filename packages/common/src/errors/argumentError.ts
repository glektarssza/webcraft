import {BaseError} from './baseError';

/**
 * An error thrown when an argument is invalid.
 */
export class ArgumentError extends BaseError {
    /**
     * The name of the argument that is invalid.
     */
    public readonly argumentName: string;

    /**
     * Create a new instance.
     *
     * @param argumentName - The name of the argument that is invalid.
     * @param message - A string describing the nature of the error.
     * @param inner - The inner error that caused the new instance to be
     * created.
     */
    public constructor(argumentName: string, message?: string, inner?: Error) {
        super(message ?? `Invalid argument "${argumentName}"`, inner);
        this.argumentName = argumentName;
        this.name = 'ArgumentError';
    }
}
