import {ArgumentError} from './argumentError';

/**
 * An error that is produced when an argument is outside of the allowed range of
 * values.
 *
 * @typeParam T - The type of value of the argument.
 */
export class ArgumentRangeError<T> extends ArgumentError {
    /**
     * The actual value of the argument.
     */
    public readonly actualValue: T;

    /**
     * The minimum allowed value that the argument could have had.
     */
    public readonly minimumValue: T;

    /**
     * The maximum allowed value that the argument could have had.
     */
    public readonly maximumValue: T;

    /**
     * Create a new instance.
     *
     * @param actualValue - The actual value of the argument.
     * @param minimumValue - The minimum allowed value that the argument could
     * have had.
     * @param maximumValue - The maximum allowed value that the argument could
     * have had.
     * @param argumentName - The name of the argument that was invalid.
     * @param message - A string describing the nature of the error.
     * @param inner - The error which caused the new instance to be created.
     */
    public constructor(
        actualValue: T,
        minimumValue: T,
        maximumValue: T,
        argumentName: string,
        message?: string,
        inner?: Error
    ) {
        super(
            argumentName,
            message ??
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                `Invalid argument "${argumentName}" (value "${actualValue}" is outside the allowed range of "${minimumValue}" to "${maximumValue}")`,
            inner
        );
        this.actualValue = actualValue;
        this.minimumValue = minimumValue;
        this.maximumValue = maximumValue;
    }
}
