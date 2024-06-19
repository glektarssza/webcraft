//-- Project Code
import type {Cloneable, Inspector, Mapper, Predicate} from './types';

/**
 * An object which wraps a value that can be something or nothing.
 *
 * @typeParam T - The type of value wrapped by the object.
 */
export class Optional<T> implements Cloneable<Optional<T>> {
    /**
     * Create a new instance that wraps some or no value.
     *
     * @param value - The value to wrap in the new instance or `null` to wrap no
     * value.
     *
     * @returns The new instance.
     */
    public static from<T>(value: T | null): Optional<T> {
        return new Optional<T>(value);
    }

    /**
     * Create a new instance that wraps some value.
     *
     * @param value - The value to wrap in the new instance.
     *
     * @returns The new instance.
     */
    public static fromSome<T>(value: T): Optional<T> {
        return Optional.from<T>(value);
    }

    /**
     * Create a new instance that wraps no value.
     *
     * @returns The new instance.
     */
    public static fromNone<T>(): Optional<T> {
        return Optional.from<T>(null);
    }

    /**
     * The value wrapped by this instance.
     */
    private _value: T | null;

    /**
     * Create a new instance.
     *
     * @param value - The value to wrap in the new instance or `null` to wrap no
     * value.
     */
    private constructor(value: T | null) {
        this._value = value;
    }

    /**
     * Clone this instance.
     *
     * @returns A clone of this instance.
     */
    public clone(): Optional<T> {
        return Optional.from<T>(this._value);
    }

    /**
     * Check whether this instance wraps no value.
     *
     * @returns `true` if this instance wraps no value; `false` otherwise.
     */
    public isNone(): boolean {
        return this._value === null;
    }

    /**
     * Check whether this instance wraps some value.
     *
     * @returns `true` if this instance wraps some value; `false` otherwise.
     */
    public isSome(): boolean {
        return this._value !== null;
    }

    /**
     * Check whether this instance wraps some value and that value satisfies the
     * given predicate.
     *
     * The predicate is only called if this instance wraps some value.
     *
     * @param predicate - The function to us to check the value.
     *
     * @returns `true` if this instance wraps some value and that value
     * satisfies the given predicate; `false` otherwise.
     */
    public isSomeAnd(predicate: Predicate<T>): boolean {
        return this.isSome() && predicate(this._value!);
    }

    /**
     * Inspect the value wrapped in this instance.
     *
     * If this instance wraps no value the function is not called.
     *
     * @param inspector - The function to call to inspect the value wrapped in
     * this instance.
     *
     * @returns This instance.
     */
    public inspect(inspector: Inspector<T>): this {
        if (this.isSome()) {
            inspector(this._value!);
        }
        return this;
    }

    /**
     * Check if this instance wraps some value and return an other instance if
     * so.
     *
     * @typeParam U - The type value that the returned instance will wrap.
     *
     * @param other - The other instance to return if this instance wraps some
     * value.
     *
     * @returns The other instance if this instance wraps some value; a new
     * instance that wraps no value otherwise.
     */
    public and<U>(other: Optional<U>): Optional<U> {
        return this.isSome() ? other : Optional.fromNone<U>();
    }

    /**
     * Check if this instance wraps some value and return the result of calling
     * a function if so.
     *
     * @typeParam U - The type value that the returned instance will wrap.
     *
     * @param otherFn - The function to call to get the instance to return if
     * this instance wraps some value.
     *
     * @returns The result of calling the given function if this instance wraps
     * some value; a new instance that wraps no value otherwise.
     */
    public andThen<U>(otherFn: Mapper<T, Optional<U>>): Optional<U> {
        return this.isSome() ? otherFn(this._value!) : Optional.fromNone<U>();
    }

    /**
     * Check if this instance wraps no value and return an other instance if
     * so.
     *
     * @param other - The other instance to return if this instance wraps no
     * value.
     *
     * @returns The other instance if this instance wraps no value; a new
     * instance that wraps no value otherwise.
     */
    public or(other: Optional<T>): Optional<T> {
        return this.isNone() ? other : Optional.fromSome<T>(this._value!);
    }

    /**
     * Check if this instance wraps no value and return the result of calling a
     * function if so.
     *
     * @param otherFn - The function to call to get the instance to return if
     * this instance wraps no value.
     *
     * @returns The result of calling the given function if this instance wraps
     * no value; a new instance that wraps no value otherwise.
     */
    public orElse(otherFn: () => Optional<T>): Optional<T> {
        return this.isNone() ? otherFn() : Optional.fromSome<T>(this._value!);
    }

