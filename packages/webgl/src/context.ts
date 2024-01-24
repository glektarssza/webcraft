import {Disposable} from 'webcraft-common';
import {ErrorCode} from './errorCode';
import {Resource, ValidWebGLResources} from './resource';

/**
 * A wrapper around a WebGL rendering context.
 */
export class Context implements Disposable {
    /**
     * Whether this instance has been disposed.
     */
    private _disposed: boolean;

    /**
     * An list of resources owned by this instance.
     */
    private readonly _resources: Resource<ValidWebGLResources>[];

    /**
     * The native WebGL rendering context wrapped by this instance.
     */
    public readonly native: WebGLRenderingContext;

    /**
     * An list of resources owned by this instance.
     */
    public get resources(): Resource<ValidWebGLResources>[] {
        return this._resources.slice();
    }

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
        this._resources = [];
    }

    /**
     * Get the last error that occurred.
     *
     * @returns An error code for the last error that occurred.
     */
    public getError(): ErrorCode {
        return this.native.getError();
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
        this._resources.forEach((resource) => {
            resource.dispose();
        });
        this._resources.length = 0;
        this._disposed = true;
    }
}
