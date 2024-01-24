/**
 * An enumeration of known usage hints for a {@link Buffer | buffer}.
 */
export enum BufferUsageHint {
    /**
     * The `STREAM_DRAW` usage hint.
     */
    StreamDraw = WebGLRenderingContext.STREAM_DRAW,

    /**
     * The `STATIC_DRAW` usage hint.
     */
    StaticDraw = WebGLRenderingContext.STATIC_DRAW,

    /**
     * The `DYNAMIC_DRAW` usage hint.
     */
    DynamicDraw = WebGLRenderingContext.DYNAMIC_DRAW
}
