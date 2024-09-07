/**
 * A string that represents a component for which events at being logged.
 */
export type Namespace = string;

/**
 * The character used to separate components in a namespace.
 */
export const NAMESPACE_COMPONENT_SEPARATOR = ':';

/**
 * The character used to indicate a wildcard in a namespace.
 */
export const NAMESPACE_WILDCARD = '*';

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
 * @param components - The components of the namespace.
 *
 * @returns The newly created namespace.
 */
export function namespaceFromComponents(...components: string[]): Namespace {
    return components.join(NAMESPACE_COMPONENT_SEPARATOR);
}

/**
 * Split a {@link Namespace | namespace} into its components.
 *
 * @param namespace - The namespace to split.
 *
 * @returns The components of the namespace.
 */
export function namespaceToComponents(namespace: Namespace): string[] {
    return namespace.split(NAMESPACE_COMPONENT_SEPARATOR);
}
