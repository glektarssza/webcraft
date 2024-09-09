//-- Project Code
import {Metadata} from './metadata';
import {Namespace} from './namespace';
import {getSeverityValue, Severity, SeverityMap} from './severity';

/**
 * A class that can be used to output events that are occurring in a given
 * namespace.
 */
export class Logger {
    /**
     * The namespace for which events are being output.
     */
    public readonly namespace: Namespace;

    /**
     * The maximum severity that will be output.
     */
    public severity: Severity;

    /**
     * The severity scheme being used by this instance.
     */
    public readonly severityScheme: SeverityMap;

    /**
     * The default metadata to attach to all logging events coming from this
     * instance.
     */
    public readonly defaultMetadata: Metadata;

    /**
     * Create a new instance.
     *
     * @param namespace - The namespace for which events will be output.
     * @param severity - The maximum severity that will be output.
     * @param severityScheme - The severity scheme that will be used by the new
     * instance.
     */
    public constructor(
        namespace: Namespace,
        severity: Severity = 'info',
        severityScheme: SeverityMap = {},
        defaultMetadata: Metadata = {}
    ) {
        this.namespace = namespace;
        this.severity = severity;
        this.severityScheme = severityScheme;
        this.defaultMetadata = defaultMetadata;
    }

    /**
     * Log a message with the given severity.
     *
     * @param severity - The severity of the message to log.
     * @param message - The message to log.
     * @param metadata - Metadata to attach to the log entry.
     */
    public log(
        severity: Severity,
        message: string,
        metadata: Metadata = {}
    ): void {
        const severityValue = getSeverityValue(severity, this.severityScheme);
        const loggerSeverityValue = getSeverityValue(
            this.severity,
            this.severityScheme
        );
        if (severityValue < loggerSeverityValue) {
            return;
        }
        const mergedMetadata = {
            ...this.defaultMetadata,
            ...metadata
        };
        // TODO: Format
        // TODO: Pass to sinks
        console.log(message);
        console.log(mergedMetadata);
    }

    /**
     * Log an error message.
     *
     * @param message - The message to log.
     * @param metadata - Metadata to attach to the log entry.
     */
    public error(message: string, metadata: Metadata = {}): void {
        this.log('error', message, metadata);
    }

    /**
     * Log a warning message.
     *
     * @param message - The message to log.
     * @param metadata - Metadata to attach to the log entry.
     */
    public warn(message: string, metadata: Metadata = {}): void {
        this.log('warn', message, metadata);
    }

    /**
     * Log an informational message.
     *
     * @param message - The message to log.
     * @param metadata - Metadata to attach to the log entry.
     */
    public info(message: string, metadata: Metadata = {}): void {
        this.log('info', message, metadata);
    }

    /**
     * Log a debug message.
     *
     * @param message - The message to log.
     * @param metadata - Metadata to attach to the log entry.
     */
    public debug(message: string, metadata: Metadata = {}): void {
        this.log('debug', message, metadata);
    }

    /**
     * Log a tracing message.
     *
     * @param message - The message to log.
     * @param metadata - Metadata to attach to the log entry.
     */
    public trace(message: string, metadata: Metadata = {}): void {
        this.log('trace', message, metadata);
    }
}
