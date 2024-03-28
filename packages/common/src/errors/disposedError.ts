//-- Project Code
import {StateError} from './stateError';

/**
 * An error that is produced when an operation fails because the object it was
 * operating on was disposed.
 */
export class DisposedError extends StateError {
    /**
     * Create a new instance.
     *
     * @param objectType - The type of object that was in an invalid state.
     * @param operationName - The name of the operation that failed.
     * @param message - The message describing what went wrong.
     * @param inner - The error that caused the new instance to be created.
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
                `Operation "${operationName}" failed (object of type "${objectType}" was disposed)`,
            inner
        );
    }
}
