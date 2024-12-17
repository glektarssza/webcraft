/**
 * A module which provides functionality related to destinations for logging
 * events.
 *
 * @module
 */

import {type LogRecord} from './record';

/**
 * A destination for logging events.
 */
export abstract class Sink {
    /**
     * Try to write the given log event record to the destination.
     *
     * @param record - The record of the logging event to write.
     *
     * @returns `true` if the logging event was written successfully; `false`
     * otherwise.
     */
    public abstract tryWrite(record: LogRecord): boolean;

    /**
     * Write the given log event record to the destination.
     *
     * @param record - The record of the logging event to write.
     *
     * @throws `Error`
     * Thrown if the logging event could not be written.
     */
    public write(record: LogRecord): void {
        if (!this.tryWrite(record)) {
            throw new Error('Failed to write logging event to destination');
        }
    }

    /**
     * Write the given log event record to the destination asynchronously.
     *
     * @param record - The record of the logging event to write.
     *
     * @returns A promise that resolves once the logging event has been written
     * or rejects if any errors occur.
     */
    public writeAsync?(record: LogRecord): Promise<void>;
}
