/**
 * A module which provides logging namespace-related functionality.
 *
 * @module
 */

import {arrays} from '@webcraft/common';

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
 * The string used to indicate a single character wildcard in a
 * {@link Namespace | logging namespace}.
 */
export const NAMESPACE_SINGLE_WILDCARD = '*';

/**
 * The string used to indicate a multiple character wildcard in a
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
 * Check if a {@link NamespaceComponent | logging namespace component} has a
 * {@link NAMESPACE_SINGLE_WILDCARD | single character wildcard character} or
 * {@link NAMESPACE_MULTIPLE_WILDCARD | multiple character wildcard character} in
 * it.
 *
 * @param component - The {@link NamespaceComponent | logging namespace component}
 * to check.
 *
 * @returns `true` if the {@link NamespaceComponent | logging namespace component}
 * has a {@link NAMESPACE_SINGLE_WILDCARD | single character wildcard character}
 * or {@link NAMESPACE_MULTIPLE_WILDCARD | multiple character wildcard character}
 * in it, `false` otherwise.
 */
export function componentHasWildcard(component: NamespaceComponent): boolean {
    return component.includes(NAMESPACE_SINGLE_WILDCARD);
}

/**
 * Check if a {@link NamespaceComponent | logging namespace component} has a
 * {@link NAMESPACE_MULTIPLE_WILDCARD | single character wildcard character} in
 * it.
 *
 * @param component - The {@link NamespaceComponent | logging namespace component}
 * to check.
 *
 * @returns `true` if the {@link NamespaceComponent | logging namespace component}
 * has a
 * {@link NAMESPACE_SINGLE_WILDCARD | single character wildcard character} in
 * it, `false` otherwise.
 */
export function componentHasSingleCharacterWildcard(
    component: NamespaceComponent
): boolean {
    return (
        component.includes(NAMESPACE_SINGLE_WILDCARD) &&
        !component.includes(NAMESPACE_MULTIPLE_WILDCARD)
    );
}

/**
 * Check if a {@link NamespaceComponent | logging namespace component} has a
 * {@link NAMESPACE_MULTIPLE_WILDCARD | multi-character wildcard character} in it.
 *
 * @param component - The {@link NamespaceComponent | logging namespace component}
 * to check.
 *
 * @returns `true` if the {@link NamespaceComponent | logging namespace component}
 * has a {@link NAMESPACE_MULTIPLE_WILDCARD | multi-character wildcard character}
 * in it, `false` otherwise.
 */
