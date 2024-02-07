//-- Project Code
import {Cloneable} from './cloneable';
import {Mapper, Predicate, Zipper} from './functional';

/**
 * A class that represents an optional value.
 *
 * @typeParam T - The type of value that might be contained in the instance.
 */
export class Optional<T> implements Cloneable<Optional<T>> {
    /**
     * Create a new instance from the given value.
     *
     * @typeParam T - The type of value that might be contained in the instance.
     *
     * @param value - The value to place into the new instance.
     *
     * @returns A new instance.
     */
    public static fromValue<T>(value: T): Optional<T> {
        return Optional.fromNullable<T>(value);
    }

    /**
     * Create a new instance from the given nullable value.
     *
     * @typeParam T - The type of value that might be contained in the instance.
     *
     * @param value - The value to place into the new instance.
     *
     * @returns A new instance.
     */
    public static fromNullable<T>(value: T | null): Optional<T> {
        const r = new Optional<T>();
        r._value = value;
        return r;
    }

    /**
     * Create a new instance with no value.
     *
     * @typeParam T - The type of value that might be contained in the instance.
     *
     * @returns A new instance.
     */
    public static empty<T>(): Optional<T> {
        return Optional.fromNullable<T>(null);
    }

    /**
     * The value contained in this instance of `null` if it holds no value.
     */
    private _value: T | null;

    /**
     * Whether this instance contains no value.
     */
    public get isEmpty(): boolean {
        return this._value === null;
    }

    /**
     * Whether this instance contains some value.
     */
    public get isSome(): boolean {
        return this._value !== null;
    }

    /**
     * Create a new instance.
     */
    private constructor() {
        this._value = null;
    }

    /**
     * Get an {@link Optional} containing the value contained in the given
     * {@link Optional} if this instance contains some value.
     *
     * @param optb - The {@link Optional} to return the value of if this
     * instance contains some value.
     *
     * @returns A new {@link Optional} containing the value contained in the
     * given {@link Optional} if this instance contains some value; a new
     * {@link Optional} containing no value otherwise.
     */
    public and(optb: Optional<T>): Optional<T> {
        if (this.isEmpty) {
            return Optional.empty<T>();
        }
        return Optional.fromNullable<T>(optb._value);
    }

    /**
     * Get an {@link Optional} containing the value from the result of calling
     * the given function if this instance contains some value.
     *
     * @param optbFunc - The function to call to get the {@link Optional} to
     * return the value of (wrapped in a new {@link Optional}) if this instance
     * contains some value.
     *
     * @returns The result of calling the given function if this instance
     * contains some value; a new {@link Optional} containing no value
     * otherwise.
     */
    public andThen(optbFunc: (value: T) => Optional<T>): Optional<T> {
        if (this.isEmpty) {
            return Optional.empty<T>();
        }
        return optbFunc(this._value!);
    }

    /**
     * Clone this instance.
     *
     * @returns A clone of this instance.
     */
    public clone(): Optional<T> {
        const r = new Optional<T>();
        r._value = this._value;
        return r;
    }

    /**
     * Expect this instance to contain some value.
     *
     * @param message - The message to throw an {@link Error} with if this
     * instance contains no value.
     *
     * @returns The value contained in this instance.
     *
     * @throws `Error`
     * Thrown if this instance contains no value.
     */
    public expect(message?: string): T {
        if (this.isEmpty) {
            throw new Error(message);
        }
        return this._value!;
    }

    /**
     * Filter this instance with the given predicate if it contains some value.
     *
     * @param predicate - The predicate to use to filter this instance if it
     * contains some value.
     *
     * @returns A new {@link Optional} containing the value contained in this
     * instance if it contains some value and that value satisfies the
     * predicate; a new {@link Optional} containing no value otherwise.
     */
    public filter(predicate: Predicate<T>): Optional<T> {
        if (this.isEmpty) {
            return Optional.empty<T>();
        }
        if (predicate(this._value!)) {
            return Optional.fromValue<T>(this._value!);
        }
        return Optional.empty<T>();
    }

