/**
 * A string representing the name of a severity level.
 */
export type SeverityName = string;

/**
 * A number representing the value of a severity level.
 */
export type SeverityValue = number;

/**
 * A severity level.
 */
export type Severity = SeverityName | SeverityValue;

/**
 * A mapping of severity names to severity values.
 */
export type SeverityMap = Record<SeverityName, SeverityValue>;

/**
 * Check if a value is a severity name.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is a severity name; `false` otherwise.
 */
export function isSeverityName(value: unknown): value is SeverityName {
    return typeof value === 'string';
}

/**
 * Check if a value is a severity value.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is a severity value; `false` otherwise.
 */
export function isSeverityValue(value: unknown): value is SeverityValue {
    return typeof value === 'number';
}

/**
 * Check if a value is a severity.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is a severity; `false` otherwise.
 */
export function isSeverity(value: unknown): value is Severity {
    return isSeverityName(value) || isSeverityValue(value);
}

/**
 * Get a severity value from a severity map.
 *
 * @param severity - The severity to get the value for.
 * @param severityScheme - The severity scheme to get the value from.
 *
 * @returns The severity value.
 *
 * @throws `Error`
 * Thrown if the severity scheme does not contain a value for the given
 * severity.
 */
export function getSeverityValue(
    severity: Severity,
    severityScheme: SeverityMap
): SeverityValue {
    if (isSeverityName(severity)) {
        const maybeValue = severityScheme[severity];
        if (isSeverityValue(maybeValue)) {
            return maybeValue;
        } else {
            throw new Error(
                `Severity scheme does not contain a value for severity "${severity}"`
            );
        }
    } else {
        return severity;
    }
}