    /**
     * Map the value wrapped in this instance, if it wraps some value, to
     * another type.
     *
     * @typeParam U - The type to map the type wrapped by this instance into.
     *
     * @param mapFn - The function to call to map the value wrapped in this
     * instance, if it wraps some value.
     *
     * @returns A new instance wrapping the mapped value if this instance wraps
     * some value; a new instance wrapping no value otherwise.
     */
    public map<U>(mapFn: Mapper<T, U>): Optional<U> {
        return this.isSome()
            ? Optional.fromSome<U>(mapFn(this._value!))
            : Optional.fromNone();
    }

    /**
     * Map the value wrapped in this instance, if it wraps some value, to
     * another type or get a default value.
     *
     * @typeParam U - The type to map the type wrapped by this instance into.
     *
     * @param defaultValue - The default value to return if this instance wraps
     * no value.
     * @param mapFn - The function to call to map the value wrapped in this
     * instance, if it wraps some value.
     *
     * @returns The mapped value if this instance wraps some value; the default
     * value otherwise.
     */
    public mapOr<U>(defaultValue: U, mapFn: Mapper<T, U>): U {
        return this.isSome() ? mapFn(this._value!) : defaultValue;
    }

    /**
     * Map the value wrapped in this instance, if it wraps some value, to
     * another type or get a default value by calling a function.
     *
     * @typeParam U - The type to map the type wrapped by this instance into.
     *
     * @param defaultValueFn - The function to call to get the default value to
     * return if this instance wraps no value.
     * @param mapFn - The function to call to map the value wrapped in this
     * instance, if it wraps some value.
     *
     * @returns The mapped value if this instance wraps some value; the result
     * of calling the given default value function otherwise.
     */
    public mapOrElse<U>(defaultValueFn: () => U, mapFn: Mapper<T, U>): U {
        return this.isSome() ? mapFn(this._value!) : defaultValueFn();
    }

    /**
     * Take the value wrapped by this instance, leaving no value in its place.
     *
     * @returns A new instance which wraps the value previously wrapped in this
     * instance.
     */
    public take(): Optional<T> {
        let r: Optional<T>;
        if (this.isSome()) {
            r = Optional.fromSome<T>(this._value!);
            this._value = null;
        } else {
            r = Optional.fromNone<T>();
        }
        return r;
    }

    /**
     * Take the value wrapped by this instance, leaving no value in its place,
     * if that value matches the given predicate.
     *
     * @param predicate - The predicate to use to check the value wrapped by
     * this instance, if any.
     *
     * @returns A new instance which wraps the value previously wrapped in this
     * instance if that value matches the given predicate
     */
    public takeIf(predicate: Predicate<T>): Optional<T> {
        let r: Optional<T>;
        if (this.isSomeAnd(predicate)) {
            r = Optional.fromSome<T>(this._value!);
            this._value = null;
        } else {
            r = Optional.fromNone<T>();
        }
        return r;
    }

    /**
     * Insert a value into this instance, dropping any previously wrapped value.
     *
     * @param value - The value to insert.
     */
    public insert(value: T): void {
        this._value = value;
    }

    /**
     * Get the value wrapped by this instance.
     *
     * @returns The value wrapped by this instance.
     *
     * @throws `Error`
     * Thrown if this instance does not wrap some value.
     */
    public unwrap(): T {
        if (this.isNone()) {
            throw new Error('Optional does not wrap some value');
        }
        return this._value!;
    }

    /**
     * Get the value wrapped by this instance or a given default value.
     *
     * @param defaultValue - The value to return if this instance does not wrap
     * some value.
     *
     * @returns The value wrapped by this instance if it wraps some value; the
     * given default value otherwise.
     */
    public unwrapOr(defaultValue: T): T {
        if (this.isNone()) {
            return defaultValue;
        }
        return this._value!;
    }

    /**
     * Get the value wrapped by this instance or the result of calling the given
     * default value function.
     *
     * @param defaultValueFn - The function to call to get the value to return
     * if this instance does not wrap some value.
     *
     * @returns The value wrapped by this instance if it wraps some value; the
     * result of calling the given default value function otherwise.
     */
    public unwrapOrElse(defaultValueFn: () => T): T {
        if (this.isNone()) {
            return defaultValueFn();
        }
        return this._value!;
    }
}

/**
 * A module which provides an optional value class.
 */
const m = {};

/**
 * Get the internal module for use in unit tests.
 *
 * @returns The internal module.
 */
export function getInternalModule(): typeof m {
    return m;
}

/* eslint-disable no-empty-pattern */
export const {} = m;
/* eslint-enable no-empty-pattern */
