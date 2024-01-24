//-- Project Code
import {
    ArgumentError,
    ArgumentRangeError,
    DisposedError,
    OperationError,
    StateError
} from 'webcraft-common';
import {Context} from './context';
import {Resource} from './resource';
import {BufferTarget} from './bufferTarget';
import {BufferUsageHint} from './bufferUsageHint';
import {ErrorCode} from './errorCode';

/**
 * A wrapper around a WebGL buffer object.
 */
export class Buffer extends Resource<WebGLBuffer> {
    /**
     * The number of bytes in VRAM allocated to this instance.
     */
    private _allocatedSize: number | null;

    /**
     * The currently configured usage hint for the instance.
     */
    private _usageHint: BufferUsageHint | null;

    /**
     * The target this instance binds to.
     */
    public readonly target: BufferTarget;

    /**
     * The number of bytes in VRAM allocated to this instance.
     */
    public get allocatedSize(): number | null {
        if (this.isDisposed) {
            return null;
        }
        if (this.native === null) {
            return null;
        }
        return this._allocatedSize;
    }

    /**
     * The currently configured usage hint for the instance.
     */
    public get usageHint(): BufferUsageHint | null {
        if (this.isDisposed) {
            return null;
        }
        if (this.native === null) {
            return null;
        }
        return this._usageHint;
    }

    /**
     * Whether this instance is bound to its {@link Buffer.target | target}.
     */
    public get isBound(): boolean {
        if (this.isDisposed) {
            return false;
        }
        if (this.native === null) {
            return false;
        }
        let paramName: GLenum;
        switch (this.target) {
            case BufferTarget.ArrayBuffer:
                paramName = WebGLRenderingContext.ARRAY_BUFFER_BINDING;
                break;
            case BufferTarget.ElementArrayBuffer:
                paramName = WebGLRenderingContext.ELEMENT_ARRAY_BUFFER_BINDING;
                break;
        }
        return this.context.native.getParameter(paramName) === this.native;
    }

    /**
     * Create a new instance.
     *
     * @param context - The WebGL rendering context that will own the new
     * instance.
     * @param target - The target the new instance will bind to.
     *
     * @throws `OperationError`
     * Thrown if the native WebGL buffer resource fails to be created.
     */
    public constructor(context: Context, target: BufferTarget) {
        super(context);
        this._native = this.context.native.createBuffer();
        if (this.native === null) {
            throw new OperationError(
                'createBuffer',
                'Failed to create native WebGL buffer resource'
            );
        }
        this.target = target;
        this._allocatedSize = null;
        this._usageHint = null;
    }

    /**
     * Bind this instance to its {@link Buffer.target | target}.
     *
     * If this instance is already bound to its target this method does nothing.
     *
     * @throws `DisposedError`
     * Thrown if the instance is disposed.
     * @throws `StateError`
     * Thrown if the instance does not wrap a valid WebGL buffer resource.
     * @throws `OperationError`
     * Thrown if a WebGL error occurs during the operation.
     */
    public bind(): void {
        if (this.isDisposed) {
            throw new DisposedError(
                'Buffer',
                'bind',
                'Cannot bind a disposed WebGL buffer'
            );
        }
        if (this.native === null) {
            throw new StateError(
                'Buffer',
                'bind',
                'Cannot bind an invalid WebGL buffer'
            );
        }
        if (this.isBound) {
            return;
        }
        this.context.native.bindBuffer(this.target, this.native);
        const err = this.context.getError();
        if (err !== ErrorCode.NoError) {
            throw new OperationError(
                'bind',
                'An error occurred while binding a WebGL buffer'
            );
        }
    }

    /**
     * Unbind this instance from its {@link Buffer.target | target}.
     *
     * If this instance is already unbound from its target this method does
     * nothing.
     *
     * @throws `DisposedError`
     * Thrown if the instance is disposed.
     * @throws `StateError`
     * Thrown if the instance does not wrap a valid WebGL buffer resource.
     * @throws `OperationError`
     * Thrown if a WebGL error occurs during the operation.
     */
    public unbind(): void {
        if (this.isDisposed) {
            throw new DisposedError(
                'Buffer',
                'unbind',
                'Cannot unbind a disposed WebGL buffer'
            );
        }
        if (this.native === null) {
            throw new StateError(
                'Buffer',
                'unbind',
                'Cannot unbind an invalid WebGL buffer'
            );
        }
        if (!this.isBound) {
            return;
        }
        this.context.native.bindBuffer(this.target, null);
        const err = this.context.getError();
        if (err !== ErrorCode.NoError) {
            throw new OperationError(
                'unbind',
                'An error occurred while unbinding a WebGL buffer'
            );
        }
    }

