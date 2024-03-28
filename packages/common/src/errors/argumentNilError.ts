//-- Project Code
import {ArgumentError} from './argumentError';

/**
 * An error that is produced when an argument is `null` or `undefined` and
 * should not have been.
 */
export class ArgumentNilError extends ArgumentError {
    /**
     * Create a new instance.
     *
     * @param argumentName - The name of the argument that was invalid.
     * @param message - The message describing what went wrong.
     * @param inner - The error that caused the new instance to be created.
     */
    public constructor(argumentName: string, message?: string, inner?: Error) {
        super(
            argumentName,
            message ?? `Invalid argument "${argumentName}" (null or undefined)`,
            inner
        );
    }
}
