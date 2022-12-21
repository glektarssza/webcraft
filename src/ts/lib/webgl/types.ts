/**
 * Types of WebGL objects.
 */
export type WebGLObject =
    | WebGLBuffer
    | WebGLProgram
    | WebGLShader
    | WebGLTexture;

/**
 * Information about a shader program attribute.
 */
export interface AttributeInfo {
    /**
     * The name of the attribute.
     */
    readonly name: string;

    /**
     * The location of the attribute.
     */
    readonly location: number;

    /**
     * The size of the attribute.
     */
    readonly size: number;

    /**
     * The type of the attribute.
     */
    readonly type: GLenum;
}

/**
 * Information about a shader program uniform.
 */
export interface UniformInfo {
    /**
     * The name of the uniform.
     */
    readonly name: string;

    /**
     * The location of the uniform.
     */
    readonly location: WebGLUniformLocation;

    /**
     * The size of the uniform.
     */
    readonly size: number;

    /**
     * The type of the uniform.
     */
    readonly type: GLenum;
}
