/**
 * A module which provides functionality related to logging events.
 *
 * @module
 */

import {type Namespace} from './namespace';

/**
 * A record of some logging event.
 */
export interface LogRecordBase {
    /**
     * The timestamp at which the event occurred.
     */
    readonly timestamp: Date;

    /**
     * The namespace which the event occurred within.
     */
    readonly namespace: Namespace;

    /**
     * The message which the event was sent with.
     */
    readonly message: string;

    /**
     * The {@link message} property after formatting has been applied.
     */
    readonly formattedMessage?: string;
}

/**
 * A record of some logging event which has been formatted.
 */
export interface FormattedLogRecord extends LogRecordBase {
    /**
     * The {@link message} property after formatting has been applied.
     */
    readonly formattedMessage: string;
}

/**
 * A type union of all logging event records.
 */
export type LogRecord = FormattedLogRecord | LogRecordBase;
