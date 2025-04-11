/**
 * A string that represents a component for which events at being logged.
 */
export type Namespace = string;

/**
 * A string that represents a component of a namespace.
 */
export type NamespaceComponent = string;

/**
 * The character used to separate components in a namespace.
 */
export const NAMESPACE_COMPONENT_SEPARATOR = ':';

/**
 * The character used to indicate a wildcard in a namespace.
 */
export const NAMESPACE_WILDCARD_SYMBOL = '*';

/**
 * Check whether a value is a {@link NamespaceComponent | namespace component}.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is a
 * {@link NamespaceComponent | namespace component}; `false` otherwise.
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
 * Check if a {@link NamespaceComponent | namespace component} contains the
 * {@link NAMESPACE_WILDCARD_SYMBOL | wildcard symbol}.
 *
 * @param component - The {@link NamespaceComponent | namespace component} to
 * check.
 *
 * @returns `true` if the {@link NamespaceComponent | namespace component}
 * contains the {@link NAMESPACE_WILDCARD_SYMBOL | wildcard symbol}; `false`
 * otherwise.
 */
export function isWildcardNamespaceComponent(
    component: NamespaceComponent
): boolean {
    return component.includes(NAMESPACE_WILDCARD_SYMBOL);
}

/**
 * Check whether a value is a {@link Namespace | namespace}.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is a {@link Namespace | namespace}; `false`
 * otherwise.
 */
export function isNamespace(value: unknown): value is Namespace {
    return typeof value === 'string';
}

/**
 * Create a new {@link Namespace | namespace} from a list of components.
 *
 * @param components - The components of the {@link Namespace | namespace}.
 *
 * @returns The newly created namespace.
 */
export function namespaceFromComponents(
    ...components: NamespaceComponent[]
): Namespace {
    return components.join(NAMESPACE_COMPONENT_SEPARATOR);
}

/**
 * Split a {@link Namespace | namespace} into its components.
 *
 * @param namespace - The {@link Namespace | namespace} to split.
 *
 * @returns The components of the {@link Namespace | namespace}.
 */
export function namespaceToComponents(
    namespace: Namespace
): NamespaceComponent[] {
    if (namespace === '') {
        return [];
    }
    return namespace.split(NAMESPACE_COMPONENT_SEPARATOR);
}
