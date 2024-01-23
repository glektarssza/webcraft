import {StateError} from './stateError';

/**
 * An error that is produced when an object has been disposed.
 */
export class DisposedError extends StateError {
    /**
     * Create a new instance.
     *
     * @param objectType - The type of the object which was in an invalid state.
     * @param operationName - The name of the operation that failed.
     * @param message - A string describing the nature of the error.
     * @param inner - The error which caused the new instance to be created.
     */
    public constructor(
        objectType: string,
        operationName: string,
        message?: string,
        inner?: Error
    ) {
        super(
            objectType,
            operationName,
            message ??
                `Operation "${operationName}" failed (object of type "${objectType}" has been disposed)`,
            inner
        );
    }
}
