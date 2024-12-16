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
    createNamespaceFromComponentArray,
    splitNamespace,
    matchNamespaceComponent,
    matchNamespace
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

/**
 * Check whether a {@link NamespaceComponent} matches another
 * {@link NamespaceComponent}.
 *
 * @param a - The first {@link NamespaceComponent} to check against.
 * @param b - The second {@link NamespaceComponent} to check against.
 *
 * @returns Whether the {@link NamespaceComponent | NamespaceComponents} match.
 */
export function matchNamespaceComponent(
    a: NamespaceComponent,
    b: NamespaceComponent
): boolean {
    if (a === NAMESPACE_WILDCARD || b === NAMESPACE_WILDCARD) {
        return true;
    }
    if (a.includes(NAMESPACE_WILDCARD)) {
        const regex = new RegExp(
            `^${a.replace(new RegExp(`.${NAMESPACE_WILDCARD}`, 'g'), '.*')}$`
        );
        return regex.test(b);
    }
    if (b.includes(NAMESPACE_WILDCARD)) {
        const regex = new RegExp(
            `^${b.replace(new RegExp(`.${NAMESPACE_WILDCARD}`, 'g'), '.*')}$`
        );
        return regex.test(a);
    }
    return a === b;
}

/**
 * Check whether a {@link Namespace} matches another {@link Namespace}.
 *
 * @param a - The first {@link Namespace} to check against.
 * @param b - The second {@link Namespace} to check against.
 *
 * @returns Whether the {@link Namespace | Namespaces} match.
 */
export function matchNamespace(a: Namespace, b: Namespace): boolean {
    const compsA = internals.splitNamespace(a);
    const compsB = internals.splitNamespace(b);
    if (compsA.length !== compsB.length) {
        const lastCompA = compsA[compsA.length - 1];
        const lastCompB = compsB[compsB.length - 1];
        if (lastCompA === undefined || lastCompB === undefined) {
            return false;
        }
        const longestLength = Math.max(compsA.length, compsB.length);
        for (let i = 0; i < longestLength; i += 1) {
            const compA = compsA[Math.min(i, compsA.length - 1)];
            const compB = compsB[Math.min(i, compsB.length - 1)];
            if (compA === undefined || compB === undefined) {
                return false;
            }
            if (!internals.matchNamespaceComponent(compA, compB)) {
                return false;
            }
        }
        return true;
    }
    return compsA.every((compA, i) => {
        const compB = compsB[i];
        if (compB === undefined) {
            return false;
        }
        return internals.matchNamespaceComponent(compA, compB);
    });
}
