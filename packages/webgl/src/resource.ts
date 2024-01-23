//-- Project Code
import {Disposable} from 'webcraft-common';
import {Context} from './context';

/**
 * A type union of known and supported WebGL objects.
 */
export type ValidWebGLResources =
    | WebGLBuffer
    | WebGLTexture
    | WebGLShader
    | WebGLProgram;

/**
 * A wrapper around a WebGL resource.
 *
 * @typeParam T - The type of WebGL resource wrapped by the class.
 */
export abstract class Resource<T extends ValidWebGLResources>
    implements Disposable
{
    /**
     * Whether this instance has been disposed.
     */
    private _disposed: boolean;

    /**
     * The native WebGL resource wrapped by this instance.
     */
    protected _native: T | null;

    /**
     * The native WebGL resource wrapped by this instance.
     */
    public get native(): T | null {
        return this._native;
    }

    /**
     * The WebGL rendering context that owns this instance.
     */
    public readonly context: Context;

    /**
     * Whether this instance has been disposed.
     */
    public get isDisposed(): boolean {
        return this._disposed;
    }

    /**
     * Whether this instance wraps a valid WebGL resource.
     */
    public get isValid(): boolean {
        return !this.isDisposed && this.native !== null;
    }

    /**
     * Create a new instance.
     *
     * @param context - The WebGL rendering context that will own the new
     * instance.
     */
    protected constructor(context: Context) {
        this.context = context;
        this._native = null;
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
        this._native = null;
        this._disposed = true;
    }
}
