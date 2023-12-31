import {OperationError} from './operationError';

/**
 * An error thrown when an operation is performed on an object that is in an
 * invalid state.
 */
export class InvalidStateError extends OperationError {
    /**
     * The type of object that was in an invalid state.
     */
    public readonly objectType: string;

    /**
     * Create a new instance.
     *
     * @param operationName - The name of the operation that failed.
     * @param objectType - The type of object that was in an invalid state.
     * @param message - A string describing the nature of the error.
     * @param inner - The inner error that caused the new instance to be
     * created.
     */
    public constructor(
        operationName: string,
        objectType: string,
        message?: string,
        inner?: Error
    ) {
        super(
            operationName,
            message ??
                `The object of type "${objectType}" was in an invalid state for the operation "${operationName}"`,
            inner
        );
        this.objectType = objectType;
        this.name = 'InvalidStateError';
    }
}
