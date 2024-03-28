/**
 * An interface for objects that manage some kind of resource that needs to be
 * released before the object is done being used.
 */
export interface Disposable {
    /**
     * Whether this instance has been disposed.
     */
    readonly isDisposed: boolean;

    /**
     * Release the resource(s) managed by this instance.
     */
    dispose(): void;
}
