//-- NPM
import {Faker, base, en, en_CA, en_US} from '@faker-js/faker';
import {createSandbox} from 'sinon';
import {afterEach, beforeAll, describe, expect, it} from 'vitest';

//-- Project Code
import {
    createEmptyNamespace,
    createNamespaceFromComponentArray,
    createNamespaceFromComponents,
    createWildcardNamespace,
    internals,
    isNamespace,
    isNamespaceComponent,
    isNamespaceComponentArray,
    matchNamespace,
    matchNamespaceComponent,
    NAMESPACE_COMPONENT_SEPARATOR,
    NAMESPACE_WILDCARD,
    NamespaceComponentArray,
    splitNamespace
} from '@src/namespace';

/**
 * The fake data source.
 */
const fakeData = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:logging/namespace', (): void => {
    const sinonSandbox = createSandbox();
    afterEach((): void => {
        sinonSandbox.reset();
    });
    beforeAll((): void => {
        let seed = fakeData.seed();
        if (FAKER_SEED) {
            const fakerSeed = parseInt(FAKER_SEED, 10);
            if (!isNaN(fakerSeed)) {
                seed = fakerSeed;
            }
        }
        fakeData.seed(seed);
    });
    describe('.isNamespace()', (): void => {
        it('should return `true` if the value is a string', (): void => {
            //-- Given
            const ns = fakeData.string.alphanumeric();

            //-- When
            const result = isNamespace(ns);

            //-- Then
            expect(result).to.be.true;
        });
        it('should return `false` if the value is not a string', (): void => {
            //-- Given
            const data = [
                false,
                true,
                0,
                1,
                NaN,
                Infinity,
                -Infinity,
                {},
                [],
                Symbol(),
                () => {
                    return;
                }
            ];

            data.forEach((ns): void => {
                //-- When
                const result = isNamespace(ns);

                //-- Then
                expect(result).to.be.false;
            });
        });
    });
    describe('.isNamespaceComponent()', (): void => {
        it('should return `true` if the value is a string that does not include the `NAMESPACE_COMPONENT_SEPARATOR`', (): void => {
            //-- Given
            const nsc = fakeData.string.alphanumeric();

            //-- When
            const result = isNamespaceComponent(nsc);

            //-- Then
            expect(result).to.be.true;
        });
        it('should return `true` if the value is a string that includes the `NAMESPACE_COMPONENT_SEPARATOR`', (): void => {
            //-- Given
            const nsc = `${fakeData.string.alphanumeric()}:${fakeData.string.alphanumeric()}`;

            //-- When
            const result = isNamespaceComponent(nsc);

            //-- Then
            expect(result).to.be.false;
        });
        it('should return `false` if the value is not a string', (): void => {
            //-- Given
            const data = [
                false,
                true,
                0,
                1,
                NaN,
                Infinity,
                -Infinity,
                {},
                [],
                Symbol(),
                () => {
                    return;
                }
            ];

            data.forEach((nsc): void => {
                //-- When
                const result = isNamespaceComponent(nsc);

                //-- Then
                expect(result).to.be.false;
            });
        });
    });
    describe('.isNamespaceComponentArray()', (): void => {
        it('should return `true` if the value is an array where all values fulfill the `isNamespaceComponent` function', (): void => {
            //-- Given
            const nscArray = [
                fakeData.string.alphanumeric(),
                fakeData.string.alphanumeric()
            ];

            //-- When
            const result = isNamespaceComponentArray(nscArray);

            //-- Then
            expect(result).to.be.true;
        });
        it('should return `false` if the is not an object', (): void => {
            //-- Given
            const data = [false, true, 0, 1, NaN, Infinity, -Infinity];

            data.forEach((nscArray): void => {
                //-- When
                const result = isNamespaceComponentArray(nscArray);

                //-- Then
                expect(result).to.be.false;
            });
        });
        it('should return `false` if the is an object but not an array', (): void => {
            //-- Given
            const data = [
                {},
                Symbol(),
                () => {
                    return;
                }
            ];

            data.forEach((nscArray): void => {
                //-- When
                const result = isNamespaceComponentArray(nscArray);

                //-- Then
                expect(result).to.be.false;
            });
        });
        it('should return `false` if the is an array but one of the components does not fulfill the `isNamespaceComponent` function', (): void => {
            //-- Given
            const isNamespaceComponentStub = sinonSandbox.stub(
                internals,
                'isNamespaceComponent'
            );
            isNamespaceComponentStub.returns(true).onCall(1).returns(false);
            const nscArray = [
                fakeData.string.alphanumeric(),
                fakeData.string.alphanumeric()
            ];

            //-- When
            const result = isNamespaceComponentArray(nscArray);

            //-- Then
            expect(result).to.be.false;
        });
    });
    describe('.createEmptyNamespace()', (): void => {
        it('should return an empty string', (): void => {
            //-- Given

            //-- When
            const result = createEmptyNamespace();

            //-- Then
            expect(result).to.equal('');
        });
    });
    describe('.createWildcardNamespace()', (): void => {
        it('should return the `NAMESPACE_WILDCARD` constant', (): void => {
            //-- Given

            //-- When
            const result = createWildcardNamespace();

            //-- Then
            expect(result).to.equal(NAMESPACE_WILDCARD);
        });
    });
    describe('.createNamespaceFromComponents()', (): void => {
        it('should create a namespace from the given components', (): void => {
            //-- Given
            const components = [
                fakeData.string.alphanumeric(),
                fakeData.string.alphanumeric()
            ];

            //-- When
            const result = createNamespaceFromComponents(...components);

            //-- Then
            expect(result).to.equal(
                components.join(NAMESPACE_COMPONENT_SEPARATOR)
            );
        });
        it('should create an empty namespace when given an empty array', (): void => {
            //-- Given
            const components: NamespaceComponentArray = [];

            //-- When
            const result = createNamespaceFromComponents(...components);

            //-- Then
            expect(result).to.equal('');
        });
    });
    describe('.createNamespaceFromComponentArray()', (): void => {
        it('should create a namespace from the given components', (): void => {
            //-- Given
            const components = [
                fakeData.string.alphanumeric(),
                fakeData.string.alphanumeric()
            ];

            //-- When
            const result = createNamespaceFromComponentArray(components);

            //-- Then
            expect(result).to.equal(
                components.join(NAMESPACE_COMPONENT_SEPARATOR)
            );
        });
        it('should create an empty namespace when given an empty array', (): void => {
            //-- Given
            const components: NamespaceComponentArray = [];

            //-- When
            const result = createNamespaceFromComponentArray(components);

            //-- Then
            expect(result).to.equal('');
        });
    });
    describe('.splitNamespace()', (): void => {
        it('should split a namespace into an array of components', (): void => {
            //-- Given
            const components = [
                fakeData.string.alphanumeric(),
                fakeData.string.alphanumeric()
            ];
            const namespace = components.join(NAMESPACE_COMPONENT_SEPARATOR);

            //-- When
            const result = splitNamespace(namespace);

            //-- Then
            expect(result).to.deep.equal(components);
        });
        it('should return an empty array when given an empty namespace', (): void => {
            //-- Given
            const namespace = '';

            //-- When
            const result = splitNamespace(namespace);

            //-- Then
            expect(result).to.deep.equal([]);
        });
    });
    describe('.matchNamespaceComponent()', (): void => {
        it('should return `true` if only the first namespace component is a pure wildcard', (): void => {
            //-- Given
            const a = NAMESPACE_WILDCARD;
            const b = fakeData.string.alphanumeric();

            //-- When
            const result = matchNamespaceComponent(a, b);

            //-- Then
            expect(result).to.be.true;
        });
        it('should return `true` if only the second namespace component is a pure wildcard', (): void => {
            //-- Given
            const a = fakeData.string.alphanumeric();
            const b = NAMESPACE_WILDCARD;

            //-- When
            const result = matchNamespaceComponent(a, b);

            //-- Then
            expect(result).to.be.true;
        });
        it('should return `true` if only the first namespace component contains a wildcard and the second namespace component matches the pattern', (): void => {
            //-- Given
            const prefix = fakeData.string.alphanumeric();
            const suffix = fakeData.string.alphanumeric();
            const a = `${prefix}${NAMESPACE_WILDCARD}${suffix}`;
            const b = `${prefix}${fakeData.string.alphanumeric()}${suffix}`;

            //-- When
            const result = matchNamespaceComponent(a, b);

            //-- Then
            expect(result).to.be.true;
        });
        it('should return `true` if only the second namespace component contains a wildcard and the first namespace component matches the pattern', (): void => {
            //-- Given
            const prefix = fakeData.string.alphanumeric();
            const suffix = fakeData.string.alphanumeric();
            const a = `${prefix}${fakeData.string.alphanumeric()}${suffix}`;
            const b = `${prefix}${NAMESPACE_WILDCARD}${suffix}`;

            //-- When
            const result = matchNamespaceComponent(a, b);

            //-- Then
            expect(result).to.be.true;
        });
        it('should return `true` if neither namespace component contains a wildcard and the two namespace components match', (): void => {
            //-- Given
            const a = fakeData.string.alphanumeric();
            const b = a;

            //-- When
            const result = matchNamespaceComponent(a, b);

            //-- Then
            expect(result).to.be.true;
        });
        it('should return `false` if the two namespace components do not match', (): void => {
            //-- Given
            const a = fakeData.string.alphanumeric();
            const b = fakeData.string.alphanumeric();

            //-- When
            const result = matchNamespaceComponent(a, b);

            //-- Then
            expect(result).to.be.false;
        });
    });
    describe('.matchNamespace()', (): void => {
        it('should return `true` if the namespaces are of equal length, contain no wildcards, and match', (): void => {
            //-- Given
            const comps = fakeData.helpers.multiple(() =>
                fakeData.string.alphanumeric()
            );
            const a = createNamespaceFromComponentArray(comps);
            const b = createNamespaceFromComponentArray(comps);

            //-- When
            const result = matchNamespace(a, b);

            //-- Then
            expect(result).to.be.true;
        });
        it('should return `true` if the namespaces are of equal length, contain wildcards, and match', (): void => {
            //-- Given
            const prefixComps = fakeData.helpers.multiple(() =>
                fakeData.string.alphanumeric()
            );
            const suffixComps = [fakeData.string.alphanumeric()];
            const compsA = [...prefixComps, NAMESPACE_WILDCARD];
            const compsB = [...prefixComps, ...suffixComps];
            const a = createNamespaceFromComponentArray(compsA);
            const b = createNamespaceFromComponentArray(compsB);

            //-- When
            const result = matchNamespace(a, b);

            //-- Then
            expect(result).to.be.true;
        });
        it('should return `true` if the namespaces are of equal length, one contain a wildcard, and match', (): void => {
            //-- Given
            const prefixComps = fakeData.helpers.multiple(() =>
                fakeData.string.alphanumeric()
            );
            const suffixComps = fakeData.helpers.multiple(() =>
                fakeData.string.alphanumeric()
            );
            const compsA = [...prefixComps, NAMESPACE_WILDCARD];
            const compsB = [
                ...prefixComps,
                fakeData.string.alphanumeric(),
                ...suffixComps
            ];
            const a = createNamespaceFromComponentArray(compsA);
            const b = createNamespaceFromComponentArray(compsB);

            //-- When
            const result = matchNamespace(a, b);

            //-- Then
            expect(result).to.be.true;
        });
        it('should return `true` if the namespaces are of unequal length, contain wildcards, and match', (): void => {
            //-- Given
            const prefixComps = fakeData.helpers.multiple(
                () => fakeData.string.alphanumeric(),
                {
                    count: 5
                }
            );
            const suffixComps = fakeData.helpers.multiple(
                () => fakeData.string.alphanumeric(),
                {
                    count: 5
                }
            );
            const compsA = [...prefixComps, NAMESPACE_WILDCARD];
            const compsB = [...prefixComps, NAMESPACE_WILDCARD, ...suffixComps];
            const a = createNamespaceFromComponentArray(compsA);
            const b = createNamespaceFromComponentArray(compsB);

            //-- When
            const result = matchNamespace(a, b);

            //-- Then
            expect(result).to.be.true;
        });
        it('should return `false` if the namespaces are of equal length, contain no wildcards, and do not match', (): void => {
            //-- Given
            const compsA = fakeData.helpers.multiple(() =>
                fakeData.string.alphanumeric()
            );
            const compsB = fakeData.helpers.multiple(() =>
                fakeData.string.alphanumeric()
            );
            const a = createNamespaceFromComponentArray(compsA);
            const b = createNamespaceFromComponentArray(compsB);

            //-- When
            const result = matchNamespace(a, b);

            //-- Then
            expect(result).to.be.false;
        });
        it('should return `false` if the namespaces are of unequal length and contain no wildcards', (): void => {
            //-- Given
            const compsA = fakeData.helpers.multiple(
                () => fakeData.string.alphanumeric(),
                {
                    count: 5
                }
            );
            const compsB = fakeData.helpers.multiple(
                () => fakeData.string.alphanumeric(),
                {
                    count: 7
                }
            );
            const a = createNamespaceFromComponentArray(compsA);
            const b = createNamespaceFromComponentArray(compsB);

            //-- When
            const result = matchNamespace(a, b);

            //-- Then
            expect(result).to.be.false;
        });
        it('should return `false` if the namespaces are of equal length, contain wildcards, and do not match', (): void => {
            //-- Given
            const prefixComps = fakeData.helpers.multiple(
                () => fakeData.string.alphanumeric(),
                {
                    count: 5
                }
            );
            const suffixCompsA = fakeData.helpers.multiple(
                () => fakeData.string.alphanumeric(),
                {
                    count: 5
                }
            );
            const suffixCompsB = fakeData.helpers.multiple(
                () => fakeData.string.alphanumeric(),
                {
                    count: 5
                }
            );
            const compsA = [
                ...prefixComps,
                NAMESPACE_WILDCARD,
                ...suffixCompsA
            ];
            const compsB = [
                ...prefixComps,
                NAMESPACE_WILDCARD,
                ...suffixCompsB
            ];
            const a = createNamespaceFromComponentArray(compsA);
            const b = createNamespaceFromComponentArray(compsB);

            //-- When
            const result = matchNamespace(a, b);

            //-- Then
            expect(result).to.be.false;
        });
        it('should return `false` if the namespaces are of unequal length, contain wildcards, and do not match', (): void => {
            //-- Given
            const prefixComps = fakeData.helpers.multiple(
                () => fakeData.string.alphanumeric(),
                {
                    count: 5
                }
            );
            const suffixCompsA = fakeData.helpers.multiple(
                () => fakeData.string.alphanumeric(),
                {
                    count: 5
                }
            );
            const suffixCompsB = fakeData.helpers.multiple(
                () => fakeData.string.alphanumeric(),
                {
                    count: 7
                }
            );
            const compsA = [
                ...prefixComps,
                NAMESPACE_WILDCARD,
                ...suffixCompsA
            ];
            const compsB = [
                ...prefixComps,
                NAMESPACE_WILDCARD,
                ...suffixCompsB
            ];
            const a = createNamespaceFromComponentArray(compsA);
            const b = createNamespaceFromComponentArray(compsB);

            //-- When
            const result = matchNamespace(a, b);

            //-- Then
            expect(result).to.be.false;
        });
    });
});
