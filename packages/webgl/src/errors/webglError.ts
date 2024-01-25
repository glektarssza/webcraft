//-- Project Code
import {OperationError} from 'webcraft-common';
import {ErrorCode} from '../errorCode';

/**
 * An error that is produced when a WebGL operation fails.
 */
export class WebGLError extends OperationError {
    /**
     * The error code produced by the WebGL rendering context.
     */
    public readonly errorCode: ErrorCode;

    /**
     * Create a new instance.
     *
     * @param errorCode - The error code produced by the WebGL rendering
     * context.
     * @param operationName - The name of the operation that failed.
     * @param message - A string describing the nature of the error.
     * @param inner - The error which caused the new instance to be created.
     */
    public constructor(
        errorCode: ErrorCode,
        operationName: string,
        message?: string,
        inner?: Error
    ) {
        super(
            operationName,
            message ??
                `WebGL operation "${operationName}" failed with error "${ErrorCode[errorCode]}"`,
            inner
        );
        this.errorCode = errorCode;
    }
}