    /**
     * Flatten this instance if it contains a nested {@link Optional} as its
     * value.
     *
     * @returns The {@link Optional} nested in this instance if it contains some
     * value; a new {@link Optional} containing no value otherwise.
     *
     * @throws `Error`
     * Thrown if this instance contains some value and that value is not an
     * {@link Optional}.
     */
    public flatten(this: Optional<Optional<T>>): Optional<T> {
        if (this.isEmpty) {
            return Optional.empty<T>();
        }
        if (this._value instanceof Optional) {
            return Optional.fromNullable<T>(this._value._value);
        }
        throw new Error(
            'Cannot flatten Optional::Some (value is not an Optional)'
        );
    }

    /**
     * Get the value contained in this instance or the given value if this
     * instance contains no value.
     *
     * If this instance contains no value the given value will be inserted into
     * this instance.
     *
     * @param value - The value to return if this instance contains no value.
     *
     * @returns The value contained in this instance if it holds some value; the
     * given value otherwise.
     */
    public getOrInsert(value: T): T {
        if (this.isEmpty) {
            this._value = value;
        }
        return this._value!;
    }

    /**
     * Get the value contained in this instance or the result of calling the
     * given function if this instance contains no value.
     *
     * If this instance contains no value the result of calling the given
     * function will be inserted into this instance.
     *
     * @param valueFunc - The function to call to get the value to return if
     * this instance contains no value.
     *
     * @returns The value contained in this instance if it contains some value;
     * the result of calling the given function otherwise.
     */
    public getOrInsertWith(valueFunc: () => T): T {
        if (this.isEmpty) {
            this._value = valueFunc();
        }
        return this._value!;
    }

    /**
     * Insert a value into this instance.
     *
     * @param value - The value to insert into this instance.
     *
     * @returns The value inserted into this instance.
     */
    public insert(value: T): T {
        this._value = value;
        return this._value;
    }

    /**
     * Call the given function if this instance contains some value.
     *
     * @param inspector - The function to call if this instance contains some
     * value.
     *
     * @returns This instance.
     */
    public inspect(inspector: (value: T) => unknown): this {
        if (this.isSome) {
            inspector(this._value!);
        }
        return this;
    }

    /**
     * Check if this instance contains some value and that value satisfies the
     * given predicate.
     *
     * @param predicate - The predicate to check the value against if this
     * instance contains some value.
     *
     * @returns `true` if this instance contains some value and that value
     * satisfies the predicate; `false` otherwise.
     */
    public isSomeAnd(predicate: Predicate<T>): boolean {
        if (this.isEmpty) {
            return false;
        }
        return predicate(this._value!);
    }

    /**
     * Map the value contained in this instance into another type of value if it
     * contains some value.
     *
     * @typeParam U - The type to map the value into.
     *
     * @param mapperFunc - The function to use to map the value contained in
     * this instance.
     *
     * @returns A new {@link Optional} containing the mapped value if this
     * instance contains some value; a new {@link Optional} containing no value
     * otherwise.
     */
    public map<U>(mapperFunc: Mapper<T, U>): Optional<U> {
        if (this.isEmpty) {
            return Optional.empty<U>();
        }
        return Optional.fromValue<U>(mapperFunc(this._value!));
    }

    /**
     * Map the value contained in this instance into another type of value if it
     * contains some value.
     *
     * @typeParam U - The type to map the value into.
     *
     * @param defaultValue - The value to return if this instance contains no
     * value.
     * @param mapperFunc - The function to use to map the value contained in
     * this instance.
     *
     * @returns The mapped value if this instance contains some value; the given
     * default value otherwise.
     */
    public mapOr<U>(defaultValue: U, mapperFunc: Mapper<T, U>): U {
        if (this.isEmpty) {
            return defaultValue;
        }
        return mapperFunc(this._value!);
    }

