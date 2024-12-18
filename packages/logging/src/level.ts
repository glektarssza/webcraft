/**
 * A module which provides functionality related to logging levels.
 *
 * @module
 */

/**
 * A collection of internal functions this module declares.
 *
 * Provided for use in unit tests in order to stub/mock internal functions.
 *
 * @internal
 */
export const internals = {
    hasLevelName,
    hasLevelValue,
    hasLevel,
    tryGetLevelNameFromValue,
    getLevelNameFromValue,
    tryGetLevelValueFromName,
    getLevelValueFromName
};

/**
 * A collection of external functions this module depends on.
 *
 * Provided for use in unit tests in order to stub/mock external functions.
 *
 * @internal
 */
export const externals = {};

/**
 * The name of a logging level.
 */
export type LevelName = string;

/**
 * The value of a logging level.
 */
export type LevelValue = number;

/**
 * A logging level.
 */
export type Level = LevelName | LevelValue;

/**
 * A mapping of logging level names to their values.
 */
export type LevelMap = Record<LevelName, LevelValue>;

/**
 * Check if a {@link LevelMap} has a given {@link LevelName}.
 *
 * @param map - The {@link LevelMap} to check.
 * @param name - The {@link LevelName} to look for.
 *
 * @returns `true` if the {@link LevelName} exists in the {@link LevelMap};
 * `false` otherwise.
 */
export function hasLevelName(map: LevelMap, name: LevelName): boolean {
    return Object.keys(map).includes(name);
}

/**
 * Check if a {@link LevelMap} has a given {@link LevelValue}.
 *
 * @param map - The {@link LevelMap} to check.
 * @param name - The {@link LevelValue} to look for.
 *
 * @returns `true` if the {@link LevelValue} exists in the {@link LevelMap};
 * `false` otherwise.
 */
export function hasLevelValue(map: LevelMap, value: LevelValue): boolean {
    return Object.values(map).includes(value);
}

/**
 * Check if a {@link LevelMap} has a given {@link Level}.
 *
 * @param map - The {@link LevelMap} to check.
 * @param name - The {@link Level} to look for.
 *
 * @returns `true` if the {@link Level} exists in the {@link LevelMap};
 * `false` otherwise.
 */
export function hasLevel(map: LevelMap, level: Level): boolean {
    if (typeof level === 'string') {
        return internals.hasLevelName(map, level);
    }
    return internals.hasLevelValue(map, level);
}

/**
 * Try to get the name of a logging level from a logging level value.
 *
 * @param map - The {@link LevelMap} to query for a {@link LevelName}.
 * @param value - The {@link LevelValue} to search for a {@link LevelName} for.
 *
 * @returns A {@link LevelName} that corresponds to the {@link LevelValue}
 * given; `null` otherwise.
 */
export function tryGetLevelNameFromValue(
    map: LevelMap,
    value: LevelValue
): LevelName | null {
    return (Object.entries(map).find(([, v]) => v === value) ?? [
        null,
        null
    ])[0];
}

/**
 * Get the name of a logging level from a logging level value.
 *
 * @param map - The {@link LevelMap} to query for a {@link LevelName}.
 * @param value - The {@link LevelValue} to search for a {@link LevelName} for.
 *
 * @returns A {@link LevelName} that corresponds to the {@link LevelValue}
 * given.
 *
 * @throws `Error`
 * Thrown if no {@link LevelName} could be found.
 */
export function getLevelNameFromValue(
    map: LevelMap,
    value: LevelValue
): LevelName {
    const r = internals.tryGetLevelNameFromValue(map, value);
    if (r === null) {
        throw new Error(
            `Could not find logging level name for logging level value "${value}"`
        );
    }
    return r;
}

/**
 * Try to get the value of a logging level from a logging level name.
 *
 * @param map - The {@link LevelMap} to query for a {@link LevelValue}.
 * @param name - The {@link LevelName} to search for a {@link LevelValue} for.
 *
 * @returns A {@link LevelValue} that corresponds to the {@link LevelName}
 * given; `null` otherwise.
 */
export function tryGetLevelValueFromName(
    map: LevelMap,
    name: LevelName
): LevelValue | null {
    return (Object.entries(map).find(([n]) => n === name) ?? [null, null])[1];
}

/**
 * Get the value of a logging level from a logging level name.
 *
 * @param map - The {@link LevelMap} to query for a {@link LevelValue}.
 * @param name - The {@link LevelName} to search for a {@link LevelValue} for.
 *
 * @returns A {@link LevelValue} that corresponds to the {@link LevelName}
 * given.
 *
 * @throws `Error`
 * Thrown if no {@link LevelValue} could be found.
 */
export function getLevelValueFromName(
    map: LevelMap,
    name: LevelName
): LevelValue {
    const r = internals.tryGetLevelValueFromName(map, name);
    if (r === null) {
        throw new Error(
            `Could not find logging level value for logging level name "${name}"`
        );
    }
    return r;
}
