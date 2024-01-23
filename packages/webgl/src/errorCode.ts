/**
 * An enumeration of known WebGL error codes.
 */
export enum ErrorCode {
    /**
     * No errors have occurred.
     */
    NoError = WebGLRenderingContext.NO_ERROR,

    /**
     * The given enumeration value was invalid.
     */
    InvalidEnum = WebGLRenderingContext.INVALID_ENUM,

    /**
     * The given value was invalid.
     */
    InvalidValue = WebGLRenderingContext.INVALID_VALUE,

    /**
     * The requested operation was invalid for the current state.
     */
    InvalidOperation = WebGLRenderingContext.INVALID_OPERATION,

    /**
     * The requested operation was invalid for the current framebuffer state.
     */
    InvalidFramebufferOperation = WebGLRenderingContext.INVALID_FRAMEBUFFER_OPERATION,

    /**
     * A memory allocation failed.
     */
    OutOfMemory = WebGLRenderingContext.OUT_OF_MEMORY,

    /**
     * The underlying WebGL rendering context has been lost.
     */
    ContextLost = WebGLRenderingContext.CONTEXT_LOST_WEBGL
}
