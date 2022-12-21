/**
 * The root component type.
 */
export interface Component {
    /**
     * The type of this instance.
     */
    readonly type: string;

    /**
     * Update this instance.
     *
     * @param delta - The time, in milliseconds, since the last update.
     */
    update(delta: number): void;
}
