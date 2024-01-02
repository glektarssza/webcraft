import {ArgumentError} from './argumentError';

/**
 * An error thrown when an argument is `null` or `undefined`.
 */
export class ArgumentNilError extends ArgumentError {
    /**
     * Create a new instance.
     *
     * @param argumentName - The name of the argument that was `null` or
     * `undefined`.
     * @param message - A string describing the nature of the error.
     * @param inner - The inner error that caused the new instance to be
     * created.
     */
    public constructor(argumentName: string, message?: string, inner?: Error) {
        super(
            argumentName,
            message ??
                `Invalid argument "${argumentName}" (value is null or undefined)`,
            inner
        );
        this.name = 'ArgumentNilError';
    }
}
