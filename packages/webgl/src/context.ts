import {Disposable} from 'webcraft-common';

/**
 * A wrapper around a WebGL rendering context.
 */
export class Context implements Disposable {
    /**
     * Whether this instance has been disposed.
     */
    private _disposed: boolean;

    /**
     * The native WebGL rendering context wrapped by this instance.
     */
    public readonly native: WebGLRenderingContext;

    /**
     * Whether this instance has been lost.
     */
    public get isLost(): boolean {
        return this.native.isContextLost();
    }

    /**
     * Whether this instance has been disposed.
     */
    public get isDisposed(): boolean {
        return this._disposed;
    }

    /**
     * Create a new instance.
     *
     * @param native - The native WebGL rendering context that will be wrapped
     * by the new instance.
     */
    public constructor(native: WebGLRenderingContext) {
        this.native = native;
        this._disposed = false;
    }

    /**
     * Dispose of this instance and release any resources it is managing.
     *
     * This method, is possible, should not throw any errors.
     */
    public dispose(): void {
        if (this.isDisposed) {
            return;
        }
        // TODO
        this._disposed = true;
    }
}
