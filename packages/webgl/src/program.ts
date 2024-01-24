import {DisposedError, OperationError, StateError} from 'webcraft-common';
import {Context} from './context';
import {Resource} from './resource';
import {Shader} from './shader';
import {ErrorCode} from './errorCode';

/**
 * A wrapper around a WebGL program object.
 */
export class Program extends Resource<WebGLProgram> {
    /**
     * A list of {@link Shader | shaders} which are attached to this instance.
     */
    private readonly _attachedShaders: Shader[];

    /**
     * A list of {@link Shader | shaders} which are attached to this instance.
     */
    public get attachedShaders(): Shader[] {
        return this._attachedShaders.slice();
    }

    /**
     * The information log from the last call to link this instance.
     */
    public get infoLog(): string | null {
        if (this.isDisposed) {
            return null;
        }
        if (this.native === null) {
            return null;
        }
        return this.context.native.getProgramInfoLog(this.native);
    }

    /**
     * Whether this instance is linked.
     */
    public get isLinked(): boolean {
        if (this.isDisposed) {
            return false;
        }
        if (this.native === null) {
            return false;
        }
        return this.context.native.getProgramParameter(
            this.native,
            WebGLRenderingContext.LINK_STATUS
        ) as boolean;
    }

    /**
     * Whether this instance is active.
     */
    public get isActive(): boolean {
        if (this.isDisposed) {
            return false;
        }
        if (this.native === null) {
            return false;
        }
        return (
            this.context.native.getParameter(
                WebGLRenderingContext.CURRENT_PROGRAM
            ) === this.native
        );
    }

    /**
     * Create a new instance.
     *
     * @param context - The WebGL rendering context that will own the new
     * instance.
     *
     * @throws `OperationError`
     * Thrown if the native WebGL buffer resource fails to be created.
     */
    public constructor(context: Context) {
        super(context);
        this._native = this.context.native.createProgram();
        if (this.native === null) {
            throw new OperationError(
                'createProgram',
                'Failed to create native WebGL program resource'
            );
        }
        this._attachedShaders = [];
    }

    /**
     * Check whether this instance has a given {@link Shader | shader} attached
     * to it.
     *
     * @param shader - The shader to check for.
     *
     * @returns `true` if the instance has the given shader attached; `false`
     * otherwise.
     */
    public hasAttachShader(shader: Shader): boolean {
        if (this.isDisposed) {
            return false;
        }
        if (this.native === null) {
            return false;
        }
        return this._attachedShaders.includes(shader);
    }

    /**
     * Attach a {@link Shader | shader} to this instance.
     *
     * @param shader - The shader to attach.
     *
     * @throws `DisposedError`
     * Thrown if the instance is disposed.
     * @throws `StateError`
     * Thrown if the instance does not wrap a valid WebGL program resource.
     * @throws `DisposedError`
     * Thrown if the shader is disposed.
     * @throws `StateError`
     * Thrown if the shader does not wrap a valid WebGL shader resource.
     * @throws `OperationError`
     * Thrown if a WebGL error occurs during the operation.
     */
    public attachShader(shader: Shader): void {
        if (this.isDisposed) {
            throw new DisposedError(
                'Program',
                'attachShader',
                'Cannot attach a shader to a disposed WebGL program'
            );
        }
        if (this.native === null) {
            throw new StateError(
                'Program',
                'attachShader',
                'Cannot attach a shader to an invalid WebGL program'
            );
        }
        if (this.hasAttachShader(shader)) {
            return;
        }
        if (shader.isDisposed) {
            throw new DisposedError(
                'Shader',
                'attachShader',
                'Cannot attach a disposed shader to a WebGL program'
            );
        }
        if (shader.native === null) {
            throw new StateError(
                'Shader',
                'attachShader',
                'Cannot attach an invalid shader to a WebGL program'
            );
        }
        this.context.native.attachShader(this.native, shader.native);
        const err = this.context.getError();
        if (err !== ErrorCode.NoError) {
            throw new OperationError(
                'attachShader',
                'An error occurred while attaching a shader to a WebGL program'
            );
        }
        this._attachedShaders.push(shader);
    }

