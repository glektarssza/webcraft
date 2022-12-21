import {Resource} from '.';

/**
 * Possible targets a {@link Buffer} can bind to.
 */
export enum BufferTarget {
    /**
     * The `ARRAY_BUFFER` target.
     */
    ARRAY_BUFFER = WebGLRenderingContext.ARRAY_BUFFER,

    /**
     * The `ELEMENT_ARRAY_BUFFER` target.
     */
    ELEMENT_ARRAY_BUFFER = WebGLRenderingContext.ELEMENT_ARRAY_BUFFER
}

/**
 * Possible usage hints a {@link Buffer} be annotated with.
 */
export enum BufferUsageHint {
    /**
     * The `STATIC_DRAW` usage hint.
     */
    STATIC_DRAW = WebGLRenderingContext.STATIC_DRAW,

    /**
     * The `DYNAMIC_DRAW` usage hint.
     */
    DYNAMIC_DRAW = WebGLRenderingContext.DYNAMIC_DRAW,

    /**
     * The `STREAM_DRAW` usage hint.
     */
    STREAM_DRAW = WebGLRenderingContext.STREAM_DRAW
}

/**
 * A WebGL buffer.
 */
export class Buffer extends Resource<WebGLBuffer> {
    /**
     * The amount of memory allocated to this instance, in bytes.
     *
     * This value will be `null` if the buffer has been disposed or has not had
     * space allocated for it yet.
     */
    private _size: number | null;

    /**
     * The usage hint the instance is annotated with.
     *
     * This value will be `null` if the buffer has been disposed or has not had
     * space allocated for it yet.
     */
    private _usageHint: BufferUsageHint | null;

    /**
     * The target the instance binds to.
     */
    public readonly target: BufferTarget;

    /**
     * The amount of memory allocated to this instance, in bytes.
     *
     * This value will be `null` if the buffer has been disposed or has not had
     * space allocated for it yet.
     */
    public get size(): number | null {
        return this._size;
    }

    /**
     * The usage hint the instance is annotated with.
     *
     * This value will be `null` if the buffer has been disposed or has not had
     * space allocated for it yet.
     */
    public get usageHint(): BufferUsageHint | null {
        return this._usageHint;
    }

    /**
     * Whether this instance is bound to its target.
     */
    public get isBound(): boolean {
        switch (this.target) {
            case BufferTarget.ARRAY_BUFFER:
                return (
                    this.context.getParameter(
                        WebGLRenderingContext.ARRAY_BUFFER_BINDING
                    ) === this.native
                );
            case BufferTarget.ELEMENT_ARRAY_BUFFER:
                return (
                    this.context.getParameter(
                        WebGLRenderingContext.ELEMENT_ARRAY_BUFFER_BINDING
                    ) === this.native
                );
            default:
                throw new Error(`Unknown buffer target: ${this.target}`);
        }
    }

    /**
     * Creates a new instance.
     *
     * @param context - The WebGL rendering context this instance will belong
     * to.
     * @param target - The target this instance will bind to.
     *
     * @throws Throws an {@link Error} if the native WebGL resource fails to be
     * created.
     */
    public constructor(context: WebGLRenderingContext, target: BufferTarget) {
        super(context);
        this._size = null;
        this._usageHint = null;
        this.target = target;
    }

    /**
     * Bind this instance to its target.
     *
     * @returns This instance for chaining.
     *
     * @throws Throws an {@link Error} if the instance has been disposed.
     * @throws Throws an {@link Error} if the instance is invalid.
     * @throws Throws an {@link Error} if the a WebGL error occurs.
     */
    public bind(): this {
        if (this.isDisposed) {
            throw new Error('Cannot bind a disposed buffer');
        }
        if (this.native === null) {
            throw new Error('Cannot bind an invalid buffer');
        }
        if (this.isBound) {
            return this;
        }
        this.context.bindBuffer(this.target, this.native);
        const err = this.context.getError();
        if (err !== WebGLRenderingContext.NO_ERROR) {
            throw new Error(`Failed to bind buffer: ${err}`);
        }
        return this;
    }

