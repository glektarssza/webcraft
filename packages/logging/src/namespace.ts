/**
 * A module which provides logging namespace-related functionality.
 *
 * @module
 */

/**
 * A string that represents a component of a
 * {@link Namespace | logging namespace}.
 */
export type NamespaceComponent = string;

/**
 * A string that represents a grouping for which events or message are being
 * logged.
 */
export type Namespace = string;

/**
 * The character used to separate components in a
 * {@link Namespace | logging namespace}.
 */
export const NAMESPACE_COMPONENT_SEPARATOR = ':';

/**
 * The string used to indicate a single wildcard in a
 * {@link Namespace | logging namespace}.
 */
export const NAMESPACE_SINGLE_WILDCARD = '*';

/**
 * The string used to indicate a multi-wildcard in a
 * {@link Namespace | logging namespace}.
 */
export const NAMESPACE_MULTIPLE_WILDCARD = `${NAMESPACE_SINGLE_WILDCARD}${NAMESPACE_SINGLE_WILDCARD}`;

/**
 * Check whether a value is a
 * {@link NamespaceComponent | logging namespace component}
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is a
 * {@link NamespaceComponent | logging namespace component}, `false` otherwise.
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
 * Check whether a value is a {@link Namespace | logging namespace}.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is a {@link Namespace | logging namespace},
 * `false` otherwise.
 */
export function isNamespace(value: unknown): value is Namespace {
    return typeof value === 'string';
}

/**
 * Join a collection of {@link NamespaceComponent | logging namespace components}
 * into a {@link Namespace | logging namespace}.
 *
 * @param components - The
 * {@link NamespaceComponent | logging namespace components} to join into the
 * final {@link Namespace | logging namespace}.
 *
 * @returns The final {@link Namespace | logging namespace}.
 */
export function namespaceFromComponents(
    ...components: NamespaceComponent[]
): Namespace {
    return components.join(NAMESPACE_COMPONENT_SEPARATOR);
}

/**
 * Split a {@link Namespace | logging namespace} into a collection of
 * {@link NamespaceComponent | logging namespace components}.
 *
 * @param namespace - The {@link Namespace | logging namespace} to split into the
 * final collection of {@link NamespaceComponent | logging namespace components}.
 *
 * @returns The final collection of
 * {@link NamespaceComponent | logging namespace components}.
 */
export function namespaceToComponents(
    namespace: Namespace
): NamespaceComponent[] {
    return namespace.split(NAMESPACE_COMPONENT_SEPARATOR);
}

/**
 * Extend a {@link Namespace | logging namespace} into a new
 * {@link Namespace | logging namespace} by appending the given
 * {@link NamespaceComponent | logging namespace components} to the end of it.
 *
 * @param namespace - The {@link Namespace | logging namespace} to extend.
 * @param components - The
 * {@link NamespaceComponent | logging namespace components} to extend the
 * {@link Namespace | logging namespace} with.
 *
 * @returns The extended {@link Namespace | logging namespace}.
 */
export function extendNamespace(
    namespace: Namespace,
    ...components: NamespaceComponent[]
): Namespace {
    return namespaceFromComponents(
        ...[...namespaceToComponents(namespace), ...components]
    );
}
