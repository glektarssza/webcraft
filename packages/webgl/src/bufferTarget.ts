/**
 * An enumeration of known targets a {@link Buffer | buffer} can bind to.
 */
export enum BufferTarget {
    /**
     * The `ARRAY_BUFFER` target.
     */
    ArrayBuffer = WebGLRenderingContext.ARRAY_BUFFER,

    /**
     * The `ELEMENT_ARRAY_BUFFER` target.
     */
    ElementArrayBuffer = WebGLRenderingContext.ELEMENT_ARRAY_BUFFER
}
