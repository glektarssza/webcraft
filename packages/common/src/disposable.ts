/**
 * An interface for objects that manage some kind of resource that needs to be
 * disposed before the object is destroyed.
 */
export interface Disposable {
    /**
     * Whether this instance has been disposed.
     */
    readonly isDisposed: boolean;

    /**
     * Dispose of this instance.
     */
    dispose(): void;
}
