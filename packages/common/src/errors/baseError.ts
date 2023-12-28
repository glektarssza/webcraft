import {isEmptyOrWhitespaceString, isString} from '../typeUtils';

/**
 * A base error class which all other error classes should extend.
 */
export class BaseError extends Error {
    public readonly inner?: Error | undefined;

    public constructor(message?: string, inner?: Error) {
        super(message);
        this.name = 'BaseError';
        this.inner = inner;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

/**
 * Format the base part of an error.
 *
 * @param error - The error to format.
 *
 * @returns The formatted error.
 */
function formatErrorBase(error: Error): string {
    if (isEmptyOrWhitespaceString(error.name)) {
        return 'Error';
    }
    if (isEmptyOrWhitespaceString(error.message)) {
        return error.name;
    }
    return `${error.name}: ${error.message}`;
}

/**
 * Format the stack part of an error.
 *
 * @param callSites - The call sites to format.
 *
 * @returns The formatted stack.
 */
function formatErrorStack(callSites: V8.CallSite[]): string {
    return callSites
        .map((callSite) => {
            const functionName = callSite.getFunctionName();
            const typeName = callSite.getTypeName();
            const methodName = callSite.getMethodName();
            const fileName = callSite.getFileName();
            const lineNumber = callSite.getLineNumber();
            const columnNumber = callSite.getColumnNumber();
            const evalOrigin = callSite.getEvalOrigin();
            const isTopLevel = callSite.isToplevel();
            const isEval = callSite.isEval();
            const isNative = callSite.isNative();
            const isConstructor = callSite.isConstructor();
            const formattedCallSite = [
                isString(functionName) &&
                !isEmptyOrWhitespaceString(functionName)
                    ? `at ${functionName} `
                    : '',
                typeName ? `(${typeName})` : '',
                methodName ? `.${methodName}` : '',
                fileName ? ` (${fileName}:${lineNumber}:${columnNumber})` : '',
                evalOrigin
                    ? ` (eval at ${evalOrigin}, <anonymous>:${lineNumber}:${columnNumber})`
                    : '',
                isTopLevel ? ' (top level)' : '',
                isEval ? ' (eval at <anonymous>)' : '',
                isNative ? ' (native)' : '',
                isConstructor ? ' (constructor)' : ''
            ].join('');
            return formattedCallSite.trim();
        })
        .join('\n');
}

/**
 * Format an error.
 *
 * @param error - The error to format.
 * @param callSites - The call sites to format.
 *
 * @returns The formatted error.
 */
function formatError(error: Error, callSites: V8.CallSite[]): string {
    const base = formatErrorBase(error);
    const stack = formatErrorStack(callSites).replace(/\n/g, '\n\t');
    if (error instanceof BaseError && error.inner) {
        const inner = formatError(error.inner, callSites);
        return `${base}\n\t${stack}\nCaused by: ${inner}`;
    }
    return `${base}\n\t${stack}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
Error.prepareStackTrace = formatError;

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace V8 {
    /**
     * A single call site within a stack trace.
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
         * This value is retrieved from the `name` property of the constructor
         * of the object which the `this` keyword refers to. If no such property
         * is available the the value in the object's `[[Class]]` internal
         * property is returned.
         *
         * @returns The type of the `this` keyword.
         */
        getTypeName(): string | null;

        /**
         * Get the function this instance is from inside of.
         *
         * @returns The function this instance is from inside of.
         */
        // eslint-disable-next-line @typescript-eslint/ban-types
        getFunction(): Function | undefined;

        /**
         * The name of the current function, typically its `name` property.
         *
         * If a name property is not available an attempt will be made to try
         * to infer a name from the function's context.
         *
         * @returns The name of the current function.
         */
        getFunctionName(): string | null;

        /**
         * Get name of the property in the object that contains the current
         * function.
         *
         * @returns The name of the property in the object that contains the
         * current function.
         */
        getMethodName(): string | null;

        /**
         * Get the name of the script from where the function originated.
         *
         * @returns The name of the script from where the function originated.
         */
        getFileName(): string | undefined;

        /**
         * Get the line number for the current call site.
         *
         * This value is only available if the function was defined in a script.
         *
         * @returns The line number for the current call site.
         */
        getLineNumber(): number | null;

        /**
         * Get the column number for the current call site.
         *
         * This value is only available if the function was defined in a script.
         *
         * @returns The column number for the current call site.
         */
        getColumnNumber(): number | null;

        /**
         * Get the originating location for the current call site if the
         * function was defined in an `eval` call.
         *
         * @returns The originating location for the current call site.
         */
        getEvalOrigin(): string | undefined;

        /**
         * Get whether this is a top-level invocation.
         *
         * An invocation is considered "top-level" if the `this` keyword is a
         * reference to the global object.
         *
         * @returns Whether this is a top-level invocation.
         */
        isToplevel(): boolean;

        /**
         * Get whether this call takes place inside an `eval` call.
         *
         * @returns Whether this call takes place inside an `eval` call.
         */
        isEval(): boolean;

        /**
         * Get whether this call takes place in native V8 code.
         *
         * @returns Whether this call takes place in native V8 code.
         */
        isNative(): boolean;

        /**
         * Get whether this is a constructor call.
         *
         * @returns Whether this is a constructor call.
         */
        isConstructor(): boolean;
    }
}

declare global {
    interface ErrorConstructor {
        /**
         * The maximum number of call sites to collect into a stack trace.
         *
         * A value of zero will disable stack trace collection.
         *
         * A value of `Infinity` will collect all call sites.
         */
        stackTraceLimit?: number;

        /**
         * Capture a stack trace onto the `.stack` property of the target
         * object.
         *
         * @param targetObject - Object to be modified to include a `.stack`
         * property.
         * @param constructorOpt - A constructor function that delimits the
         * initial location to capture the stack trace from.
         */
        captureStackTrace(
            targetObject: object,
            // eslint-disable-next-line @typescript-eslint/ban-types
            constructorOpt?: Function
        ): void;

        /**
         * An optional, developer-provided function to customize the format of
         * a collected stack trace.
         *
         * @param err - The error object which the formatted stack trace will be
         * attached to.
         * @param stackTraces - A list of call site objects representing the
         * stack trace which has been collected.
         *
         * @returns The formatted stack trace.
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        prepareStackTrace?(err: Error, stackTraces: V8.CallSite[]): any;
    }
}

export default BaseError;
