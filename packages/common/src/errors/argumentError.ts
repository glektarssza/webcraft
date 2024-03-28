//-- Project Code
import {BaseError} from './baseError';

/**
 * A base error for errors that are produced when an argument is invalid.
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
     * @param message - The message describing what went wrong.
     * @param inner - The error that caused the new instance to be created.
     */
    public constructor(argumentName: string, message?: string, inner?: Error) {
        super(message ?? `Invalid argument "${argumentName}"`, inner);
        this.argumentName = argumentName;
    }
}