    /**
     * Detach a {@link Shader | shader} from this instance.
     *
     * @param shader - The shader to detach.
     *
     * @throws `DisposedError`
     * Thrown if the instance is disposed.
     * @throws `StateError`
     * Thrown if the instance does not wrap a valid WebGL program resource.
     * @throws `DisposedError`
     * Thrown if the shader is disposed.
     * @throws `StateError`
     * Thrown if the shader does not wrap a valid WebGL shader resource.
     * @throws `OperationError`
     * Thrown if a WebGL error occurs during the operation.
     */
    public detachShader(shader: Shader): void {
        if (this.isDisposed) {
            throw new DisposedError(
                'Program',
                'detachShader',
                'Cannot detach a shader from a disposed WebGL program'
            );
        }
        if (this.native === null) {
            throw new StateError(
                'Program',
                'detachShader',
                'Cannot detach a shader from an invalid WebGL program'
            );
        }
        if (!this.hasAttachShader(shader)) {
            return;
        }
        if (shader.isDisposed) {
            throw new DisposedError(
                'Shader',
                'detachShader',
                'Cannot detach a disposed shader from a WebGL program'
            );
        }
        if (shader.native === null) {
            throw new StateError(
                'Shader',
                'detachShader',
                'Cannot detach an invalid shader from a WebGL program'
            );
        }
        this.context.native.detachShader(this.native, shader.native);
        const err = this.context.getError();
        if (err !== ErrorCode.NoError) {
            throw new OperationError(
                'detachShader',
                'An error occurred while detaching a shader from a WebGL program'
            );
        }
        const i = this._attachedShaders.indexOf(shader);
        if (i >= 0) {
            this._attachedShaders.splice(i, 1);
        }
    }

    /**
     * Link this instance.
     *
     * @throws `DisposedError`
     * Thrown if the instance is disposed.
     * @throws `StateError`
     * Thrown if the instance does not wrap a valid WebGL program resource.
     * @throws `StateError`
     * Thrown if the instance does not have any shaders attached to it.
     * @throws `OperationError`
     * Thrown if a WebGL error occurs during the operation.
     */
    public link(): void {
        if (this.isDisposed) {
            throw new DisposedError(
                'Program',
                'link',
                'Cannot link a disposed WebGL program'
            );
        }
        if (this.native === null) {
            throw new StateError(
                'Program',
                'link',
                'Cannot link an invalid WebGL program'
            );
        }
        if (this._attachedShaders.length === 0) {
            throw new StateError(
                'Program',
                'link',
                'Cannot link a WebGL program with no attached shaders'
            );
        }
        this.context.native.linkProgram(this.native);
        const err = this.context.getError();
        if (err !== ErrorCode.NoError) {
            throw new OperationError(
                'link',
                'An error occurred while linking a WebGL program'
            );
        }
    }

    /**
     * Activate this instance.
     *
     * @throws `DisposedError`
     * Thrown if the instance is disposed.
     * @throws `StateError`
     * Thrown if the instance does not wrap a valid WebGL program resource.
     * @throws `StateError`
     * Thrown if the instance is not linked.
     * @throws `OperationError`
     * Thrown if a WebGL error occurs during the operation.
     */
    public activate(): void {
        if (this.isDisposed) {
            throw new DisposedError(
                'Program',
                'activate',
                'Cannot activate a disposed WebGL program'
            );
        }
        if (this.native === null) {
            throw new StateError(
                'Program',
                'activate',
                'Cannot activate an invalid WebGL program'
            );
        }
        if (!this.isLinked) {
            throw new StateError(
                'Program',
                'activate',
                'Cannot activate an unlinked WebGL program'
            );
        }
        if (this.isActive) {
            return;
        }
        this.context.native.useProgram(this.native);
        const err = this.context.getError();
        if (err !== ErrorCode.NoError) {
            throw new OperationError(
                'activate',
                'An error occurred while activating a WebGL program'
            );
        }
    }

    /**
     * Deactivate this instance.
     *
     * @throws `DisposedError`
     * Thrown if the instance is disposed.
     * @throws `StateError`
     * Thrown if the instance does not wrap a valid WebGL program resource.
     * @throws `StateError`
     * Thrown if the instance is not linked.
     * @throws `OperationError`
     * Thrown if a WebGL error occurs during the operation.
     */
    public deactivate(): void {
        if (this.isDisposed) {
            throw new DisposedError(
                'Program',
                'deactivate',
                'Cannot deactivate a disposed WebGL program'
            );
        }
        if (this.native === null) {
            throw new StateError(
                'Program',
                'deactivate',
                'Cannot deactivate an invalid WebGL program'
            );
        }
        if (!this.isLinked) {
            throw new StateError(
                'Program',
                'deactivate',
                'Cannot deactivate an unlinked WebGL program'
            );
        }
        if (!this.isActive) {
            return;
        }
        this.context.native.useProgram(null);
        const err = this.context.getError();
        if (err !== ErrorCode.NoError) {
            throw new OperationError(
                'deactivate',
                'An error occurred while deactivating a WebGL program'
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
            this.context.native.deleteProgram(this.native);
        }
        this._attachedShaders.length = 0;
        super.dispose();
    }
}
