import {ArgumentError} from './argumentError';

/**
 * An error that is produced when an argument is `null` or `undefined` when it
 * should not be.
 */
export class ArgumentNilError extends ArgumentError {
    /**
     * Create a new instance.
     *
     * @param argumentName - The name of the argument that was invalid.
     * @param message - A string describing the nature of the error.
     * @param inner - The error which caused the new instance to be created.
     */
    public constructor(argumentName: string, message?: string, inner?: Error) {
        super(
            argumentName,
            message ?? `Invalid argument "${argumentName}" (null or undefined)`,
            inner
        );
    }
}
