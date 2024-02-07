//-- Project Code
import {Cloneable} from './cloneable';
import {Mapper, Predicate} from './functional';
import {Optional} from './optional';

/**
 * A class that represents the result of an operation.
 *
 * @typeParam T - The type of value that might be contained in the instance.
 */
export class Result<T, E> implements Cloneable<Result<T, E>> {
    /**
     * Create a new instance from the given success value.
     *
     * @param value - The success value to create the new instance with.
     *
     * @returns A new instance containing the given success value.
     */
    public static fromSuccess<T, E>(value: T): Result<T, E> {
        const r = new Result<T, E>();
        r._value = value;
        return r;
    }

    /**
     * Create a new instance from the given error value.
     *
     * @param error - The error value to create the new instance with.
     *
     * @returns A new instance containing the given error value.
     */
    public static fromError<T, E>(error: E): Result<T, E> {
        const r = new Result<T, E>();
        r._error = error;
        return r;
    }

    /**
     * The value contained in this instance.
     */
    private _value: T | null;

    /**
     * The error value contained in this instance.
     */
    private _error: E | null;

    /**
     * Whether this instance contains an error value.
     */
    public get isError(): boolean {
        return this._error !== null;
    }

    /**
     * Whether this instance contains a success value.
     */
    public get isSuccess(): boolean {
        return this._value !== null;
    }

    /**
     * Create a new instance.
     */
    private constructor() {
        this._value = null;
        this._error = null;
    }

    /**
     * Get the given {@link Result} if this instance contains a success value.
     *
     * @param res - The {@link Result} to return if this instance contains an
     * error value.
     *
     * @returns The given {@link Result} if this instance contains a success
     * value; a new {@link Result} containing the error value contained in this
     * instance otherwise.
     */
    public and<U>(res: Result<U, E>): Result<U, E> {
        if (this.isError) {
            return Result.fromError<U, E>(this._error!);
        }
        return Result.fromSuccess<U, E>(res._value!);
    }

    /**
     * Get the result of calling the given function if this instance contains a
     * success value.
     *
     * @param resFunc - The function to return the result of calling if this
     * instance contains a success value.
     *
     * @returns The result of calling the given function if this instance
     * contains a success value; a new {@link Result} containing the error value
     * contained in this instance otherwise.
     */
    public andThen<U>(resFunc: (value: T) => Result<U, E>): Result<U, E> {
        if (this.isError) {
            return Result.fromError<U, E>(this._error!);
        }
        return resFunc(this._value!);
    }

    /**
     * Clone this instance.
     *
     * @returns A clone of this instance.
     */
    public clone(): Result<T, E> {
        const r = new Result<T, E>();
        r._value = this._value;
        r._error = this._error;
        return r;
    }

    /**
     * Get the error value contained in this instance as an {@link Optional}.
     *
     * @returns An {@link Optional} that wraps the error value contained in
     * this instance if it contains an error value; an empty {@link Optional}
     * otherwise.
     */
    public err(): Optional<E> {
        return Optional.fromNullable<E>(this._error);
    }

    /**
     * Expect this instance to contain a success value.
     *
     * @param message - The message to throw an {@link Error} with if this
     * instance contains an error value.
     *
     * @returns The success value contained in this instance.
     *
     * @throws `Error`
     * Thrown if this instance contains an error value.
     */
    public expect(message?: string): T {
        if (this.isError) {
            throw new Error(message);
        }
        return this._value!;
    }

    /**
     * Expect this instance to contain an error value.
     *
     * @param message - The message to throw an {@link Error} with if this
     * instance contains a success value.
     *
     * @returns The error value contained in this instance.
     *
     * @throws `Error`
     * Thrown if this instance contains a success value.
     */
    public expectErr(message?: string): E {
        if (this.isSuccess) {
            throw new Error(message);
        }
        return this._error!;
    }

    /**
     * Flatten this instance if it contains a nested {@link Result} as its
     * success value.
     *
     * @returns The {@link Result} nested in this instance if it contains a
     * success value; a new {@link Result} containing the error value contained
     * in this instance otherwise.
     *
     * @throws `Error`
     * Thrown if this instance contains a success value and that value is not a
     * {@link Result}.
     */
    public flatten(this: Result<Result<T, E>, E>): Result<T, E> {
        if (this.isError) {
            return Result.fromError<T, E>(this._error!);
        }
        if (this._value instanceof Result) {
            if (this._value.isError) {
                return Result.fromError<T, E>(this._value._error!);
            }
            return Result.fromSuccess<T, E>(this._value._value!);
        }
        throw new Error(
            'Cannot flatten Result::Success (success value is not a Result)'
        );
    }

    /**
     * Call the given function if this instance contains a success value.
     *
     * @param inspector - The function to call if this instance contains a
     * success value.
     *
     * @returns This instance.
     */
    public inspect(inspector: (value: T) => unknown): this {
        if (this.isSuccess) {
            inspector(this._value!);
        }
        return this;
    }

    /**
     * Call the given function if this instance contains a success value.
     *
     * @param inspector - The function to call if this instance contains a
     * success value.
     *
     * @returns This instance.
     */
    public inspectErr(inspector: (error: E) => unknown): this {
        if (this.isError) {
            inspector(this._error!);
        }
        return this;
    }

    /**
     * Check if this instance contains an error value and that value satisfies
     * the given predicate.
     *
     * @param predicate - The predicate to check the error value against if this
     * instance contains an error value.
     *
     * @returns `true` if this instance contains an error value and that value
     * satisfies the predicate; `false` otherwise.
     */
    public isErrAnd(predicate: Predicate<E>): boolean {
        if (this.isSuccess) {
            return false;
        }
        return predicate(this._error!);
    }