    /**
     * Allocate space in VRAM for this instance.
     *
     * @param sizeBytes - The number of bytes to allocate in VRAM.
     * @param usageHint - The usage hint to configure this instance with.
     *
     * @throws `DisposedError`
     * Thrown if the instance is disposed.
     * @throws `StateError`
     * Thrown if the instance does not wrap a valid WebGL buffer resource.
     * @throws `StateError`
     * Thrown if the instance is not bound to its
     * {@link Buffer.target | target}.
     * @throws `OperationError`
     * Thrown if a WebGL error occurs during the operation.
     */
    public allocate(
        sizeBytes: number,
        usageHint = BufferUsageHint.StaticDraw
    ): void {
        if (this.isDisposed) {
            throw new DisposedError(
                'Buffer',
                'allocate',
                'Cannot allocate a disposed WebGL buffer'
            );
        }
        if (this.native === null) {
            throw new StateError(
                'Buffer',
                'allocate',
                'Cannot allocate an invalid WebGL buffer'
            );
        }
        if (!this.isBound) {
            throw new StateError(
                'Buffer',
                'allocate',
                'Cannot allocate an unbound WebGL buffer'
            );
        }
        this.context.native.bufferData(this.target, sizeBytes, usageHint);
        const err = this.context.getError();
        if (err !== ErrorCode.NoError) {
            throw new OperationError(
                'allocate',
                'An error occurred while allocating a WebGL buffer'
            );
        }
        this._allocatedSize = sizeBytes;
        this._usageHint = usageHint;
    }

    /**
     * Upload data into this instance.
     *
     * If sufficient space has not been allocated in VRAM for this instance it
     * will automatically be allocated.
     *
     * @param data - The data to upload.
     * @param usageHint - The usage hint to configure this instance with.
     *
     * @throws `DisposedError`
     * Thrown if the instance is disposed.
     * @throws `StateError`
     * Thrown if the instance does not wrap a valid WebGL buffer resource.
     * @throws `StateError`
     * Thrown if the instance is not bound to its
     * {@link Buffer.target | target}.
     * @throws `OperationError`
     * Thrown if a WebGL error occurs during the operation.
     */
    public uploadData(
        data: BufferSource,
        usageHint = BufferUsageHint.StaticDraw
    ): void {
        if (this.isDisposed) {
            throw new DisposedError(
                'Buffer',
                'uploadData',
                'Cannot upload data to a disposed WebGL buffer'
            );
        }
        if (this.native === null) {
            throw new StateError(
                'Buffer',
                'uploadData',
                'Cannot upload data to an invalid WebGL buffer'
            );
        }
        if (!this.isBound) {
            throw new StateError(
                'Buffer',
                'uploadData',
                'Cannot upload data to an unbound WebGL buffer'
            );
        }
        this.context.native.bufferData(this.target, data, usageHint);
        const err = this.context.getError();
        if (err !== ErrorCode.NoError) {
            throw new OperationError(
                'uploadData',
                'An error occurred while uploading data to a WebGL buffer'
            );
        }
        this._allocatedSize = data.byteLength;
        this._usageHint = usageHint;
    }

    /**
     * Upload data into this instance at a given offset into the existing
     * allocation.
     *
     * @param data - The data to upload.
     * @param offset - The offset to upload the data at in the existing
     * allocation.
     *
     * @throws `DisposedError`
     * Thrown if the instance is disposed.
     * @throws `StateError`
     * Thrown if the instance does not wrap a valid WebGL buffer resource.
     * @throws `StateError`
     * Thrown if the instance is not bound to its
     * {@link Buffer.target | target}.
     * @throws `StateError`
     * Thrown if the instance has not be allocated yet.
     * @throws `ArgumentError`
     * Thrown if the `offset` is not a finite number.
     * @throws `ArgumentRangeError`
     * Thrown if the `offset` is less than `0` or greater than the size of the
     * allocation minus the length of the data to upload.
     * @throws `OperationError`
     * Thrown if a WebGL error occurs during the operation.
     */
    public uploadSubData(data: BufferSource, offset = 0): void {
        if (this.isDisposed) {
            throw new DisposedError(
                'Buffer',
                'uploadSubData',
                'Cannot upload sub data to a disposed WebGL buffer'
            );
        }
        if (this.native === null) {
            throw new StateError(
                'Buffer',
                'uploadSubData',
                'Cannot upload sub data to an invalid WebGL buffer'
            );
        }
        if (!this.isBound) {
            throw new StateError(
                'Buffer',
                'uploadSubData',
                'Cannot upload sub data to an unbound WebGL buffer'
            );
        }
        if (this.allocatedSize === null) {
            throw new StateError(
                'Buffer',
                'uploadSubData',
                'Cannot upload sub data to an unallocated WebGL buffer'
            );
        }
        if (!isFinite(offset)) {
            throw new ArgumentError('offset', 'Offset must be a finite number');
        }
        if (offset < 0 || offset >= this.allocatedSize - data.byteLength) {
            throw new ArgumentRangeError(
                offset,
                0,
                this.allocatedSize - data.byteLength,
                'Offset must be inside the allocation bounds'
            );
        }
        this.context.native.bufferSubData(this.target, offset, data);
        const err = this.context.getError();
        if (err !== ErrorCode.NoError) {
            throw new OperationError(
                'uploadSubData',
                'An error occurred while uploading sub data to a WebGL buffer'
            );
        }
    }

    /**
     * Dispose of this instance and release any resources it is managing.
     *
     * This method, is possible, should not throw any errors.
     */
    public override dispose(): void {
        if (this.isDisposed) {
            return;
        }
        if (this.native !== null) {
            this.context.native.deleteBuffer(this.native);
        }
        this._allocatedSize = null;
        this._usageHint = null;
        super.dispose();
    }
}
