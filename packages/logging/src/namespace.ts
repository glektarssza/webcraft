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

/**
 * Check if a namespace component equals another namespace component.
 *
 * @param lhs - The namespace component to compare.
 * @param rhs - The namespace component to compare against.
 *
 * @returns `true` if the namespace components are equal; `false` otherwise.
 */
export function namespaceComponentMatches(lhs: string, rhs: string): boolean {
    //-- Neither component includes any wildcards, just straight compare them
    if (
        !lhs.includes(NAMESPACE_WILDCARD) &&
        !rhs.includes(NAMESPACE_WILDCARD)
    ) {
        return lhs === rhs;
    }
    //-- One side is entirely a wildcard so it matches anything
    if (lhs === NAMESPACE_WILDCARD || rhs === NAMESPACE_WILDCARD) {
        return true;
    }
    //-- Otherwise do a regex comparison to account for wildcards
    const lhsRegex = new RegExp(`^${lhs.replace(/\*/g, '.*')}$`);
    return lhsRegex.test(rhs);
}

/**
 * Check if a namespace matches another namespace.
 *
 * @param lhs - The namespace to compare.
 * @param rhs - The namespace to compare against.
 *
 * @returns `true` if the namespaces match; `false` otherwise.
 */
export function namespaceMatches(lhs: Namespace, rhs: Namespace): boolean {
    const lhsComponents = namespaceToComponents(lhs);
    const rhsComponents = namespaceToComponents(rhs);
    const lhsEndsInWildcard =
        lhsComponents[lhsComponents.length - 1] === NAMESPACE_WILDCARD;
    const rhsEndsInWildcard =
        rhsComponents[rhsComponents.length - 1] === NAMESPACE_WILDCARD;
    //-- Neither side ends in a wildcard and they have different lengths so they cannot match by definition
    if (
        !lhsEndsInWildcard &&
        !rhsEndsInWildcard &&
        lhsComponents.length !== rhsComponents.length
    ) {
        return false;
    }
    //-- One side ends in a wildcard so we need to check the components up to the length of the shorter side
    if (lhsEndsInWildcard || rhsEndsInWildcard) {
        const minLength = Math.min(lhsComponents.length, rhsComponents.length);
        for (let i = 0; i < minLength; i++) {
            if (
                !namespaceComponentMatches(lhsComponents[i]!, rhsComponents[i]!)
            ) {
                return false;
            }
        }
        return true;
    }
    //-- Neither side ends in a wildcard so we can just compare the components directly
    for (let i = 0; i < lhsComponents.length; i++) {
        if (!namespaceComponentMatches(lhsComponents[i]!, rhsComponents[i]!)) {
            return false;
        }
    }
    return true;
}
