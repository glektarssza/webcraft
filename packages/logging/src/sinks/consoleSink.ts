/**
 * A module which provides a {@link Sink | Sink} which outputs to the
 * standard `console` implementation.
 *
 * @module
 */

import {LogRecord} from '../record';
import {Sink} from '../sink';

/**
 * A {@link Sink | Sink} that outputs to the standard `console`
 * implementation.
 */
export class ConsoleSink extends Sink {
    /**
     * @inheritdoc
     */
    public override tryWrite(record: LogRecord): boolean {
        console.log(
            record.formattedMessage !== undefined
                ? record.formattedMessage
                : record.message
        );
        return true;
    }
}
