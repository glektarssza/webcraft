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
    describe('.isNamespaceComponent()', (): void => {
        it('should return `true` if the value is a string and does not include the namespace separator character', (): void => {
            //-- Given
            const component = faker.string.alphanumeric();

            //-- When
            const r = m.isNamespaceComponent(component);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the value is a string and does include the namespace separator character', (): void => {
            //-- Given
            const componentA = faker.string.alphanumeric();
            const componentB = faker.string.alphanumeric();
            const component = `${componentA}${m.NAMESPACE_COMPONENT_SEPARATOR}${componentB}`;

            //-- When
            const r = m.isNamespaceComponent(component);

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `false` if the value is not a string', () => {
            //-- Given
            const nonComponentThings = [
                false,
                true,
                1,
                1.2,
                {},
                [],
                (): void => {}
            ];

            nonComponentThings.forEach((thing): void => {
                //-- When
                const r = m.isNamespaceComponent(thing);

                //-- Then
                expect(r).to.be.false;
            });
        });
    });
    describe('.isNamespace()', (): void => {
        it('should return `true` if the value is a string', (): void => {
            //-- Given
            const component = faker.string.alphanumeric();

            //-- When
            const r = m.isNamespace(component);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the value is not a string', (): void => {
            //-- Given
            const nonComponentThings = [
                false,
                true,
                1,
                1.2,
                {},
                [],
                (): void => {}
            ];

            nonComponentThings.forEach((thing): void => {
                //-- When
                const r = m.isNamespace(thing);

                //-- Then
                expect(r).to.be.false;
            });
        });
    });
    describe('.componentHasWildcard()', (): void => {
        it('should return `true` if the component has at least one wildcard character', (): void => {
            //-- Given
            const componentA = faker.string.alphanumeric();
            const componentB = faker.string.alphanumeric();
            const component = `${componentA}${m.NAMESPACE_SINGLE_WILDCARD}${componentB}`;

            //-- When
            const r = m.componentHasWildcard(component);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the component has no wildcard characters', (): void => {
            //-- Given
            const component = faker.string.alphanumeric();

            //-- When
            const r = m.componentHasWildcard(component);

            //-- Then
            expect(r).to.be.false;
        });
    });
    describe('.componentHasSingleCharacterWildcard()', (): void => {
        it('should return `true` if the component has a single wildcard character', (): void => {
            //-- Given
            const componentA = faker.string.alphanumeric();
            const componentB = faker.string.alphanumeric();
            const component = `${componentA}${m.NAMESPACE_SINGLE_WILDCARD}${componentB}`;

            //-- When
            const r = m.componentHasSingleCharacterWildcard(component);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the component has no wildcard characters', (): void => {
            //-- Given
            const component = faker.string.alphanumeric();

            //-- When
            const r = m.componentHasSingleCharacterWildcard(component);

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `false` if the component has more than one wildcard characters', (): void => {
            //-- Given
            const componentA = faker.string.alphanumeric();
            const componentB = faker.string.alphanumeric();
            const component = `${componentA}${m.NAMESPACE_MULTIPLE_WILDCARD}${componentB}`;

            //-- When
            const r = m.componentHasSingleCharacterWildcard(component);

            //-- Then
            expect(r).to.be.false;
        });
    });
    describe('.componentHasMultiCharacterWildcard()', (): void => {
        it('should return `true` if the component has multiple wildcard characters', (): void => {
            //-- Given
            const componentA = faker.string.alphanumeric();
            const componentB = faker.string.alphanumeric();
            const component = `${componentA}${m.NAMESPACE_MULTIPLE_WILDCARD}${componentB}`;

            //-- When
            const r = m.componentHasMultiCharacterWildcard(component);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the component has no wildcard characters', (): void => {
            //-- Given
            const component = faker.string.alphanumeric();

            //-- When
            const r = m.componentHasMultiCharacterWildcard(component);

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `false` if the component has a single wildcard character', (): void => {
            //-- Given
            const componentA = faker.string.alphanumeric();
            const componentB = faker.string.alphanumeric();
            const component = `${componentA}${m.NAMESPACE_SINGLE_WILDCARD}${componentB}`;

            //-- When
            const r = m.componentHasMultiCharacterWildcard(component);

            //-- Then
            expect(r).to.be.false;
        });
    });
    describe('.fromComponents()', (): void => {
        it('create a new namespace from a collection of namespace components', (): void => {
            //-- Given
            const components = faker.helpers.multiple(() =>
                faker.string.alphanumeric()
            );

            //-- When
            const r = m.fromComponents(...components);

            //-- Then
            components.forEach((component) => expect(r).to.contain(component));
            expect(r).to.equal(
                components.join(m.NAMESPACE_COMPONENT_SEPARATOR)
            );
        });
        it('return an empty string if given no inputs', (): void => {
            //-- Given
            //-- Do nothing

            //-- When
            const r = m.fromComponents();

            //-- Then
            expect(r).to.be.empty;
        });
    });
    describe('.toComponents()', (): void => {
        it('break a namespace into a collection of components', (): void => {
            //-- Given
            const length = faker.number.int({
                min: 2,
                max: 5
            });
            const components = faker.helpers.multiple(
                () => faker.string.alphanumeric(),
                {
                    count: length
                }
            );
            const namespace = components.join(m.NAMESPACE_COMPONENT_SEPARATOR);

            //-- When
            const r = m.toComponents(namespace);

            //-- Then
            expect(r).to.be.lengthOf(length);
            expect(r).to.deep.equal(components);
        });
        it('return an empty array if given an empty namespace', (): void => {
            //-- Given
            const namespace = '';

            //-- When
            const r = m.toComponents(namespace);

            //-- Then
            expect(r).to.be.empty;
        });
        it('return an empty array if given namespace composed of empty components', (): void => {
            //-- Given
            const namespace = ':'.repeat(
                faker.number.int({
                    min: 2,
                    max: 5
                })
            );

            //-- When
            const r = m.toComponents(namespace);

            //-- Then
            expect(r).to.be.empty;
        });
    });
    describe('.extend()', (): void => {
        it('should return the original namespace with the new components off the end', () => {
            //-- Given
            const originalComponents = faker.helpers.multiple(() =>
                faker.string.alphanumeric()
            );
            const originalNamespace = m.fromComponents(...originalComponents);
            const newComponents = faker.helpers.multiple(() =>
                faker.string.alphanumeric()
            );

            //-- When
            const r = m.extend(originalNamespace, ...newComponents);

            //-- Then
            expect(r).to.equal(
                m.fromComponents(...originalComponents, ...newComponents)
            );
        });
        it('should return a new namespace if the original namespace was blank', (): void => {
            //-- Given
            const originalNamespace = '';
            const newComponents = faker.helpers.multiple(() =>
                faker.string.alphanumeric()
            );

            //-- When
            const r = m.extend(originalNamespace, ...newComponents);

            //-- Then
            expect(r).to.equal(m.fromComponents(...newComponents));
        });
    });
    describe('.componentsMatch()', (): void => {
        it('should return `true` if the both components are `undefined`', () => {
            //-- Given
            const lhs = undefined;
            const rhs = undefined;

            //-- When
            const r = m.componentsMatch(lhs, rhs);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the one component is `undefined`', (): void => {
            //-- Given
            const lhs = faker.string.alphanumeric();
            const rhs = undefined;

            //-- When
            const r = m.componentsMatch(lhs, rhs);

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `true` if the both components are `null`', (): void => {
            //-- Given
            const lhs = null;
            const rhs = null;

            //-- When
            const r = m.componentsMatch(lhs, rhs);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the one component is `null`', (): void => {
            //-- Given
            const lhs = faker.string.alphanumeric();
            const rhs = null;

            //-- When
            const r = m.componentsMatch(lhs, rhs);

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `true` if the neither component contains wildcards and they are equal', (): void => {
            //-- Given
            const lhs = faker.string.alphanumeric();
            const rhs = lhs;

            //-- When
            const r = m.componentsMatch(lhs, rhs);

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the neither component contains wildcards and they are not equal', (): void => {
            //-- Given
            const lhs = faker.string.alphanumeric();
            const rhs = faker.string.alphanumeric();

            //-- When
            const r = m.componentsMatch(lhs, rhs);

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `true` if the lefthand component contains a single character wildcard, lefthand wildcard expansion is enabled, and they are equal', (): void => {
            //-- Given
            const lhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .splice(3, 1, m.NAMESPACE_SINGLE_WILDCARD)
                .join('');
            const rhs = lhs.replace(
                m.NAMESPACE_SINGLE_WILDCARD,
                faker.string.alphanumeric()
            );

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: true
            });

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the lefthand component contains a single character wildcard, lefthand wildcard expansion is enabled, and they are not equal', (): void => {
            //-- Given
            const lhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .splice(3, 1, m.NAMESPACE_SINGLE_WILDCARD)
                .join('');
            const rhs = `${faker.string.alphanumeric()}${lhs.replace(m.NAMESPACE_SINGLE_WILDCARD, '')}`;

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: true
            });

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `true` if the righthand component contains a single character wildcard, righthand wildcard expansion is enabled, and they are equal', (): void => {
            //-- Given
            const rhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .splice(3, 1, m.NAMESPACE_SINGLE_WILDCARD)
                .join('');
            const lhs = rhs.replace(
                m.NAMESPACE_SINGLE_WILDCARD,
                faker.string.alphanumeric()
            );

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandRHSWildcards: true
            });

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the righthand component contains a single character wildcard, righthand wildcard expansion is enabled, and they are not equal', (): void => {
            //-- Given
            const rhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .splice(3, 1, m.NAMESPACE_SINGLE_WILDCARD)
                .join('');
            const lhs = `${faker.string.alphanumeric()}${rhs.replace(m.NAMESPACE_SINGLE_WILDCARD, '')}`;

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandRHSWildcards: true
            });

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `true` if the lefthand component contains a single character wildcard, lefthand wildcard expansion is not enabled, and they are equal', (): void => {
            //-- Given
            const lhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .splice(3, 1, m.NAMESPACE_SINGLE_WILDCARD)
                .join('');
            const rhs = lhs;

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: false
            });

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the lefthand component contains a single character wildcard, lefthand wildcard expansion is not enabled, and they are not equal', (): void => {
            //-- Given
            const lhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .splice(3, 1, m.NAMESPACE_SINGLE_WILDCARD)
                .join('');
            const rhs = faker.string.alphanumeric();

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: false
            });

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `true` if the righthand component contains a single character wildcard, righthand wildcard expansion is not enabled, and they are equal', (): void => {
            //-- Given
            const rhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .splice(3, 1, m.NAMESPACE_SINGLE_WILDCARD)
                .join('');
            const lhs = rhs;

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandRHSWildcards: false
            });

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the righthand component contains a single character wildcard, righthand wildcard expansion is not enabled, and they are not equal', (): void => {
            //-- Given
            const rhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .splice(3, 1, m.NAMESPACE_SINGLE_WILDCARD)
                .join('');
            const lhs = faker.string.alphanumeric();

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandRHSWildcards: false
            });

            //-- Then
            expect(r).to.be.false;
        });
        it(
            'should return `true` if the lefthand component contains a multiple character wildcard, lefthand wildcard expansion is enabled, and they are equal',
            {todo: true}
        );
        it(
            'should return `false` if the lefthand component contains a multiple character wildcard, lefthand wildcard expansion is enabled, and they are not equal',
            {todo: true}
        );
        it(
            'should return `true` if the righthand component contains a multiple character wildcard, righthand wildcard expansion is enabled, and they are equal',
            {todo: true}
        );
        it(
            'should return `false` if the righthand component contains a multiple character wildcard, righthand wildcard expansion is enabled, and they are not equal',
            {todo: true}
        );
        it(
            'should return `true` if the lefthand component contains a multiple character wildcard, lefthand wildcard expansion is not enabled, and they are equal',
            {todo: true}
        );
        it(
            'should return `false` if the lefthand component contains a multiple character wildcard, lefthand wildcard expansion is not enabled, and they are not equal',
            {todo: true}
        );
        it(
            'should return `true` if the righthand component contains a multiple character wildcard, righthand wildcard expansion is not enabled, and they are equal',
            {todo: true}
        );
        it(
            'should return `false` if the righthand component contains a multiple character wildcard, righthand wildcard expansion is not enabled, and they are not equal',
            {todo: true}
        );
    });
});
