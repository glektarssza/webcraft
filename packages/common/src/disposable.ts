/**
 * An interface for objects that manage some kind of resource that must be
 * released before the object can be garbage collected.
 */
export interface Disposable {
    /**
     * Whether this instance has been disposed.
     */
    readonly isDisposed: boolean;

    /**
     * Dispose of this instance and release any resources it is managing.
     *
     * This method, is possible, should not throw any errors.
     */
    dispose(): void;
}
