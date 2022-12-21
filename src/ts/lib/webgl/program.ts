import {AttributeInfo, Resource, Shader, UniformInfo} from '.';

export class Program extends Resource<WebGLProgram> {
    /**
     * The shaders currently attached to this instance.
     */
    private readonly _shaders: Set<Shader>;

    /**
     * The attributes currently defined in this instance.
     */
    private readonly _attributeMap: Map<string, AttributeInfo>;

    /**
     * The uniforms currently defined in this instance.
     */
    private readonly _uniformMap: Map<string, UniformInfo>;

    /**
     * A shallow copy of the list of shaders currently attached to this
     * instance.
     */
    public get shaders(): Shader[] {
        return Array.from(this._shaders.values());
    }

    /**
     * The attributes defined on this instance.
     */
    public get attributes(): AttributeInfo[] {
        return Array.from(this._attributeMap.values());
    }

    /**
     * The names of the attributes defined on this instance.
     */
    public get attributeNames(): string[] {
        return Array.from(this._attributeMap.keys());
    }

    /**
     * The uniforms defined on this instance.
     */
    public get uniforms(): UniformInfo[] {
        return Array.from(this._uniformMap.values());
    }

    /**
     * The names of the uniforms defined on this instance.
     */
    public get uniformNames(): string[] {
        return Array.from(this._uniformMap.keys());
    }

    /**
     * The information log from the last attempt to link the instance.
     */
    public get infoLog(): string | null {
        if (this.isDisposed) {
            return null;
        }
        if (this.native === null) {
            return null;
        }
        return this.context.getProgramInfoLog(this.native);
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
        return this.context.getProgramParameter(
            this.native,
            WebGLRenderingContext.LINK_STATUS
        ) as boolean;
    }

    /**
     * Whether this instance is currently active.
     */
    public get isActive(): boolean {
        if (this.isDisposed) {
            return false;
        }
        if (this.native === null) {
            return false;
        }
        return (
            this.context.getParameter(WebGLRenderingContext.CURRENT_PROGRAM) ===
            this.native
        );
    }

    /**
     * Create a new instance.
     *
     * @param context - The context the instance will belong to.
     *
     * @throws Throws an {@link Error} if the native WebGL resource fails to be
     * created.
     */
    public constructor(context: WebGLRenderingContext) {
        super(context);
        this._shaders = new Set<Shader>();
        this._attributeMap = new Map<string, AttributeInfo>();
        this._uniformMap = new Map<string, UniformInfo>();
    }

    /**
     * Check whether this instance has a shader attached to it.
     *
     * @param shader - The shader to check for.
     *
     * @returns `true` if the shader is attached to this instance, `false`
     * otherwise.
     */
    public hasAttachedShader(shader: Shader): boolean {
        return this._shaders.has(shader);
    }

    /**
     * Attach a shader to this instance.
     *
     * @param shader - The shader to attach.
     *
     * @returns This instance for chaining.
     *
     * @throws Throws an {@link Error} if the instance has been disposed.
     * @throws Throws an {@link Error} if the instance is invalid.
     * @throws Throws an {@link Error} if the shader has been disposed.
     * @throws Throws an {@link Error} if the shader is invalid.
     * @throws Throws an {@link Error} if the a WebGL error occurs.
     */
    public attachShader(shader: Shader): this {
        if (this.isDisposed) {
            throw new Error('Cannot attach shader to disposed program');
        }
        if (this.native === null) {
            throw new Error('Cannot attach shader to an invalid program');
        }
        if (shader.isDisposed) {
            throw new Error('Cannot attach disposed shader to program');
        }
        if (shader.native === null) {
            throw new Error('Cannot attach an invalid shader to program');
        }
        if (this.hasAttachedShader(shader)) {
            return this;
        }
        this.context.attachShader(this.native, shader.native);
        const err = this.context.getError();
        if (err !== WebGLRenderingContext.NO_ERROR) {
            throw new Error(`Failed to attach shader to program: ${err}`);
        }
        this._shaders.add(shader);
        return this;
    }

    /**
     * Detach a shader from this instance.
     *
     * @param shader - The shader to detach.
     *
     * @returns This instance for chaining.
     *
     * @throws Throws an {@link Error} if the instance has been disposed.
     * @throws Throws an {@link Error} if the instance is invalid.
     * @throws Throws an {@link Error} if the shader has been disposed.
     * @throws Throws an {@link Error} if the shader is invalid.
     * @throws Throws an {@link Error} if the a WebGL error occurs.
     */
    public detachShader(shader: Shader): this {
        if (this.isDisposed) {
            throw new Error('Cannot detach shader from a disposed program');
        }
        if (this.native === null) {
            throw new Error('Cannot detach shader from an invalid program');
        }
        if (shader.isDisposed) {
            throw new Error('Cannot detach a disposed shader from program');
        }
        if (shader.native === null) {
            throw new Error('Cannot detach an invalid shader from program');
        }
        if (!this.hasAttachedShader(shader)) {
            return this;
        }
        this.context.detachShader(this.native, shader.native);
        const err = this.context.getError();
        if (err !== WebGLRenderingContext.NO_ERROR) {
            throw new Error(`Failed to detach shader from program: ${err}`);
        }
        this._shaders.delete(shader);
        return this;
    }

