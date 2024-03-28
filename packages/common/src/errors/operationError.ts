//-- Project Code
import {BaseError} from './baseError';

/**
 * An error that is produced when an operation fails.
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
     * @param message - The message describing what went wrong.
     * @param inner - The error that caused the new instance to be created.
     */
    public constructor(operationName: string, message?: string, inner?: Error) {
        super(message ?? `Operation "${operationName}" failed`, inner);
        this.operationName = operationName;
    }
}
