/**
 * A module which provides a `syslog`-style logging level map.
 *
 * @module
 */

import {LevelMap} from '../level';

/**
 * The logging level map.
 */
const LOG_LEVEL_MAP: LevelMap = {
    emerg: 0,
    alert: 1,
    crit: 2,
    err: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7
};

export default LOG_LEVEL_MAP;
