import {Resource} from '.';

export enum ShaderType {
    /**
     * The `VERTEX_SHADER` type.
     */
    VERTEX_SHADER = WebGLRenderingContext.VERTEX_SHADER,

    /**
     * The `FRAGMENT_SHADER` type.
     */
    FRAGMENT_SHADER = WebGLRenderingContext.FRAGMENT_SHADER
}

export class Shader extends Resource<WebGLShader, [ShaderType]> {
    /**
     * The source code currently uploaded to this instance.
     */
    private _source: string | null;

    /**
     * The type of the instance.
     */
    public readonly type: ShaderType;

    /**
     * The source code currently uploaded to this instance.
     */
    public get source(): string | null {
        return this._source;
    }

    /**
     * The information log from the last attempt to compile the instance.
     */
    public get infoLog(): string | null {
        if (this.isDisposed) {
            return null;
        }
        if (this.native === null) {
            return null;
        }
        return this.context.getShaderInfoLog(this.native);
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
        return this.context.getShaderParameter(
            this.native,
            WebGLRenderingContext.COMPILE_STATUS
        ) as boolean;
    }

    /**
     * Create a new instance.
     *
     * @param context - The context the instance will belong to.
     * @param type - The type of shader to create.
     *
     * @throws Throws an {@link Error} if the native WebGL resource fails to be
     * created.
     */
    public constructor(context: WebGLRenderingContext, type: ShaderType) {
        super(context, type);
        this._source = null;
        this.type = type;
    }

    /**
     * Upload the source code to this instance.
     *
     * @param source - The source code to upload.
     *
     * @returns This instance for chaining.
     *
     * @throws Throws an {@link Error} if the instance has been disposed.
     * @throws Throws an {@link Error} if the instance is invalid.
     * @throws Throws an {@link Error} if the a WebGL error occurs.
     */
    public uploadSource(source: string): this {
        if (this.isDisposed) {
            throw new Error('Cannot upload source to a disposed shader');
        }
        if (this.native === null) {
            throw new Error('Cannot upload source to an invalid shader');
        }
        this.context.shaderSource(this.native, source);
        const err = this.context.getError();
        if (err !== WebGLRenderingContext.NO_ERROR) {
            throw new Error(`Failed to upload shader source: ${err}`);
        }
        this._source = source;
        return this;
    }

    /**
     * Compile this instance.
     *
     * @returns This instance for chaining.
     *
     * @throws Throws an {@link Error} if the instance has been disposed.
     * @throws Throws an {@link Error} if the instance is invalid.
     * @throws Throws an {@link Error} if the instance has no source.
     * @throws Throws an {@link Error} if the a WebGL error occurs.
     * @throws Throws an {@link Error} if the instance fails to compile.
     */
    public compile(): this {
        if (this.isDisposed) {
            throw new Error('Cannot compile a disposed shader');
        }
        if (this.native === null) {
            throw new Error('Cannot compile an invalid shader');
        }
        if (this._source === null) {
            throw new Error('Cannot compile a shader without source');
        }
        this.context.compileShader(this.native);
        const err = this.context.getError();
        if (err !== WebGLRenderingContext.NO_ERROR) {
            throw new Error(`Failed to compile shader: ${err}`);
        }
        if (!this.isCompiled) {
            throw new Error(
                `Failed to compile shader: ${this.infoLog ?? 'no info log'}`
            );
        }
        return this;
    }

    /**
     * Create the native WebGL resource that will be wrapped by this instance.
     *
     * @param type - The type of shader to create.
     *
     * @returns The new native WebGL resource on success, `null` on failure.
     */
    protected _createNative(type: ShaderType): WebGLShader | null {
        return this.context.createShader(type);
    }

    /**
     * Destroy the native WebGL resource wrapped by this instance.
     */
    protected _deleteNative(): void {
        this.context.deleteShader(this.native);
        this._source = null;
    }
}