    /**
     * Map the value contained in this instance into another type of value if it
     * contains some value.
     *
     * @typeParam U - The type to map the value into.
     *
     * @param defaultValueFunc - The function to return the result of if this
     * instance contains no value.
     * @param mapperFunc - The function to use to map the value contained in
     * this instance.
     *
     * @returns The mapped value if this instance contains some value; the
     * result of calling the given default value function otherwise.
     */
    public mapOrElse<U>(
        defaultValueFunc: () => U,
        mapperFunc: Mapper<T, U>
    ): U {
        if (this.isEmpty) {
            return defaultValueFunc();
        }
        return mapperFunc(this._value!);
    }

    // TODO: okOr
    // TODO: okOrElse

    /**
     * Get an {@link Optional} containing the value contained in the given
     * {@link Optional} if this instance contains no value.
     *
     * @param optb - The {@link Optional} to return the value of if this
     * instance contains no value.
     *
     * @returns A new {@link Optional} containing the value contained in the
     * given {@link Optional} if this instance contains no value; a new
     * {@link Optional} containing some value otherwise.
     */
    public or(optb: Optional<T>): Optional<T> {
        if (this.isEmpty) {
            return Optional.fromNullable<T>(optb._value);
        }
        return Optional.fromNullable<T>(this._value);
    }

    /**
     * Get an {@link Optional} containing the value from the result of calling
     * the given function if this instance contains no value.
     *
     * @param optbFunc - The function to call to get the {@link Optional} to
     * return the value of (wrapped in a new {@link Optional}) if this instance
     * contains no value.
     *
     * @returns The result of calling the given function if this instance
     * contains no value; a new {@link Optional} containing no value otherwise.
     */
    public orElse(optbFunc: () => Optional<T>): Optional<T> {
        if (this.isEmpty) {
            return optbFunc();
        }
        return Optional.fromNullable<T>(this._value);
    }

    /**
     * Replace the value contained in this instance.
     *
     * @param value - The value to replace the value contained in this instance
     * with.
     *
     * @returns A new {@link Optional} containing the original value contained
     * in this instance.
     */
    public replace(value: T): Optional<T> {
        const original = Optional.fromNullable<T>(this._value);
        this._value = value;
        return original;
    }

    /**
     * Take the value contained in this instance, leaving no value in its place.
     *
     * @returns A new {@link Optional} containing the value contained in this
     * instance.
     */
    public take(): Optional<T> {
        const r = Optional.fromNullable<T>(this._value);
        this._value = null;
        return r;
    }

    /**
     * Take the value contained in this instance, leaving no value in its place,
     * if the value satisfies the given predicate.
     *
     * @returns A new {@link Optional} containing the value contained in this
     * instance if this instance contained some value and that value satisfied
     * the predicate; a new {@link Optional} containing no value otherwise.
     */
    public takeIf(predicate: Predicate<T>): Optional<T> {
        if (this.isEmpty) {
            return Optional.empty<T>();
        }
        if (!predicate(this._value!)) {
            return Optional.empty<T>();
        }
        const r = Optional.fromNullable<T>(this._value);
        this._value = null;
        return r;
    }

    // TODO: transpose

    /**
     * Unwrap the value contained in this instance.
     *
     * @returns The value contained in this instance.
     *
     * @throws `Error`
     * Thrown if this instance contains no value.
     */
    public unwrap(): T {
        if (this.isEmpty) {
            throw new Error('Cannot unwrap Optional::None');
        }
        return this._value!;
    }

    /**
     * Unwrap the value contained in this instance or return the given default
     * value.
     *
     * @param defaultValue - The default value to return if this instance
     * contains no value.
     *
     * @returns The value contained in this instance if it contains some value;
     * the given default value otherwise.
     */
    public unwrapOr(defaultValue: T): T {
        if (this.isEmpty) {
            return defaultValue;
        }
        return this._value!;
    }

