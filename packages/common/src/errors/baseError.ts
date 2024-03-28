/**
 * A base error type for other error types to extend from.
 */
export class BaseError extends Error {
    /**
     * The error that caused this instance to be created.
     */
    public readonly inner?: Error;

    /**
     * Create a new instance.
     *
     * @param message - The message describing what went wrong.
     * @param inner - The error that caused the new instance to be created.
     */
    public constructor(message?: string, inner?: Error) {
        super(message ?? '');
        this.inner = inner;
        this.name = this.constructor.name;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace V8 {
    export interface CallSite {
        /**
         * Get the object bound to the `this` keyword.
         *
         * @returns The object bound to the `this` keyword.
         */
        getThis(): unknown;

        /**
         * Get the type name of the object bound to the `this` keyword.
         *
         * @returns The type name of the object bound to the `this` keyword.
         */
        getTypeName(): string | null;

        /**
         * Get the function this instance resides inside of.
         *
         * @returns The function this instance resides inside of.
         */
        // eslint-disable-next-line @typescript-eslint/ban-types
        getFunction(): Function | undefined;

        /**
         * Get the name of the function this instance resides inside of.
         *
         * @returns The name of the function this instance resides inside of.
         */
        getFunctionName(): string | null;

        /**
         * Get the name of the method this instance resides inside of if it is
         * a method on a class.
         *
         * @returns The name of the method this instance resides inside of if it
         * is a method on a class.
         */
        getMethodName(): string | null;

        /**
         * Get the name of the file this instance resides inside of.
         *
         * @returns The name of the file this instance resides inside of.
         */
        getFileName(): string | undefined;

        /**
         * Get the line number of the file this instance resides inside of.
         *
         * @returns The line number of the file this instance resides inside of.
         */
        getLineNumber(): number | null;

        /**
         * Get the column number of the file this instance resides inside of.
         *
         * @returns The column number of the file this instance resides inside
         * of.
         */
        getColumnNumber(): number | null;

        /**
         * Get the eval origin this instance resides inside of.
         *
         * @returns The eval origin this instance resides inside of.
         */
        getEvalOrigin(): string | undefined;

        /**
         * Get whether this instance resides in the top-level of the call stack.
         *
         * @returns Whether this instance resides in the top-level of the call
         * stack.
         */
        isToplevel(): boolean;

        /**
         * Get whether this instance resides in an `eval` statement.
         *
         * @returns Whether this instance resides in an `eval` statement.
         */
        isEval(): boolean;

        /**
         * Get whether this instance resides in native code.
         *
         * @returns Whether this instance resides in native code.
         */
        isNative(): boolean;

        /**
         * Get whether this instance resides in a constructor.
         *
         * @returns Whether this instance resides in a constructor.
         */
        isConstructor(): boolean;

        /**
         * Get whether this instance resides in an `async` function.
         *
         * @returns Whether this instance resides in an `async` function.
         */
        isAsync(): boolean;

        /**
         * Get whether this instance resides in `Promise.all` statement.
         *
         * @returns Whether this instance resides in `Promise.all` statement.
         */
        isPromiseAll(): boolean;

        /**
         * Get the index of the promise inside `Promise.all` which this instance
         * resides inside of.
         *
         * @returns The index of the promise inside `Promise.all` which this
         * instance resides inside of.
         */
        getPromiseIndex(): number | null;

        /**
         * Get the script name or source URL this instance resides inside of.
         *
         * @returns The script name or source URL this instance resides inside
         * of.
         */
        getScriptNameOrSourceURL(): string;

        /**
         * Get the hash of the script this instance resides inside of.
         *
         * @returns The hash of the script this instance resides inside of.
         */
        getScriptHash(): string;

        /**
         * Get the column number of the scope which encloses the scope this
         * instance resides inside of.
         *
         * @returns The column number of the scope which encloses the scope this
         * instance resides inside of.
         */
        getEnclosingColumnNumber(): number;

        /**
         * Get the line number of the scope which encloses the scope this
         * instance resides inside of.
         *
         * @returns The line number of the scope which encloses the scope this
         * instance resides inside of.
         */
        getEnclosingLineNumber(): number;

        /**
         * Get the position of this instance inside the source which it is
         * inside of.
         *
         * @returns the position of this instance inside the source which it is
         * inside of.
         */
        getPosition(): number;

        /**
         * Convert this instance to a string.
         *
         * @returns A string representation of this instance.
         */
        toString(): string;
    }
}

declare global {
    interface ErrorConstructor {
        /**
         * The maximum number of call sites to collect when creating a stack
         * trace.
         *
         * Set to `0` to disable collecting stack traces.
         *
         * Set to `Infinity` to collect all call sites.
         */
        stackTraceLimit?: number;

        /**
         * Capture a stack trace and attach it to the `.stack` property of the
         * given object.
         *
         * @param targetObject - The object to attach the call stack to.
         * @param constructorOpt - The constructor used to create the target
         * object. Used to limit the stack trace to call sites above that
         * function.
         */
        captureStackTrace?(
            targetObject: object,
            // eslint-disable-next-line @typescript-eslint/ban-types
            constructorOpt?: Function
        ): void;

        /**
         * A user-definable function to override the generation of stack traces.
         *
         * @param err - The error object which is having a stack trace collected
         * for it.
         * @param stackTraces - The call sites collected for the error.
         *
         * @returns A formatted stack trace.
         */
        prepareStackTrace?(err: Error, stackTraces: V8.CallSite[]): unknown;
    }
}
