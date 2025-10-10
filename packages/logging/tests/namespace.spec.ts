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
            const lhs = faker.string.alphanumeric({
                length: {
                    min: 5,
                    max: 10
                }
            });
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
            const lhs = faker.string.alphanumeric({
                length: {
                    min: 5,
                    max: 10
                }
            });
            const rhs = null;

            //-- When
            const r = m.componentsMatch(lhs, rhs);

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `true` if the neither component contains wildcards, both wildcard expansions are disabled, and they are equal', (): void => {
            //-- Given
            const lhs = faker.string.alphanumeric({
                length: {
                    min: 5,
                    max: 10
                }
            });
            const rhs = lhs;

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: false,
                expandRHSWildcards: false
            });

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the neither component contains wildcards, both wildcard expansions are disabled, and they are not equal', (): void => {
            //-- Given
            const lhs = faker.string.alphanumeric({
                length: {
                    min: 5,
                    max: 10
                }
            });
            const rhs = faker.string.alphanumeric({
                length: {
                    min: 5,
                    max: 10
                }
            });

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: false,
                expandRHSWildcards: false
            });

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `true` if the neither component contains wildcards, both wildcard expansions are enabled, and they are equal', (): void => {
            //-- Given
            const lhs = faker.string.alphanumeric({
                length: {
                    min: 5,
                    max: 10
                }
            });
            const rhs = lhs;

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: true,
                expandRHSWildcards: true
            });

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the neither component contains wildcards, both wildcard expansions are enabled, and they are not equal', (): void => {
            //-- Given
            const lhs = faker.string.alphanumeric({
                length: {
                    min: 5,
                    max: 10
                }
            });
            const rhs = faker.string.alphanumeric({
                length: {
                    min: 5,
                    max: 10
                }
            });

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: true,
                expandRHSWildcards: true
            });

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `true` if the neither component contains wildcards, left-hand wildcard expansions is enabled, and they are equal', (): void => {
            //-- Given
            const lhs = faker.string.alphanumeric({
                length: {
                    min: 5,
                    max: 10
                }
            });
            const rhs = lhs;

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: true,
                expandRHSWildcards: false
            });

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the neither component contains wildcards, left-hand wildcard expansions is enabled, and they are not equal', (): void => {
            //-- Given
            const lhs = faker.string.alphanumeric({
                length: {
                    min: 5,
                    max: 10
                }
            });
            const rhs = faker.string.alphanumeric({
                length: {
                    min: 5,
                    max: 10
                }
            });

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: true,
                expandRHSWildcards: false
            });

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `true` if the neither component contains wildcards, right-hand wildcard expansions is enabled, and they are equal', (): void => {
            //-- Given
            const lhs = faker.string.alphanumeric({
                length: {
                    min: 5,
                    max: 10
                }
            });
            const rhs = lhs;

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: false,
                expandRHSWildcards: true
            });

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the neither component contains wildcards, right-hand wildcard expansions is enabled, and they are not equal', (): void => {
            //-- Given
            const lhs = faker.string.alphanumeric({
                length: {
                    min: 5,
                    max: 10
                }
            });
            const rhs = faker.string.alphanumeric({
                length: {
                    min: 5,
                    max: 10
                }
            });

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: false,
                expandRHSWildcards: true
            });

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `true` if the left-hand component contains a single character wildcard, left-hand wildcard expansion is enabled, and they are equal', (): void => {
            //-- Given
            const lhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_SINGLE_WILDCARD : e))
                .join('');
            const rhs = lhs.replace(
                m.NAMESPACE_SINGLE_WILDCARD,
                faker.string.alphanumeric()
            );

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: true,
                expandRHSWildcards: false
            });

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the left-hand component contains a single character wildcard, left-hand wildcard expansion is enabled, and they are not equal', (): void => {
            //-- Given
            const lhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_SINGLE_WILDCARD : e))
                .join('');
            const rhs = `${faker.string.alphanumeric()}${lhs.replace(m.NAMESPACE_SINGLE_WILDCARD, '')}`;

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: true,
                expandRHSWildcards: false
            });

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `true` if the right-hand component contains a single character wildcard, right-hand wildcard expansion is enabled, and they are equal', (): void => {
            //-- Given
            const rhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_SINGLE_WILDCARD : e))
                .join('');
            const lhs = rhs.replace(
                m.NAMESPACE_SINGLE_WILDCARD,
                faker.string.alphanumeric()
            );

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandRHSWildcards: true,
                expandLHSWildcards: false
            });

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the right-hand component contains a single character wildcard, right-hand wildcard expansion is enabled, and they are not equal', (): void => {
            //-- Given
            const rhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_SINGLE_WILDCARD : e))
                .join('');
            const lhs = `${faker.string.alphanumeric()}${rhs.replace(m.NAMESPACE_SINGLE_WILDCARD, '')}`;

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandRHSWildcards: true,
                expandLHSWildcards: false
            });

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `true` if the left-hand component contains a single character wildcard, left-hand wildcard expansion is not enabled, and they are equal', (): void => {
            //-- Given
            const lhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_SINGLE_WILDCARD : e))
                .join('');
            const rhs = lhs;

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: false,
                expandRHSWildcards: false
            });

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the left-hand component contains a single character wildcard, left-hand wildcard expansion is not enabled, and they are not equal', (): void => {
            //-- Given
            const lhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_SINGLE_WILDCARD : e))
                .join('');
            const rhs = faker.string.alphanumeric();

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: false,
                expandRHSWildcards: false
            });

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `true` if the right-hand component contains a single character wildcard, right-hand wildcard expansion is not enabled, and they are equal', (): void => {
            //-- Given
            const rhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_SINGLE_WILDCARD : e))
                .join('');
            const lhs = rhs;

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandRHSWildcards: false,
                expandLHSWildcards: false
            });

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the right-hand component contains a single character wildcard, right-hand wildcard expansion is not enabled, and they are not equal', (): void => {
            //-- Given
            const rhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_SINGLE_WILDCARD : e))
                .join('');
            const lhs = faker.string.alphanumeric();

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandRHSWildcards: false,
                expandLHSWildcards: false
            });

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `true` if the left-hand component contains a multiple character wildcard, left-hand wildcard expansion is enabled, and they are equal', (): void => {
            //-- Given
            const lhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_MULTIPLE_WILDCARD : e))
                .join('');
            const rhs = lhs.replace(
                m.NAMESPACE_MULTIPLE_WILDCARD,
                faker.string.alphanumeric({
                    length: {
                        min: 3,
                        max: 6
                    }
                })
            );

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: true,
                expandRHSWildcards: false
            });

            //-- Then
            expect(r).to.be.true;

            //-- Given
            const lhs2 = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_MULTIPLE_WILDCARD : e))
                .join('');
            const rhs2 = lhs2.replace(
                m.NAMESPACE_MULTIPLE_WILDCARD,
                faker.string.alphanumeric()
            );

            //-- When
            const r2 = m.componentsMatch(lhs2, rhs2, {
                expandLHSWildcards: true,
                expandRHSWildcards: false
            });

            //-- Then
            expect(r2).to.be.true;

            //-- Given
            const lhs3 = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_MULTIPLE_WILDCARD : e))
                .join('');
            const rhs3 = lhs3.replace(m.NAMESPACE_MULTIPLE_WILDCARD, '');

            //-- When
            const r3 = m.componentsMatch(lhs3, rhs3, {
                expandLHSWildcards: true,
                expandRHSWildcards: false
            });

            //-- Then
            expect(r3).to.be.true;
        });
        it('should return `false` if the left-hand component contains a multiple character wildcard, left-hand wildcard expansion is enabled, and they are not equal', (): void => {
            //-- Given
            const lhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_MULTIPLE_WILDCARD : e))
                .join('');
            const rhs = `${faker.string.alphanumeric({
                length: {
                    min: 3,
                    max: 6
                }
            })}${lhs.replace(m.NAMESPACE_MULTIPLE_WILDCARD, '')}`;

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: true,
                expandRHSWildcards: false
            });

            //-- Then
            expect(r).to.be.false;

            //-- Given
            const lhs2 = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_MULTIPLE_WILDCARD : e))
                .join('');
            const rhs2 = `${faker.string.alphanumeric({
                length: {
                    min: 3,
                    max: 6
                }
            })}${lhs2.replace(m.NAMESPACE_MULTIPLE_WILDCARD, '')}`;

            //-- When
            const r2 = m.componentsMatch(lhs2, rhs2, {
                expandLHSWildcards: true,
                expandRHSWildcards: false
            });

            //-- Then
            expect(r2).to.be.false;
        });
        it('should return `true` if the right-hand component contains a multiple character wildcard, right-hand wildcard expansion is enabled, and they are equal', (): void => {
            //-- Given
            const rhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_MULTIPLE_WILDCARD : e))
                .join('');
            const lhs = rhs.replace(
                m.NAMESPACE_MULTIPLE_WILDCARD,
                faker.string.alphanumeric({
                    length: {
                        min: 3,
                        max: 6
                    }
                })
            );

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandRHSWildcards: true,
                expandLHSWildcards: false
            });

            //-- Then
            expect(r).to.be.true;

            //-- Given
            const rhs2 = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_MULTIPLE_WILDCARD : e))
                .join('');
            const lhs2 = rhs2.replace(
                m.NAMESPACE_MULTIPLE_WILDCARD,
                faker.string.alphanumeric()
            );

            //-- When
            const r2 = m.componentsMatch(lhs2, rhs2, {
                expandRHSWildcards: true,
                expandLHSWildcards: false
            });

            //-- Then
            expect(r2).to.be.true;

            //-- Given
            const rhs3 = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_MULTIPLE_WILDCARD : e))
                .join('');
            const lhs3 = rhs3.replace(m.NAMESPACE_MULTIPLE_WILDCARD, '');

            //-- When
            const r3 = m.componentsMatch(lhs3, rhs3, {
                expandRHSWildcards: true,
                expandLHSWildcards: false
            });

            //-- Then
            expect(r3).to.be.true;
        });
        it('should return `false` if the right-hand component contains a multiple character wildcard, right-hand wildcard expansion is enabled, and they are not equal', (): void => {
            //-- Given
            const rhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_MULTIPLE_WILDCARD : e))
                .join('');
            const lhs = `${faker.string.alphanumeric({
                length: {
                    min: 3,
                    max: 6
                }
            })}${rhs.replace(m.NAMESPACE_MULTIPLE_WILDCARD, '')}`;

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandRHSWildcards: true,
                expandLHSWildcards: false
            });

            //-- Then
            expect(r).to.be.false;

            //-- Given
            const rhs2 = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_MULTIPLE_WILDCARD : e))
                .join('');
            const lhs2 = `${faker.string.alphanumeric({
                length: {
                    min: 3,
                    max: 6
                }
            })}${rhs2.replace(m.NAMESPACE_MULTIPLE_WILDCARD, '')}`;

            //-- When
            const r2 = m.componentsMatch(lhs2, rhs2, {
                expandRHSWildcards: true,
                expandLHSWildcards: false
            });

            //-- Then
            expect(r2).to.be.false;
        });
        it('should return `true` if the left-hand component contains a multiple character wildcard, left-hand wildcard expansion is not enabled, and they are equal', (): void => {
            //-- Given
            const lhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_MULTIPLE_WILDCARD : e))
                .join('');
            const rhs = lhs;

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandRHSWildcards: true,
                expandLHSWildcards: false
            });

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the left-hand component contains a multiple character wildcard, left-hand wildcard expansion is not enabled, and they are not equal', (): void => {
            //-- Given
            const lhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_MULTIPLE_WILDCARD : e))
                .join('');
            const rhs = `${faker.string.alphanumeric({
                length: {
                    min: 3,
                    max: 6
                }
            })}${lhs}`;

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: false,
                expandRHSWildcards: false
            });

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `true` if the right-hand component contains a multiple character wildcard, right-hand wildcard expansion is not enabled, and they are equal', (): void => {
            //-- Given
            const rhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_MULTIPLE_WILDCARD : e))
                .join('');
            const lhs = rhs;

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandRHSWildcards: true,
                expandLHSWildcards: false
            });

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the right-hand component contains a multiple character wildcard, right-hand wildcard expansion is not enabled, and they are not equal', (): void => {
            //-- Given
            const rhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_MULTIPLE_WILDCARD : e))
                .join('');
            const lhs = `${faker.string.alphanumeric({
                length: {
                    min: 3,
                    max: 6
                }
            })}${rhs}`;

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: false,
                expandRHSWildcards: false
            });

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `true` if the both components contains a single character wildcard, both wildcard expansions are disabled, and they are equal', (): void => {
            //-- Given
            const lhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_SINGLE_WILDCARD : e))
                .join('');
            const rhs = lhs;

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: false,
                expandRHSWildcards: false
            });

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the both component contains a single character wildcard, both wildcard expansions are disabled, and they are not equal', (): void => {
            //-- Given
            const lhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_SINGLE_WILDCARD : e))
                .join('');
            const rhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_SINGLE_WILDCARD : e))
                .join('');

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: false,
                expandRHSWildcards: false
            });

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `true` if the both components contains a multiple character wildcard, both wildcard expansions are enabled, and they are equal', (): void => {
            //-- Given
            const lhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_MULTIPLE_WILDCARD : e))
                .join('');
            const rhs = lhs;

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: true,
                expandRHSWildcards: true
            });

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the both component contains a multiple character wildcard, both wildcard expansions are disabled, and they are not equal', (): void => {
            //-- Given
            const lhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_MULTIPLE_WILDCARD : e))
                .join('');
            const rhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_SINGLE_WILDCARD : e))
                .join('');

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: true,
                expandRHSWildcards: true
            });

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `true` if the both components contains a multiple character wildcard, both wildcard expansions are disabled, and they are equal', (): void => {
            //-- Given
            const lhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_MULTIPLE_WILDCARD : e))
                .join('');
            const rhs = lhs;

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: true,
                expandRHSWildcards: true
            });

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the both component contains a multiple character wildcard, both wildcard expansions are enabled, and they are not equal', (): void => {
            //-- Given
            const lhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_MULTIPLE_WILDCARD : e))
                .join('');
            const rhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_SINGLE_WILDCARD : e))
                .join('');

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: true,
                expandRHSWildcards: true
            });

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `true` if the both components contains a single character wildcard, left-hand wildcard expansion is enabled, and they are equal', (): void => {
            //-- Given
            const lhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_SINGLE_WILDCARD : e))
                .join('');
            const rhs = lhs;

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: true,
                expandRHSWildcards: false
            });

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the both component contains a single character wildcard, left-hand wildcard expansion is enabled, and they are not equal', (): void => {
            //-- Given
            const lhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_SINGLE_WILDCARD : e))
                .join('');
            const rhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_SINGLE_WILDCARD : e))
                .join('');

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: true,
                expandRHSWildcards: false
            });

            //-- Then
            expect(r).to.be.false;
        });
        it('should return `true` if the both components contains a single character wildcard, right-hand wildcard expansion is enabled, and they are equal', (): void => {
            //-- Given
            const lhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_SINGLE_WILDCARD : e))
                .join('');
            const rhs = lhs;

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: false,
                expandRHSWildcards: true
            });

            //-- Then
            expect(r).to.be.true;
        });
        it('should return `false` if the both component contains a single character wildcard, right-hand wildcard expansion is enabled, and they are not equal', (): void => {
            //-- Given
            const lhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_SINGLE_WILDCARD : e))
                .join('');
            const rhs = faker.string
                .alphanumeric({
                    length: {
                        min: 5,
                        max: 10
                    }
                })
                .split('')
                .map((e, i) => (i === 3 ? m.NAMESPACE_SINGLE_WILDCARD : e))
                .join('');

            //-- When
            const r = m.componentsMatch(lhs, rhs, {
                expandLHSWildcards: false,
                expandRHSWildcards: true
            });

            //-- Then
            expect(r).to.be.false;
        });
    });
    describe('.match()', (): void => {
        it('should return `true` if two namespaces match', (): void => {
            //-- Given
            const lhsComps = faker.helpers.multiple(
                () =>
                    faker.string.alphanumeric({
                        length: {
                            min: 5,
                            max: 10
                        }
                    }),
                {
                    count: 5
                }
            );
            const rhsComps = Array.from(lhsComps);
            const lhs = m.fromComponents(...lhsComps);
            const rhs = m.fromComponents(...rhsComps);

            //-- When
            const r = m.match(lhs, rhs);

            //-- Then
            expect(r).to.be.true;

            //-- Given
            const lhsComps1 = faker.helpers.multiple(
                () =>
                    faker.string.alphanumeric({
                        length: {
                            min: 5,
                            max: 10
                        }
                    }),
                {
                    count: 5
                }
            );
            const rhsComps1 = Array.from(lhsComps1);
            lhsComps1.splice(
                2,
                1,
                lhsComps1[2]!
                    .split('')
                    .map((e, i) =>
                        i === 3 ? m.NAMESPACE_MULTIPLE_WILDCARD : e
                    )
                    .join('')
            );
            const lhs1 = m.fromComponents(...lhsComps1);
            const rhs1 = m.fromComponents(...rhsComps1);

            //-- When
            const r1 = m.match(lhs1, rhs1);

            //-- Then
            expect(r1).to.be.true;
        });
        it('should return `false` if two namespaces do not match', (): void => {
            //-- Given
            const lhsComps = faker.helpers.multiple(
                () =>
                    faker.string.alphanumeric({
                        length: {
                            min: 5,
                            max: 10
                        }
                    }),
                {
                    count: 5
                }
            );
            const rhsComps = faker.helpers.multiple(
                () =>
                    faker.string.alphanumeric({
                        length: {
                            min: 5,
                            max: 10
                        }
                    }),
                {
                    count: 5
                }
            );
            const lhs = m.fromComponents(...lhsComps);
            const rhs = m.fromComponents(...rhsComps);

            //-- When
            const r = m.match(lhs, rhs);

            //-- Then
            expect(r).to.be.false;

            //-- Given
            const lhsComps1 = faker.helpers.multiple(
                () =>
                    faker.string.alphanumeric({
                        length: {
                            min: 5,
                            max: 10
                        }
                    }),
                {
                    count: 5
                }
            );
            const rhsComps1 = Array.from(lhsComps1);
            lhsComps1.splice(
                2,
                1,
                lhsComps1[2]!
                    .split('')
                    .map((e, i) =>
                        i === 3 ?
                            faker.string.alphanumeric({
                                length: {
                                    min: 5,
                                    max: 10
                                }
                            })
                        :   e
                    )
                    .join('')
            );
            const lhs1 = m.fromComponents(...lhsComps1);
            const rhs1 = m.fromComponents(...rhsComps1);

            //-- When
            const r1 = m.match(lhs1, rhs1);

            //-- Then
            expect(r1).to.be.false;
        });
    });
});
