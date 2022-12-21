/**
 * An interface for disposable objects.
 */
export interface Disposable {
    /**
     * Whether this instance has been disposed.
     */
    readonly isDisposed: boolean;

    /**
     * Dispose this instance.
     */
    dispose(): void;
}
