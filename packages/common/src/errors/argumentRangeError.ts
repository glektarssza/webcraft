import {ArgumentError} from './argumentError';

/**
 * An interface for objects that can be converted to a string.
 */
export interface CanBeStringified {
    /**
     * Convert the object to a string.
     */
    toString(): string;
}

/**
 * An error thrown when an argument is outside of the allowed range.
 *
 * @typeparam T - The type of the argument that was outside of the allowed
 * range.
 */
export class ArgumentRangeError<
    T extends CanBeStringified
> extends ArgumentError {
    /**
     * The actual value of the argument.
     */
    public readonly actualValue: T;

    /**
     * The minimum allowed value of the argument.
     */
    public readonly minimumValue: T;

    /**
     * The maximum allowed value of the argument.
     */
    public readonly maximumValue: T;

    /**
     * Create a new instance.
     *
     * @param argumentName - The name of the argument that was outside of the
     * allowed range.
     * @param message - A string describing the nature of the error.
     * @param inner - The inner error that caused the new instance to be
     * created.
     */
    public constructor(
        argumentName: string,
        actualValue: T,
        minimumValue: T,
        maximumValue: T,
        message?: string,
        inner?: Error
    ) {
        super(
            argumentName,
            message ??
                `Invalid argument "${argumentName}" (value "${actualValue.toString()}" is outside of the allowed range of "${minimumValue.toString()}" to "${maximumValue.toString()}")`,
            inner
        );
        this.actualValue = actualValue;
        this.minimumValue = minimumValue;
        this.maximumValue = maximumValue;
        this.name = 'ArgumentRangeError';
    }
}
