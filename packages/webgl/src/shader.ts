import {DisposedError, OperationError, StateError} from 'webcraft-common';
import {Context} from './context';
import {Resource} from './resource';
import {ShaderType} from './shaderType';
import {ErrorCode} from './errorCode';

/**
 * A wrapper around a WebGL shader object.
 */
export class Shader extends Resource<WebGLShader> {
    /**
     * The type of WebGL shader wrapped by this instance.
     */
    public readonly type: ShaderType;

    /**
     * The source code that has been uploaded to this instance.
     */
    public get sourceCode(): string | null {
        if (this.isDisposed) {
            return null;
        }
        if (this.native === null) {
            return null;
        }
        return this.context.native.getShaderSource(this.native);
    }

    /**
     * The information log from the last call to compile this instance.
     */
    public get infoLog(): string | null {
        if (this.isDisposed) {
            return null;
        }
        if (this.native === null) {
            return null;
        }
        return this.context.native.getShaderInfoLog(this.native);
    }

    /**
     * Whether this instance is compiled.
     */
    public get isCompiled(): boolean {
        if (this.isDisposed) {
            return false;
        }
        if (this.native === null) {
            return false;
        }
        return this.context.native.getShaderParameter(
            this.native,
            WebGLRenderingContext.COMPILE_STATUS
        ) as boolean;
    }

    /**
     * Create a new instance.
     *
     * @param context - The WebGL rendering context that will own the new
     * instance.
     * @param type - The type of WebGL shader that will be wrapped by the new
     * instance.
     *
     * @throws `OperationError`
     * Thrown if the native WebGL shader resource fails to be created.
     */
    public constructor(context: Context, type: ShaderType) {
        super(context);
        this._native = this.context.native.createShader(type);
        if (this.native === null) {
            throw new OperationError(
                'createShader',
                'Failed to create native WebGL shader resource'
            );
        }
        this.type = type;
    }

    /**
     * Upload source code to this instance.
     *
     * @param sourceCode - The source code to upload.
     *
     * @throws `DisposedError`
     * Thrown if the instance is disposed.
     * @throws `StateError`
     * Thrown if the instance does not wrap a valid WebGL shader resource.
     * @throws `OperationError`
     * Thrown if a WebGL error occurs during the operation.
     */
    public uploadSourceCode(sourceCode: string): void {
        if (this.isDisposed) {
            throw new DisposedError(
                'Shader',
                'uploadSourceCode',
                'Cannot upload source code to a disposed WebGL shader'
            );
        }
        if (this.native === null) {
            throw new StateError(
                'Shader',
                'uploadSourceCode',
                'Cannot upload source code to an invalid WebGL shader'
            );
        }
        this.context.native.shaderSource(this.native, sourceCode);
        const err = this.context.getError();
        if (err !== ErrorCode.NoError) {
            throw new OperationError(
                'uploadSourceCode',
                'An error occurred while uploading source code to a WebGL shader'
            );
        }
    }

    /**
     * Compile the source code uploaded to this instance.
     *
     * @throws `DisposedError`
     * Thrown if the instance is disposed.
     * @throws `StateError`
     * Thrown if the instance does not wrap a valid WebGL shader resource.
     * @throws `StateError`
     * Thrown if the instance does not have any source code uploaded to it.
     * @throws `OperationError`
     * Thrown if a WebGL error occurs during the operation.
     */
    public compile(): void {
        if (this.isDisposed) {
            throw new DisposedError(
                'Shader',
                'compile',
                'Cannot compile a disposed WebGL shader'
            );
        }
        if (this.native === null) {
            throw new StateError(
                'Shader',
                'compile',
                'Cannot compile an invalid WebGL shader'
            );
        }
        if (this.sourceCode === null) {
            throw new StateError(
                'Shader',
                'compile',
                'Cannot compile a WebGL shader with no source code'
            );
        }
        this.context.native.compileShader(this.native);
        const err = this.context.getError();
        if (err !== ErrorCode.NoError) {
            throw new OperationError(
                'compile',
                'An error occurred while compiling a WebGL shader'
            );
        }
    }
}
