/**
 * A module which provides functionality related to logging namespaces.
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
export const internals = {};

/**
 * A collection of external functions this module depends on.
 *
 * Provided for use in unit tests in order to stub/mock external functions.
 *
 * @internal
 */
export const externals = {};

/**
 * A representation of a grouping of logically related logging output.
 */
export type Namespace = string;

/**
 * A component of a {@link Namespace}.
 */
export type NamespaceComponent = string;

/**
 * An array of {@link NamespaceComponent | NamespaceComponents}.
 */
export type NamespaceComponentArray = NamespaceComponent[];

/**
 * A string which is used to separate the
 * {@link NamespaceComponent | NamespaceComponents} in a {@link Namespace}.
 */
export const NAMESPACE_COMPONENT_SEPARATOR = ':';

/**
 * A string which represents a wildcard within a {@link NamespaceComponent}.
 *
 * During namespace component matching, a wildcard will match any number of
 * characters. It is effectively equal to the regular expression `.*`.
 */
export const NAMESPACE_WILDCARD = '*';

/**
 * Check whether a value is a {@link Namespace}.
 *
 * @param value - The value to check.
 *
 * @returns Whether the value is a {@link Namespace}.
 */
export function isNamespace(value: unknown): value is Namespace {
    return typeof value === 'string';
}

/**
 * Check whether a value is a {@link NamespaceComponent}.
 *
 * @param value - The value to check.
 *
 * @returns Whether the value is a {@link NamespaceComponent}.
 */
export function isNamespaceComponent(
    value: unknown
): value is NamespaceComponent {
    return (
        typeof value === 'string' &&
        !value.includes(NAMESPACE_COMPONENT_SEPARATOR)
    );
}

/**
 * Check whether a value is a {@link NamespaceComponentArray}.
 *
 * @param value - The value to check.
 *
 * @returns Whether the value is a {@link NamespaceComponentArray}.
 */
export function isNamespaceComponentArray(
    value: unknown
): value is NamespaceComponentArray {
    return (
        typeof value === 'object' &&
        Array.isArray(value) &&
        value.every(isNamespaceComponent)
    );
}