    /**
     * Allocate space in VRAM for this instance.
     *
     * @param size - The size of the space to allocate, in bytes.
     * @param usageHint - The usage hint to annotate the instance with.
     *
     * @returns This instance for chaining.
     *
     * @throws Throws an {@link Error} if the instance has been disposed.
     * @throws Throws an {@link Error} if the instance is invalid.
     * @throws Throws an {@link Error} if the instance is not bound.
     * @throws Throws an {@link Error} if the a WebGL error occurs.
     */
    public allocate(
        size: number,
        usageHint = BufferUsageHint.STATIC_DRAW
    ): this {
        if (this.isDisposed) {
            throw new Error('Cannot allocate space for a disposed buffer');
        }
        if (this.native === null) {
            throw new Error('Cannot allocate space for an invalid buffer');
        }
        if (!this.isBound) {
            throw new Error('Cannot allocate space for an unbound buffer');
        }
        if (!isFinite(size) || size < 0) {
            throw new Error(
                'Cannot allocate space for a buffer of invalid size'
            );
        }
        this.context.bufferData(this.target, size, usageHint);
        const err = this.context.getError();
        if (err !== WebGLRenderingContext.NO_ERROR) {
            throw new Error(`Failed to allocate space for buffer: ${err}`);
        }
        this._size = size;
        this._usageHint = usageHint;
        return this;
    }

    /**
     * Upload data into this instance.
     *
     * If the instance has not been allocated yet or the allocation is the wrong
     * size, the instance will be allocated to the size of the data.
     *
     * @param data - The data to upload.
     * @param usageHint - The usage hint to annotate the instance with.
     *
     * @returns This instance for chaining.
     *
     * @throws Throws an {@link Error} if the instance has been disposed.
     * @throws Throws an {@link Error} if the instance is invalid.
     * @throws Throws an {@link Error} if the instance is not bound.
     * @throws Throws an {@link Error} if the a WebGL error occurs.
     */
    public uploadData(
        data: BufferSource,
        usageHint = BufferUsageHint.STATIC_DRAW
    ): this {
        if (this.isDisposed) {
            throw new Error('Cannot upload data to a disposed buffer');
        }
        if (this.native === null) {
            throw new Error('Cannot upload data to an invalid buffer');
        }
        if (!this.isBound) {
            throw new Error('Cannot upload data to an unbound buffer');
        }
        this.context.bufferData(this.target, data, usageHint);
        const err = this.context.getError();
        if (err !== WebGLRenderingContext.NO_ERROR) {
            throw new Error(`Failed to upload data to buffer: ${err}`);
        }
        this._size = data.byteLength;
        this._usageHint = usageHint;
        return this;
    }

    /**
     * Upload data to an offset inside the existing allocation.
     *
     * @param data - The data to upload.
     * @param offset - The offset to upload the data to, in bytes.
     *
     * @returns This instance for chaining.
     *
     * @throws Throws an {@link Error} if the instance has been disposed.
     * @throws Throws an {@link Error} if the instance is invalid.
     * @throws Throws an {@link Error} if the instance is not bound.
     * @throws Throws an {@link Error} if the instance has not been allocated.
     * @throws Throws an {@link Error} if the offset is invalid.
     * @throws Throws an {@link Error} if the offset is out of bounds.
     * @throws Throws an {@link Error} if the a WebGL error occurs.
     */
    public uploadSubData(data: BufferSource, offset = 0): this {
        if (this.isDisposed) {
            throw new Error('Cannot upload data to a disposed buffer');
        }
        if (this.native === null) {
            throw new Error('Cannot upload data to an invalid buffer');
        }
        if (!this.isBound) {
            throw new Error('Cannot upload data to an unbound buffer');
        }
        if (this._size === null) {
            throw new Error('Cannot upload data to an unallocated buffer');
        }
        if (!isFinite(offset) || offset < 0) {
            throw new Error('Cannot upload data to a buffer at invalid offset');
        }
        if (offset + data.byteLength > this._size) {
            throw new Error('Cannot upload data to a buffer at invalid offset');
        }
        this.context.bufferSubData(this.target, offset, data);
        const err = this.context.getError();
        if (err !== WebGLRenderingContext.NO_ERROR) {
            throw new Error(`Failed to upload data to buffer: ${err}`);
        }
        return this;
    }

    /**
     * Create the native WebGL resource that will be wrapped by this instance.
     *
     * @returns The new native WebGL resource on success, `null` on failure.
     */
    protected _createNative(): WebGLBuffer | null {
        return this.context.createBuffer();
    }

    /**
     * Destroy the native WebGL resource wrapped by this instance.
     */
    protected _deleteNative(): void {
        this.context.deleteBuffer(this.native);
        this._size = null;
        this._usageHint = null;
    }
}
