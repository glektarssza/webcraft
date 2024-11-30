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
export const internals = {
    isNamespace,
    isNamespaceComponent,
    isNamespaceComponentArray,
    createEmptyNamespace,
    createWildcardNamespace,
    createNamespaceFromComponents,
    createNamespaceFromComponentArray
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
        value.every(internals.isNamespaceComponent)
    );
}

/**
 * Create a new, empty {@link Namespace}.
 *
 * @returns The new, empty {@link Namespace}.
 */
export function createEmptyNamespace(): Namespace {
    return '';
}

/**
 * Create a new, purely wildcard {@link Namespace}.
 *
 * @returns The new, purely wildcard {@link Namespace}.
 */
export function createWildcardNamespace(): Namespace {
    return NAMESPACE_WILDCARD;
}

/**
 * Create a new {@link Namespace} from a collection of
 * {@link NamespaceComponent | NamespaceComponents}.
 *
 * @param components - The {@link NamespaceComponent | NamespaceComponents} to
 * create the new {@link Namespace} from.
 *
 * @returns The new {@link Namespace}.
 */
export function createNamespaceFromComponents(
    ...components: NamespaceComponent[]
): Namespace {
    return components.join(NAMESPACE_COMPONENT_SEPARATOR);
}

/**
 * Create a new {@link Namespace} from a {@link NamespaceComponentArray}.
 *
 * @param components - The {@link NamespaceComponentArray} to create the new
 * {@link Namespace} from.
 *
 * @returns The new {@link Namespace}.
 */
export function createNamespaceFromComponentArray(
    components: NamespaceComponentArray
): Namespace {
    return components.join(NAMESPACE_COMPONENT_SEPARATOR);
}

/**
 * Split a {@link Namespace} into an array of
 * {@link NamespaceComponent | NamespaceComponents}.
 *
 * @param namespace - The {@link Namespace} to split.
 *
 * @returns The array of {@link NamespaceComponent | NamespaceComponents}.
 */
export function splitNamespace(namespace: Namespace): NamespaceComponentArray {
    if (namespace === '') {
        return [];
    }
    return namespace.split(NAMESPACE_COMPONENT_SEPARATOR);
}
