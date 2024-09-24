//-- NPM Packages
import {beforeAll, describe, expect, it} from 'vitest';
import {Faker, base, en, en_CA, en_US} from '@faker-js/faker';

//-- Project Code
import * as m from '@src/namespace';

/**
 * The fake data provider.
 */
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:namespace', (): void => {
    beforeAll(() => {
        if (FAKER_SEED && isFinite(parseInt(FAKER_SEED))) {
            faker.seed(parseInt(FAKER_SEED));
        }
    });
    describe('.isNamespace()', (): void => {
        it('should return `true` if the value is a namespace', (): void => {
            //-- Given
            const components = faker.helpers.multiple(() =>
                faker.string.alpha()
            );
            const namespace = components.join(m.NAMESPACE_COMPONENT_SEPARATOR);

            //-- When
            const r = m.isNamespace(namespace);

            //-- Then
            expect(r).toBe(true);
        });
        it('should return `false` if the value is not a namespace', (): void => {
            //-- Given
            const values: unknown[] = [[], {}, false, 1, 1.1, null, undefined];

            values.forEach((value) => {
                //-- When
                const r = m.isNamespace(value);

                //-- Then
                expect(r).toBe(false);
            });
        });
    });
    describe('.namespaceFromComponents()', (): void => {
        it('should create a namespace from components', (): void => {
            //-- Given
            const components = faker.helpers.multiple(() =>
                faker.string.alpha()
            );

            //-- When
            const r = m.namespaceFromComponents(...components);

            //-- Then
            expect(r).toBe(components.join(m.NAMESPACE_COMPONENT_SEPARATOR));
        });
    });
    describe('.namespaceToComponents()', (): void => {
        it('should split a namespace into its components', (): void => {
            //-- Given
            const components = faker.helpers.multiple(() =>
                faker.string.alpha()
            );
            const namespace = components.join(m.NAMESPACE_COMPONENT_SEPARATOR);

            //-- When
            const r = m.namespaceToComponents(namespace);

            //-- Then
            expect(r).toEqual(components);
        });
    });
    describe('.namespaceComponentMatches()', (): void => {
        it('should return `true` if the namespace components are identical and neither has any wildcards', (): void => {
            //-- Given
            const lhs = faker.string.alpha();
            const rhs = lhs;

            //-- When
            const r = m.namespaceComponentMatches(lhs, rhs);

            //-- Then
            expect(r).toBe(true);
        });
        it('should return `false` if the namespace components are not identical and neither has any wildcards', (): void => {
            //-- Given
            const lhs = faker.string.alpha();
            const rhs = faker.string.alpha();

            //-- When
            const r = m.namespaceComponentMatches(lhs, rhs);

            //-- Then
            expect(r).toBe(false);
        });
        it('should return `true` if the left-hand side is composed only of a wildcard', (): void => {
            //-- Given
            const lhs = m.NAMESPACE_WILDCARD;
            const rhs = faker.string.alpha();

            //-- When
            const r = m.namespaceComponentMatches(lhs, rhs);

            //-- Then
            expect(r).toBe(true);
        });
        it('should return `true` if the right-hand side is composed only of a wildcard', (): void => {
            //-- Given
            const lhs = faker.string.alpha();
            const rhs = m.NAMESPACE_WILDCARD;

            //-- When
            const r = m.namespaceComponentMatches(lhs, rhs);

            //-- Then
            expect(r).toBe(true);
        });
        it('should return `true` if both sides are composed only of a wildcard', (): void => {
            //-- Given
            const lhs = m.NAMESPACE_WILDCARD;
            const rhs = m.NAMESPACE_WILDCARD;

            //-- When
            const r = m.namespaceComponentMatches(lhs, rhs);

            //-- Then
            expect(r).toBe(true);
        });
        it('should return `true` if the left-hand side contains a wildcard character and matches the right-hand side', (): void => {
            //-- Given
            const prefix = faker.string.alpha();
            const suffix = faker.string.alpha();
            const lhs = `${prefix}${m.NAMESPACE_WILDCARD}${suffix}`;
            const rhs = `${prefix}${faker.string.alpha()}${suffix}`;

            //-- When
            const r = m.namespaceComponentMatches(lhs, rhs);

            //-- Then
            expect(r).toBe(true);
        });
        it('should return `true` if the right-hand side contains a wildcard character and matches the left-hand side', (): void => {
            //-- Given
            const prefix = faker.string.alpha();
            const suffix = faker.string.alpha();
            const lhs = `${prefix}${faker.string.alpha()}${suffix}`;
            const rhs = `${prefix}${m.NAMESPACE_WILDCARD}${suffix}`;

            //-- When
            const r = m.namespaceComponentMatches(lhs, rhs);

            //-- Then
            expect(r).toBe(true);
        });
        it('should return `false` if the left-hand side contains a wildcard character and does not match the right-hand side', (): void => {
            //-- Given
            const prefix = faker.string.alpha();
            const suffix = faker.string.alpha();
            const lhs = `${prefix}${m.NAMESPACE_WILDCARD}${suffix}`;
            const rhs = faker.string.alpha();

            //-- When
            const r = m.namespaceComponentMatches(lhs, rhs);

            //-- Then
            expect(r).toBe(false);
        });
        it('should return `false` if the right-hand side contains a wildcard character and does not match the left-hand side', (): void => {
            //-- Given
            const prefix = faker.string.alpha();
            const suffix = faker.string.alpha();
            const lhs = faker.string.alpha();
            const rhs = `${prefix}${m.NAMESPACE_WILDCARD}${suffix}`;

            //-- When
            const r = m.namespaceComponentMatches(lhs, rhs);

            //-- Then
            expect(r).toBe(false);
        });
    });
    describe('.namespaceMatches()', (): void => {
        it('should return `false` if neither namespace ends in a wildcard and the namespaces are of different lengths', (): void => {
            //-- Given
            const lhsComponents = faker.helpers.multiple(
                () => faker.string.alpha(),
                {count: 3}
            );
            const rhsComponents = faker.helpers.multiple(
                () => faker.string.alpha(),
                {count: 4}
            );
            const lhs = lhsComponents.join(m.NAMESPACE_COMPONENT_SEPARATOR);
            const rhs = rhsComponents.join(m.NAMESPACE_COMPONENT_SEPARATOR);

            //-- When
            const r = m.namespaceMatches(lhs, rhs);

            //-- Then
            expect(r).toBe(false);
        });
        it('should return `false` if the left-hand side ends in a wildcard and the right-hand side does not match', (): void => {});
        it('should return `false` if the right-hand side ends in a wildcard and the left-hand side does not match', (): void => {});
    });
});
