import {BaseError} from './baseError';

/**
 * An error thrown when an operation fails.
 */
export class OperationError extends BaseError {
    /**
     * The name of the operation that failed.
     */
    public readonly operationName: string;

    /**
     * Create a new instance.
     *
     * @param operationName - The name of the operation that failed.
     * @param message - A string describing the nature of the error.
     * @param inner - The inner error that caused the new instance to be
     * created.
     */
    public constructor(operationName: string, message?: string, inner?: Error) {
        super(
            message ??
                `An error occurred during the execution of "${operationName}"`,
            inner
        );
        this.operationName = operationName;
        this.name = 'OperationError';
    }
}
