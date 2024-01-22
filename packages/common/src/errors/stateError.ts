import {OperationError} from './operationError';

/**
 * An error that is produced when an object is in an invalid state for the
 * requested operation.
 */
export class StateError extends OperationError {
    /**
     * The type of the object which was in an invalid state.
     */
    public readonly objectType: string;

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
            operationName,
            message ??
                `Operation "${operationName}" failed (object of type "${objectType}" was in an invalid state)`,
            inner
        );
        this.objectType = objectType;
    }
}
