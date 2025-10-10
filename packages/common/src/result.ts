/**
 * A Rust-like result object implementation.
 *
 * @module
 */

//-- Project Code
import {type Cloneable} from './types/cloneable';
import {
    type Mapper,
    type Predicate,
    type UnaryFunction
} from './types/functions';

/**
 * A simple class wrapping around the result of an operation.
 *
 * @typeParam S - The type of the success value.
 * @typeParam E - The type of the error value.
 */
export class Result<S, E> implements Cloneable {
    /**
     * Create a new instance holding a success value.
     *
     * @param value - The value to place into the new instance as the success
     * value.
     *
     * @returns The new instance.
     */
    public static ok<S, E>(this: void, value: S): Result<S, E> {
        const r = new Result<S, E>();
        r._holdsSuccess = true;
        r._successValue = value;
        return r;
    }

    /**
     * Create a new instance holding an error value.
     *
     * @param value - The value to place into the new instance as the error
     * value.
     *
     * @returns The new instance.
     */
    public static error<S, E>(this: void, value: E): Result<S, E> {
        const r = new Result<S, E>();
        r._holdsError = true;
        r._errorValue = value;
        return r;
    }

    /**
     * Whether this instance holds a success value.
     */
    private _holdsSuccess: boolean;

    /**
     * Whether this instance holds an error value.
     */
    private _holdsError: boolean;

    /**
     * The success value held in this instance.
     */
    private _successValue?: S;

    /**
     * The error value held in this instance.
     */
    private _errorValue?: E;

    /**
     * Create a new instance.
     *
     * @param successValue - The success value to populate the new instance
     * with.
     * @param errorValue - The error value to populate the new instance with.
     */
    private constructor() {
        this._holdsSuccess = false;
        this._holdsError = false;
    }

    /**
     * @inheritdoc
     */
    public clone(): Result<S, E> {
        const cloned = new Result<S, E>();
        cloned._holdsSuccess = this._holdsSuccess;
        cloned._holdsError = this._holdsError;
        cloned._successValue = this._successValue;
        cloned._errorValue = this._errorValue;
        return cloned;
    }

    /**
     * Get whether this instance holds a success value.
     *
     * @returns `true` if this instance holds a success value; `false`
     * otherwise.
     */
    public isOk(): boolean {
        return this._holdsSuccess;
    }

    /**
     * Get whether this instance holds a success value and that value matches
     * the given predicate.
     *
     * @returns `true` if this instance holds a success value and that value
     * matches the given predicate; `false` otherwise.
     */
    public isOkAnd(predicate: Predicate<S>): boolean {
        return this.isOk() && predicate(this._successValue!);
    }

    /**
     * Get whether this instance holds an error value.
     *
     * @returns `true` if this instance holds an error value; `false`
     * otherwise.
     */
    public isError(): boolean {
        return this._holdsError;
    }

    /**
     * Get whether this instance holds an error value and that value matches
     * the given predicate.
     *
     * @returns `true` if this instance holds an error value and that value
     * matches the given predicate; `false` otherwise.
     */
    public isErrorAnd(predicate: Predicate<E>): boolean {
        return this.isError() && predicate(this._errorValue!);
    }

    /**
     * Get the other result object if this instance holds a success value,
     * otherwise get a new result object containing the error value inside this
     * instance.
     *
     * @param other - The other result instance to return if this instance holds
     * a success value.
     *
     * @returns The given result object if this instance holds a success value;
     * a new result object holding the error value inside this instance
     * otherwise.
     */
    public and<U>(other: Result<U, E>): Result<U, E> {
        return this.isOk() ? other : Result.error<U, E>(this._errorValue!);
    }

    /**
     * Get the result of calling the given function if this instance holds a
     * success value, otherwise get a new result object containing the error
     * value inside this instance.
     *
     * @param otherFn - The function to call to get the other result instance to
     * return if this instance holds a success value.
     *
     * @returns The result of calling the given function if this instance holds
     * a success value; a new result object holding the error value inside this
     * instance otherwise.
     */
    public andThen<U>(otherFn: Mapper<S, Result<U, E>>): Result<U, E> {
        return this.map(otherFn);
    }

