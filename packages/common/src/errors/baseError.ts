/**
 * A basic error type that other errors can extend from.
 */
export class BaseError extends Error {
    /**
     * The error which caused this instance to be created.
     */
    public readonly inner?: Error;

    /**
     * Create a new instance.
     *
     * @param message - A string describing the nature of the error.
     * @param inner - The error which caused the new instance to be created.
     */
    public constructor(message?: string, inner?: Error) {
        super(message);
        this.name = this.constructor.name;
        this.inner = inner;
        if (
            Error.captureStackTrace !== undefined &&
            Error.captureStackTrace !== null
        ) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
declare module V8 {
    /**
     * An interface representing a V8 engine call site.
     */
    export interface CallSite {
        /**
         * Get the value of the `this` keyword.
         *
         * @returns The value of the `this` keyword.
         */
        getThis(): unknown;

        /**
         * Get the type of the `this` keyword.
         *
         * This is the `name` property of the function held in the `constructor`
         * property of the `this` keyword, if available. If not available the
         * value of the internal `[[Class]]` property is provided.
         *
         * @returns The type of the `this` keyword.
         */
        getTypeName(): string | null;

        /**
         * Get the function that this instance was inside of.
         *
         * @returns The function that this instance was inside of.
         */
        // eslint-disable-next-line @typescript-eslint/ban-types
        getFunction(): Function | undefined;

        /**
         * Get the name of the function that this instance was inside of.
         *
         * Typically this is the value of the `name` property. If this property
         * is not available an attempt will be made to infer a name from the
         * context of the function.
         *
         * @returns The name of the function that this instance was inside of.
         */
        getFunctionName(): string | null;

        /**
         * Get the name of the file the instance is in, if it was in a script.
         *
         * @returns The name of the file the instance is in.
         */
        getFileName(): string | undefined;

        /**
         * Get the line number of the instance, if it was in a script.
         *
         * @returns The line number of the instance.
         */
        getLineNumber(): number | null;

        /**
         * Get the column number of the instance, if it was in a script.
         *
         * @returns The column number of the instance.
         */
        getColumnNumber(): number | null;

        /**
         * Get the origin of the instance, if it was inside of an `eval`
         * statement.
         *
         * @returns The origin of the instance.
         */
        getEvalOrigin(): string | undefined;

        /**
         * Get if this instance is in a top-level context.
         *
         * @returns `true` if the `this` keyword is the global object; `false`
         * otherwise.
         */
        isToplevel(): boolean;

        /**
         * Get if this instance was inside an `eval` statement.
         *
         * @returns `true` if this instance was inside an `eval` statement;
         * `false` otherwise.
         */
        isEval(): boolean;

        /**
         * Get if this instance was inside native V8 code.
         *
         * @returns `true` if this instance was inside native V8 code; `false`
         * otherwise.
         */
        isNative(): boolean;

        /**
         * Get if this instance was inside a constructor.
         *
         * @returns `true` if this instance was inside a constructor; `false`
         * otherwise.
         */
        isConstructor(): boolean;

        /**
         * Get if this instance was inside an asynchronous call.
         *
         * @returns `true` if this instance was inside an asynchronous call;
         * `false` otherwise.
         */
        isAsync(): boolean;

        /**
         * Get if this instance was inside an asynchronous {@link Promise.all}
         * call.
         *
         * @returns `true` if this instance was inside an asynchronous
         * {@link Promise.all} call; `false` otherwise.
         */
        isPromiseAll(): boolean;

        /**
         * Get the index of the promise inside an asynchronous
         * {@link Promise.all} call that was being executed.
         *
         * @returns the index of the promise inside an asynchronous
         * {@link Promise.all} call that was being executed.
         */
        getPromiseIndex(): number | null;

        /**
         * TODO: Document
         */
        getScriptNameOrSourceURL(): string;

        /**
         * TODO: Document
         */
        getScriptHash(): string;

        /**
         * TODO: Document
         */
        getEnclosingColumnNumber(): number;

        /**
         * TODO: Document
         */
        getEnclosingLineNumber(): number;

        /**
         * TODO: Document
         */
        getPosition(): number;

        /**
         * TODO: Document
         */
        toString(): string;
    }
}

declare global {
    interface ErrorConstructor {
        /**
         * The maximum number of call sites to collect when gathering a stack
         * trace.
         *
         * A non-finite, negative, or value of zero will cause no stack trace to
         * be collected.
         *
         * A value of `Infinity` will cause all call sites to be collected.
         */
        stackTraceLimit?: number;

        /**
         * A user-overridable function to customize the formatting of stack
         * traces.
         *
         * @param err - The error for which the stack trace is being collected.
         * @param stackTrace - An array of call sites representing the collected
         * stack trace.
         *
         * @returns A value representing the formatted stack trace.
         */
        prepareStackTrace?(err: Error, stackTrace: V8.CallSite[]): unknown;

        /**
         * Capture a stack trace.
         *
         * @param err - The object to capture the stack trace to.
         * @param errCtor - The constructor of the `err` object. Represents a
         * stopping point when collecting a stack trace.
         */
        // eslint-disable-next-line @typescript-eslint/ban-types
        captureStackTrace?(err: object, errCtor?: Function): void;
    }
}

/**
 * A module which contains the {@link BaseError | base error} class.
 */
const m = {};

/**
 * Get the module object for use in unit tests.
 *
 * @returns The module object for use in unit tests.
 *
 * @internal
 */
export function getTestModule() {
    return m;
}

/* eslint-disable no-empty-pattern */
export const {} = m;
/* eslint-enable no-empty-pattern */
