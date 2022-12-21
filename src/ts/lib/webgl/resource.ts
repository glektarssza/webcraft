import {Disposable} from '..';
import {WebGLObject} from '.';

export abstract class Resource<
    TNative extends WebGLObject,
    TParams extends unknown[] = []
> implements Disposable
{
    /**
     * Whether this instance has been disposed.
     */
    private _disposed: boolean;

    /**
     * The native WebGL resource.
     */
    private _native: TNative | null;

    /**
     * The WebGL rendering context this instance belongs to.
     */
    public readonly context: WebGLRenderingContext;

    /**
     * The native WebGL resource.
     */
    public get native(): TNative | null {
        return this._native;
    }

    /**
     * Whether this instance has been disposed.
     */
    public get isDisposed(): boolean {
        return this._disposed;
    }

    /**
     * Creates a new instance.
     *
     * @param context - The WebGL rendering context this instance will belong
     * to.
     * @param params - The parameters to pass to the native WebGL resource
     * factory function.
     *
     * @throws Throws an {@link Error} if the native WebGL resource fails to be
     * created.
     */
    protected constructor(context: WebGLRenderingContext, ...params: TParams) {
        this._disposed = false;
        this.context = context;
        this._native = this._createNative(...params);
        if (this._native === null) {
            throw new Error('Failed to create native WebGL resource');
        }
    }

    /**
     * Dispose this instance.
     */
    public dispose(): void {
        if (this.isDisposed) {
            return;
        }
        if (this._native !== null) {
            this._deleteNative();
            this._native = null;
        }
        this._disposed = true;
    }

    /**
     * Create the native WebGL resource that will be wrapped by this instance.
     *
     * @param params - The parameters to pass to the native WebGL resource
     * factory function.
     *
     * @returns The new native WebGL resource on success, `null` on failure.
     */
    protected abstract _createNative(...params: TParams): TNative | null;

    /**
     * Destroy the native WebGL resource wrapped by this instance.
     */
    protected abstract _deleteNative(): void;
}