    /**
     * Link this instance.
     *
     * @returns This instance for chaining.
     *
     * @throws Throws an {@link Error} if the instance has been disposed.
     * @throws Throws an {@link Error} if the instance is invalid.
     * @throws Throws an {@link Error} if the instance has no attached shaders.
     * @throws Throws an {@link Error} if the a WebGL error occurs.
     * @throws Throws an {@link Error} if the instance fails to link.
     */
    public link(): this {
        if (this.isDisposed) {
            throw new Error('Cannot link a disposed program');
        }
        if (this.native === null) {
            throw new Error('Cannot link an invalid program');
        }
        if (this._shaders.size <= 0) {
            throw new Error('Cannot link program with no shaders attached');
        }
        this.context.linkProgram(this.native);
        const err = this.context.getError();
        if (err !== WebGLRenderingContext.NO_ERROR) {
            throw new Error(`Failed to link program: ${err}`);
        }
        if (!this.isLinked) {
            throw new Error(
                `Failed to link program: ${this.infoLog ?? 'no info log'}`
            );
        }
        this._buildAttributeMap();
        this._buildUniformMap();
        return this;
    }

    /**
     * Activate this instance.
     *
     * @returns This instance for chaining.
     *
     * @throws Throws an {@link Error} if the instance has been disposed.
     * @throws Throws an {@link Error} if the instance is invalid.
     * @throws Throws an {@link Error} if the instance is not linked.
     * @throws Throws an {@link Error} if the a WebGL error occurs.
     */
    public activate(): this {
        if (this.isDisposed) {
            throw new Error('Cannot activate a disposed program');
        }
        if (this.native === null) {
            throw new Error('Cannot activate an invalid program');
        }
        if (!this.isLinked) {
            throw new Error('Cannot activate an unlinked program');
        }
        if (this.isActive) {
            return this;
        }
        this.context.useProgram(this.native);
        const err = this.context.getError();
        if (err !== WebGLRenderingContext.NO_ERROR) {
            throw new Error(`Failed to activate program: ${err}`);
        }
        return this;
    }

    /**
     * Deactivate this instance.
     *
     * @returns This instance for chaining.
     *
     * @throws Throws an {@link Error} if the instance has been disposed.
     * @throws Throws an {@link Error} if the instance is invalid.
     * @throws Throws an {@link Error} if the instance is not linked.
     * @throws Throws an {@link Error} if the a WebGL error occurs.
     */
    public deactivate(): this {
        if (this.isDisposed) {
            throw new Error('Cannot deactivate a disposed program');
        }
        if (this.native === null) {
            throw new Error('Cannot deactivate an invalid program');
        }
        if (!this.isLinked) {
            throw new Error('Cannot deactivate an unlinked program');
        }
        if (!this.isActive) {
            return this;
        }
        this.context.useProgram(null);
        const err = this.context.getError();
        if (err !== WebGLRenderingContext.NO_ERROR) {
            throw new Error(`Failed to deactivate program: ${err}`);
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
    protected _createNative(): WebGLProgram | null {
        return this.context.createProgram();
    }

    /**
     * Destroy the native WebGL resource wrapped by this instance.
     */
    protected _deleteNative(): void {
        this.context.deleteProgram(this.native);
        this._shaders.clear();
        this._attributeMap.clear();
        this._uniformMap.clear();
    }

    /**
     * Build the map of attributes available on this instance.
     */
    private _buildAttributeMap(): void {
        if (this.native === null) {
            throw new Error(
                'Cannot build attribute map for an invalid program'
            );
        }
        this._attributeMap.clear();
        const oldProgram = this.context.getParameter(
            WebGLRenderingContext.CURRENT_PROGRAM
        ) as WebGLProgram | null;
        if (oldProgram !== this.native) {
            this.context.useProgram(this.native);
        }
        const numAttributes = this.context.getProgramParameter(
            this.native,
            WebGLRenderingContext.ACTIVE_ATTRIBUTES
        ) as number;
        for (let i = 0; i < numAttributes; i++) {
            const info = this.context.getActiveAttrib(this.native, i);
            if (info === null) {
                continue;
            }
            this._attributeMap.set(info.name, {
                name: info.name,
                location: this.context.getAttribLocation(
                    this.native,
                    info.name
                ),
                size: info.size,
                type: info.type
            });
        }
        if (oldProgram !== this.native) {
            this.context.useProgram(oldProgram);
        }
    }

    /**
     * Build the map of uniforms available on this instance.
     */
    private _buildUniformMap(): void {
        if (this.native === null) {
            throw new Error(
                'Cannot build attribute map for an invalid program'
            );
        }
        this._uniformMap.clear();
        const oldProgram = this.context.getParameter(
            WebGLRenderingContext.CURRENT_PROGRAM
        ) as WebGLProgram | null;
        if (oldProgram !== this.native) {
            this.context.useProgram(this.native);
        }
        const numAttributes = this.context.getProgramParameter(
            this.native,
            WebGLRenderingContext.ACTIVE_UNIFORMS
        ) as number;
        for (let i = 0; i < numAttributes; i++) {
            const info = this.context.getActiveUniform(this.native, i);
            if (info === null) {
                continue;
            }
            this._uniformMap.set(info.name, {
                name: info.name,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                location: this.context.getUniformLocation(
                    this.native,
                    info.name
                )!,
                size: info.size,
                type: info.type
            });
        }
        if (oldProgram !== this.native) {
            this.context.useProgram(oldProgram);
        }
    }
}