export function componentHasMultiCharacterWildcard(
    component: NamespaceComponent
): boolean {
    return component.includes(NAMESPACE_MULTIPLE_WILDCARD);
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
export function fromComponents(...components: NamespaceComponent[]): Namespace {
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
export function toComponents(namespace: Namespace): NamespaceComponent[] {
    return namespace
        .split(NAMESPACE_COMPONENT_SEPARATOR)
        .filter((e) => e !== '');
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
export function extend(
    namespace: Namespace,
    ...components: NamespaceComponent[]
): Namespace {
    return fromComponents(...toComponents(namespace), ...components);
}

/**
 * Options that control how two
 * {@link NamespaceComponent | logging namespace components} are matched.
 */
export interface NamespaceComponentMatchOptions {
    /**
     * Whether to expand wildcards on the lefthand side of the match.
     *
     * @default true
     */
    expandLHSWildcards?: boolean;

    /**
     * Whether to expand wildcards on the righthand side of the match.
     *
     * @default true
     */
    expandRHSWildcards?: boolean;
}

/**
 * Check whether two {@link NamespaceComponent | logging namespace components}
 * match.
 *
 * @param lhs - The lefthand side of the check.
 * @param rhs - The righthand side of the check.
 * @param options - The options controlling the matching.
 *
 * @returns `true` if the two
 * {@link NamespaceComponent | logging namespace components} match, `false`
 * otherwise.
 */
export function componentsMatch(
    lhs?: NamespaceComponent | null,
    rhs?: NamespaceComponent | null,
    options?: NamespaceComponentMatchOptions
): boolean {
    const opts = {
        expandLHSWildcards: true,
        expandRHSWildcards: true,
        ...options
    };
    if (lhs === undefined || rhs === undefined) {
        if (lhs === undefined && rhs === undefined) {
            return true;
        } else {
            return false;
        }
    }
    if (lhs === null || rhs === null) {
        if (lhs === null && rhs === null) {
            return true;
        } else {
            return false;
        }
    }
    if (!componentHasWildcard(lhs) && !componentHasWildcard(rhs)) {
        return lhs === rhs;
    } else if (
        componentHasWildcard(lhs) &&
        !componentHasWildcard(rhs) &&
        opts.expandLHSWildcards
    ) {
        return new RegExp(
            lhs
                .replace(
                    NAMESPACE_MULTIPLE_WILDCARD,
                    `[^${NAMESPACE_COMPONENT_SEPARATOR}]{0,}`
                )
                .replace(
                    NAMESPACE_SINGLE_WILDCARD,
                    `[^${NAMESPACE_COMPONENT_SEPARATOR}]{1}`
                )
        ).test(rhs);
    } else if (componentHasWildcard(lhs) && !componentHasWildcard(rhs)) {
        return lhs === rhs;
    } else if (
        !componentHasWildcard(lhs) &&
        componentHasWildcard(rhs) &&
        opts.expandRHSWildcards
    ) {
        return new RegExp(
            rhs
                .replace(
                    NAMESPACE_MULTIPLE_WILDCARD,
                    `[^${NAMESPACE_COMPONENT_SEPARATOR}]{0,}`
                )
                .replace(
                    NAMESPACE_SINGLE_WILDCARD,
                    `[^${NAMESPACE_COMPONENT_SEPARATOR}]{1}`
                )
        ).test(lhs);
    } else if (!componentHasWildcard(lhs) && componentHasWildcard(rhs)) {
        return lhs === rhs;
    } else if (
        componentHasWildcard(lhs) &&
        componentHasWildcard(rhs) &&
        opts.expandLHSWildcards &&
        opts.expandRHSWildcards
    ) {
        return (
            new RegExp(
                lhs
                    .replace(
                        NAMESPACE_MULTIPLE_WILDCARD,
                        `[^${NAMESPACE_COMPONENT_SEPARATOR}]{0,}`
                    )
                    .replace(
                        NAMESPACE_SINGLE_WILDCARD,
                        `[^${NAMESPACE_COMPONENT_SEPARATOR}]{1}`
                    )
            ).test(rhs) ||
            new RegExp(
                rhs
                    .replace(
                        NAMESPACE_MULTIPLE_WILDCARD,
                        `[^${NAMESPACE_COMPONENT_SEPARATOR}]{0,}`
                    )
                    .replace(
                        NAMESPACE_SINGLE_WILDCARD,
                        `[^${NAMESPACE_COMPONENT_SEPARATOR}]{1}`
                    )
            ).test(lhs)
        );
    } else if (
        componentHasWildcard(lhs) &&
        componentHasWildcard(rhs) &&
        !opts.expandLHSWildcards &&
        opts.expandRHSWildcards
    ) {
        return new RegExp(
            rhs
                .replace(
                    NAMESPACE_MULTIPLE_WILDCARD,
                    `[^${NAMESPACE_COMPONENT_SEPARATOR}]{0,}`
                )
                .replace(
                    NAMESPACE_SINGLE_WILDCARD,
                    `[^${NAMESPACE_COMPONENT_SEPARATOR}]{1}`
                )
        ).test(lhs);
    } else if (
        componentHasWildcard(lhs) &&
        componentHasWildcard(rhs) &&
        opts.expandLHSWildcards &&
        !opts.expandRHSWildcards
    ) {
        return new RegExp(
            rhs
                .replace(
                    NAMESPACE_MULTIPLE_WILDCARD,
                    `[^${NAMESPACE_COMPONENT_SEPARATOR}]{0,}`
                )
                .replace(
                    NAMESPACE_SINGLE_WILDCARD,
                    `[^${NAMESPACE_COMPONENT_SEPARATOR}]{1}`
                )
        ).test(lhs);
    }
    return lhs === rhs;
}

/**
 * Check whether two {@link Namespace | logging namespaces} match.
 *
 * @param lhs - The lefthand side of the check.
 * @param rhs - The righthand side of the check.
 * @param options - The options controlling the matching.
 *
 * @returns `true` if the two {@link Namespace | logging namespaces} match,
 * `false` otherwise.
 */
export function match(
    lhs: Namespace,
    rhs: Namespace,
    options?: NamespaceComponentMatchOptions
) {
    const opts = {
        expandLHSWildcards: true,
        expandRHSWildcards: true,
        ...options
    };
    const components = arrays.zip(toComponents(lhs), toComponents(rhs));
    return components.every(([lhs, rhs]) => componentsMatch(lhs, rhs, opts));
}