    /**
     * Check if this instance contains a success value and that value satisfies
     * the given predicate.
     *
     * @param predicate - The predicate to check the success value against if
     * this instance contains a success value.
     *
     * @returns `true` if this instance contains a success value and that value
     * satisfies the predicate; `false` otherwise.
     */
    public isSuccessAnd(predicate: Predicate<T>): boolean {
        if (this.isError) {
            return false;
        }
        return predicate(this._value!);
    }

    /**
     * Map the success value contained in this instance into another type of
     * value if it contains a success value.
     *
     * @typeParam U - The type to map the success value into.
     *
     * @param mapperFunc - The function to use to map the success value contained in
     * this instance.
     *
     * @returns A new {@link Result} containing the mapped success value if this
     * instance contains a success value; a new {@link Result} containing the
     * error value contained in this instance otherwise.
     */
    public map<U>(mapperFunc: Mapper<T, U>): Result<U, E> {
        if (this.isError) {
            return Result.fromError<U, E>(this._error!);
        }
        return Result.fromSuccess<U, E>(mapperFunc(this._value!));
    }

    /**
     * Map the success value contained in this instance into another type of
     * value if it contains a success value.
     *
     * @typeParam U - The type to map the success value into.
     *
     * @param defaultValue - The value to return if this instance contains an
     * error value.
     * @param mapperFunc - The function to use to map the success value
     * contained in this instance.
     *
     * @returns The mapped success value if this instance contains a success
     * value; the given default value otherwise.
     */
    public mapOr<U>(defaultValue: U, mapperFunc: Mapper<T, U>): U {
        if (this.isError) {
            return defaultValue;
        }
        return mapperFunc(this._value!);
    }

    /**
     * Map the success value contained in this instance into another type of
     * value if it contains a success value.
     *
     * @typeParam U - The type to map the success value into.
     *
     * @param defaultValueFunc - The function to return the result of if this
     * instance contains an error value.
     * @param mapperFunc - The function to use to map the success value
     * contained in this instance.
     *
     * @returns The mapped success value if this instance contains a success
     * value; the result of calling the given default value function otherwise.
     */
    public mapOrElse<U>(
        defaultValueFunc: (error: E) => U,
        mapperFunc: Mapper<T, U>
    ): U {
        if (this.isError) {
            return defaultValueFunc(this._error!);
        }
        return mapperFunc(this._value!);
    }

    /**
     * Get the success value contained in this instance as an {@link Optional}.
     *
     * @returns An {@link Optional} that wraps the success value contained in
     * this instance if it contains a success value; an empty {@link Optional}
     * otherwise.
     */
    public success(): Optional<T> {
        return Optional.fromNullable<T>(this._value);
    }

    /**
     * Get the given {@link Result} if this instance contains an error value.
     *
     * @param res - The {@link Result} to return if this instance contains an
     * error value.
     *
     * @returns The given {@link Result} if this instance contains an error
     * value; a new {@link Result} containing the success value contained in
     * this instance otherwise.
     */
    public or<F>(res: Result<T, F>): Result<T, F> {
        if (this.isError) {
            return Result.fromError<T, F>(res._error!);
        }
        return Result.fromSuccess<T, F>(this._value!);
    }

    /**
     * Get the result of calling the given function if this instance contains an
     * error value.
     *
     * @param resFunc - The function to return the result of calling if this
     * instance contains an error value.
     *
     * @returns The result of calling the given function if this instance
     * contains an error value; a new {@link Result} containing the success
     * value contained in this instance otherwise.
     */
    public orElse<F>(resFunc: (error: E) => Result<T, F>): Result<T, F> {
        if (this.isError) {
            return resFunc(this._error!);
        }
        return Result.fromSuccess<T, F>(this._value!);
    }

    // TODO: Transpose

    /**
     * Unwrap the success value contained in this instance.
     *
     * @returns The success value contained in this instance.
     *
     * @throws `Error`
     * Thrown if this instance contains an error value.
     */
    public unwrap(): T {
        if (this.isError) {
            throw new Error('Cannot unwrap Result::Error');
        }
        return this._value!;
    }

    /**
     * Unwrap the error value contained in this instance.
     *
     * @returns The error value contained in this instance.
     *
     * @throws `Error`
     * Thrown if this instance contains a success value.
     */
    public unwrapErr(): E {
        if (this.isError) {
            return this._error!;
        }
        throw new Error('Cannot unwrapErr Result::Success');
    }

    /**
     * Unwrap the error value contained in this instance.
     *
     * The value may be `null`.
     *
     * @returns The error value contained in this instance.
     */
    public unwrapErrUnchecked(): E {
        return this._error!;
    }

    /**
     * Unwrap the success value contained in this instance or return the given
     * default value.
     *
     * @param defaultValue - The default value to return if this instance
     * contains a success value.
     *
     * @returns The success value contained in this instance if it contains a
     * success value; the given default value otherwise.
     */
    public unwrapOr(defaultValue: T): T {
        if (this.isError) {
            return defaultValue;
        }
        return this._value!;
    }

    /**
     * Unwrap the success value contained in this instance or return the result
     * of calling the given default value function.
     *
     * @param defaultValueFunc - The default value function to return the result
     * of calling if this instance contains an error value.
     *
     * @returns The success value contained in this instance if it contains a
     * success value; the result of calling the given default value function
     * otherwise.
     */
    public unwrapOrElse(defaultValueFunc: (error: E) => T): T {
        if (this.isError) {
            return defaultValueFunc(this._error!);
        }
        return this._value!;
    }

    /**
     * Unwrap the success value contained in this instance.
     *
     * The value may be `null`.
     *
     * @returns The success value contained in this instance.
     */
    public unwrapUnchecked(): T {
        return this._value!;
    }
}
