import {BaseError} from './baseError';

/**
 * A base class for all operation-related errors to extend from.
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
     * @param inner - The error which caused the new instance to be created.
     */
    public constructor(operationName: string, message?: string, inner?: Error) {
        super(message ?? ``, inner);
        this.operationName = operationName;
    }
}