    /**
     * Get the other result object if this instance holds an error value,
     * otherwise get a new result object containing the success value inside
     * this instance.
     *
     * @param other - The other result instance to return if this instance holds
     * an error value.
     *
     * @returns The given result object if this instance holds an error value; a
     * new result object holding the success value inside this instance
     * otherwise.
     */
    public or<U>(other: Result<S, U>): Result<S, U> {
        return this.isError() ? other : Result.ok<S, U>(this._successValue!);
    }

    /**
     * Get the result of calling the given function if this instance holds an
     * error value, otherwise get a new result object containing the success
     * value inside this instance.
     *
     * @param otherFn - The function to call to get the other result instance to
     * return if this instance holds an error value.
     *
     * @returns The result of calling the given function if this instance holds
     * an error value; a new result object holding the success value inside this
     * instance otherwise.
     */
    public orElse<U>(otherFn: Mapper<E, Result<S, U>>): Result<S, U> {
        return this.mapError(otherFn);
    }

    /**
     * Get the result of calling the given function if this instance holds a
     * success value, otherwise get a new result object containing the error
     * value inside this instance.
     *
     * @param otherFn - The function to call to get the other result instance to
     * return if this instance holds a success value.
     *
     * @returns The result of calling the given function if this instance holds
     * a success value; a new result object holding the error value inside this
     * instance otherwise.
     */
    public map<U>(mapper: Mapper<S, Result<U, E>>): Result<U, E> {
        return this.isOk() ?
                mapper(this._successValue!)
            :   Result.error<U, E>(this._errorValue!);
    }

    /**
     * Use the provided unary function to map the success value held in this
     * instance into another value type or return the given default value if
     * there is no success value held in this instance.
     *
     * @param mapper - The mapper function to use to map the success value held
     * in this instance, if one is present, into the return value type.
     * @param defaultValue - The default value to return if there is no success
     * value held in this instance.
     *
     * @returns The result of calling the unary function if there is a success
     * value held in this instance; the provided default value otherwise.
     */
    public mapOr<U>(mapper: Mapper<S, U>, defaultValue: U): U {
        return this.isOk() ? mapper(this._successValue!) : defaultValue;
    }

    /**
     * Use the provided unary function to map the success value held in this
     * instance into another value type or return the result of calling the
     * provided unary function with the error value held in this instance if
     * there is no success value held in this instance.
     *
     * @param mapper - The mapper function to use to map the success value held
     * in this instance, if one is present, into the return value type.
     * @param defaultValueFn - The mapper function to use to map the error value
     * held in this instance if there is no success value held in this instance.
     *
     * @returns The result of calling the appropriate unary function based on
     * the value held in this instance.
     */
    public mapOrElse<U>(mapper: Mapper<S, U>, defaultValueFn: Mapper<E, U>): U {
        return this.isOk() ?
                mapper(this._successValue!)
            :   defaultValueFn(this._errorValue!);
    }

    /**
     * Get the result of calling the given function if this instance holds an
     * error value, otherwise get a new result object containing the success
     * value inside this instance.
     *
     * @param otherFn - The function to call to get the other result instance to
     * return if this instance holds an error value.
     *
     * @returns The result of calling the given function if this instance holds
     * an error value; a new result object holding the success value inside this
     * instance otherwise.
     */
    public mapError<U>(mapper: Mapper<E, Result<S, U>>): Result<S, U> {
        return this.isError() ?
                mapper(this._errorValue!)
            :   Result.ok<S, U>(this._successValue!);
    }

    /**
     * Inspect the success value held in this instance, if one is present.
     *
     * @param fn - The function to call with the success value held in this
     * instance, if one is present. If no success value is present this function
     * will not be called.
     *
     * @returns This instance.
     */
    public inspectOk(fn: UnaryFunction<S>): this {
        if (this.isOk()) {
            fn(this._successValue!);
        }
        return this;
    }

    /**
     * Inspect the error value held in this instance, if one is present.
     *
     * @param fn - The function to call with the error value held in this
     * instance, if one is present. If no error value is present this function
     * will not be called.
     *
     * @returns This instance.
     */
    public inspectError(fn: UnaryFunction<E>): this {
        if (this.isError()) {
            fn(this._errorValue!);
        }
        return this;
    }
}
