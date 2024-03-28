//-- Project Code
import {ArgumentError} from './argumentError';

/**
 * An error that is produced when an argument is outside of the allowed range of
 * values.
 *
 * @typeParam T - The type of the argument.
 */
export class ArgumentRangeError<T> extends ArgumentError {
    /**
     * The actual value of the argument.
     */
    public readonly actualValue: T;

    /**
     * The minimum allowed value of the argument.
     */
    public readonly minimumValue: T | null;

    /**
     * The maximum allowed value of the argument.
     */
    public readonly maximumValue: T | null;

    /**
     * Create a new instance.
     *
     * @param actualValue - The actual value of the argument.
     * @param minimumValue - The minimum allowed value of the argument.
     * @param maximumValue - The maximum allowed value of the argument.
     * @param argumentName - The name of the argument that was invalid.
     * @param message - The message describing what went wrong.
     * @param inner - The error that caused the new instance to be created.
     */
    public constructor(
        actualValue: T,
        minimumValue: T | null,
        maximumValue: T | null,
        argumentName: string,
        message?: string,
        inner?: Error
    ) {
        super(
            argumentName,
            message ??
                `Invalid argument "${argumentName}" (value "${actualValue}" outside allowed range of "${minimumValue}" to "${maximumValue}")`,
            inner
        );
        this.actualValue = actualValue;
        this.minimumValue = minimumValue;
        this.maximumValue = maximumValue;
    }
}
