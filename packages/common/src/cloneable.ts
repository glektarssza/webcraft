/**
 * An interface for objects that can be cloned.
 */
export interface Cloneable {
    /**
     * Clone this instance.
     *
     * @returns A clone of this instance.
     */
    clone(): ThisType<this>;
}