    /**
     * Unwrap the value contained in this instance or return the result of
     * calling the given default value function.
     *
     * @param defaultValueFunc - The default value function to return the result
     * of calling if this instance contains no value.
     *
     * @returns The value contained in this instance if it contains some value;
     * the result of calling the given default value function otherwise.
     */
    public unwrapOrElse(defaultValueFunc: () => T): T {
        if (this.isEmpty) {
            return defaultValueFunc();
        }
        return this._value!;
    }

    /**
     * Unwrap the value contained in this instance.
     *
     * The value may be `null`.
     *
     * @returns The value contained in this instance.
     */
    public unwrapUnchecked(): T {
        return this._value!;
    }

    /**
     * Unzip this instance if it contains a tuple of two values.
     *
     * @returns A tuple of two new {@link Optional} instances which each contain
     * the values held in the {@link Optional} instances contained in this
     * instance.
     *
     * @throws `Error`
     * Thrown if the instance does not contain an array.
     * @throws `Error`
     * Thrown if the value contained in the instance does not have exactly two
     * elements.
     */
    public unzip<T, U>(this: Optional<[T, U]>): [Optional<T>, Optional<U>] {
        if (this.isEmpty) {
            return [Optional.empty<T>(), Optional.empty<U>()];
        }
        if (!Array.isArray(this._value)) {
            throw new Error(
                'Cannot unzip Optional::Some (value is not a tuple)'
            );
        }
        if (this._value.length !== 2) {
            throw new Error(
                'Cannot unzip Optional::Some (value does not contain two elements)'
            );
        }
        return [
            Optional.fromNullable<T>(this._value[0]),
            Optional.fromNullable<U>(this._value[1])
        ];
    }

    /**
     * Get a new {@link Optional} containing some value if one of this instance
     * or the given {@link Optional} contains some value.
     *
     * @param optb - The other {@link Optional} to use in the operation.
     *
     * @returns A new {@link Optional} containing some value if one of this
     * instance or the given {@link Optional} contains some value; a new
     * {@link Optional} containing no value otherwise.
     */
    public xor(optb: Optional<T>): Optional<T> {
        if (this.isEmpty && optb.isEmpty) {
            return Optional.empty<T>();
        }
        if (this.isSome && optb.isSome) {
            return Optional.empty<T>();
        }
        if (this.isSome) {
            return Optional.fromNullable<T>(this._value);
        }
        return Optional.fromNullable<T>(optb._value);
    }

    /**
     * Zip another {@link Optional} together with this instance is both contain
     * some value.
     *
     * @param other - The other {@link Optional} to zip into this instance.
     *
     * @returns A new {@link Optional} containing a tuple with the values from
     * this instance and the given {@link Optional} if both contain some value;
     * a new {@link Optional} containing no value otherwise.
     */
    public zip<U>(other: Optional<U>): Optional<[T, U]> {
        if (this.isEmpty || other.isEmpty) {
            return Optional.empty<[T, U]>();
        }
        return Optional.fromValue<[T, U]>([this._value!, other._value!]);
    }

    /**
     * Zip another {@link Optional} together with this instance is both contain
     * some value using the given function.
     *
     * @param other - The other {@link Optional} to zip into this instance.
     * @param zipFunc - The function to use to combine the values contained in
     * both {@link Optional} instances.
     *
     * @returns A new {@link Optional} containing the result of calling the
     * given zipping function with the values from this instance and the given
     * {@link Optional} if both contain some value; a new {@link Optional}
     * containing no value otherwise.
     */
    public zipWith<U, R>(
        other: Optional<U>,
        zipFunc: Zipper<T, U, R>
    ): Optional<R> {
        if (this.isEmpty || other.isEmpty) {
            return Optional.empty<R>();
        }
        return Optional.fromNullable<R>(zipFunc(this._value!, other._value!));
    }
}
