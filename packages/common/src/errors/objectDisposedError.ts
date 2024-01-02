import {InvalidStateError} from './invalidStateError';

export class ObjectDisposedError extends InvalidStateError {
    public constructor(
        operationName: string,
        objectType: string,
        message?: string,
        inner?: Error
    ) {
        super(
            operationName,
            objectType,
            message ??
                `The object of type "${objectType}" was in an invalid state for the operation "${operationName}" (object has been disposed)`,
            inner
        );
        this.name = 'ObjectDisposedError';
    }
}
