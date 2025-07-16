/**
 * A module which provides logging level-related functionality.
 *
 * @module
 */

/**
 * The name of a logging level.
 */
export type LevelName = string | symbol;

/**
 * The value of a logging level.
 */
export type LevelValue = number | string;

/**
 * A mapping of {@link LevelName | LevelNames} to
 * {@link LevelValue | LevelValues}.
 */
export interface LevelMap {
    [key: LevelName]: LevelValue;
}

/**
 * A collection of some common logging levels.
 */
export const common = {
    /**
     * The logging levels used by `syslog`.
     */
    syslog: {
        emerg: 0,
        alert: 1,
        crit: 2,
        err: 3,
        warning: 4,
        notice: 5,
        info: 6,
        debug: 7
    } as LevelMap,

    /**
     * The logging levels used by `npm`.
     */
    npm: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6
    } as LevelMap,

    /**
     * An example set of logging levels for use by CLI programs.
     */
    cli: {
        error: 0,
        warn: 1,
        help: 2,
        data: 3,
        info: 4,
        debug: 5,
        prompt: 6,
        verbose: 7,
        input: 8,
        silly: 9
    } as LevelMap
};

/**
 * Get a list of available entries from a {@link LevelMap | logging level map}.
 *
 * An entry is defined as a tuple of a {@link LevelName | logging level name} and
 * a {@link LevelValue | logging level value}.
 *
 * @param map - The {@link LevelMap | logging level map} to get the entries from.
 *
 * @returns A list of entries.
 */
export function getEntries(map: LevelMap): [LevelName, LevelValue][] {
    return Reflect.ownKeys(map).map((key) => [key, map[key]!]);
}

/**
 * Get a list of available {@link LevelName | logging level names} from a
 * {@link LevelMap | logging level map}.
 *
 * @param map - The {@link LevelMap | logging level map} to get the
 * {@link LevelName | logging level names} from.
 *
 * @returns A list of available {@link LevelName | logging level names}.
 */
export function getNames(map: LevelMap): LevelName[] {
    return Reflect.ownKeys(map);
}

/**
 * Get a list of available {@link LevelValue | logging level values} from a
 * {@link LevelMap | logging level map}.
 *
 * @param map - The {@link LevelMap | logging level map} to get the
 * {@link LevelValue | logging level values} from.
 *
 * @returns A list of available {@link LevelValue | logging level values}.
 */
export function getValues(map: LevelMap): LevelValue[] {
    return Reflect.ownKeys(map).map((key) => map[key]!);
}

/**
 * Get the {@link LevelValue | logging level value} corresponding to the given
 * {@link LevelName | logging level name}.
 *
 * @param map - The {@link LevelMap | logging level map} to get the
 * {@link LevelValue | logging level value} from.
 * @param name - The {@link LevelName | logging level name} to get the
 * {@link LevelValue | logging level value} of.
 *
 * @returns The {@link LevelValue | logging level value} corresponding to the
 * given {@link LevelName | logging level name}.
 *
 * @throws `Error`
 * Thrown if there is no {@link LevelValue | logging level value} corresponding to
 * the {@link LevelName | logging level name}.
 */
export function getValue(map: LevelMap, name: LevelName): LevelValue {
    const r = map[name];
    if (r === undefined) {
        // TODO: Use a better error type
        throw new Error(`No such value for key '${name.toString()}'`);
    }
    return r;
}

/**
 * Try to get the {@link LevelValue | logging level value} corresponding to the
 * given {@link LevelName | logging level name}.
 *
 * @param map - The {@link LevelMap | logging level map} to try to get the
 * {@link LevelValue | logging level value} from.
 * @param name - The {@link LevelName | logging level name} to get the
 * {@link LevelValue | logging level value} of.
 *
 * @returns The {@link LevelValue | logging level value} corresponding to the
 * given {@link LevelName | logging level name} if there is one, `null` otherwise.
 */
export function tryGetValue(map: LevelMap, name: LevelName): LevelValue | null {
    return map[name] ?? null;
}

/**
 * Get the {@link LevelName | logging level name} corresponding to the given
 * {@link LevelValue | logging level value}.
 *
 * @param map - The {@link LevelMap | logging level map} to get the
 * {@link LevelValue | logging level value} from.
 * @param value - The {@link LevelValue | logging level value} to get the
 * {@link LevelName | logging level name} of.
 *
 * @returns The {@link LevelName | logging level name} corresponding to the
 * given {@link LevelValue | logging level value}.
 *
 * @throws `Error`
 * Thrown if there is no {@link LevelName | logging level name} corresponding to
 * the {@link LevelValue | logging level value}.
 */
export function getName(map: LevelMap, value: LevelValue): LevelName {
    const r = getEntries(map).find((v) => v[1] === value);
    if (r === undefined) {
        // TODO: Use a better error type
        throw new Error(`No such key for value '${value.toString()}'`);
    }
    return r[0];
}

/**
 * Try to get the {@link LevelName | logging level name} corresponding to the
 * given {@link LevelValue | logging level value}.
 *
 * @param map - The {@link LevelMap | logging level map} to try to get the
 * {@link LevelValue | logging level value} from.
 * @param value - The {@link LevelValue | logging level value} to get the
 * {@link LevelName | logging level name} of.
 *
 * @returns The {@link LevelName | logging level name} corresponding to the
 * given {@link LevelValue | logging level value} if there is one, `null`
 * otherwise.
 */
export function tryGetName(map: LevelMap, value: LevelValue): LevelName | null {
    return getEntries(map).find((v) => v[1] === value)?.[0] ?? null;
}
