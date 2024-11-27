//-- NPM
import {Faker, base, en, en_CA, en_US} from '@faker-js/faker';
import {beforeAll, describe, expect, it} from 'vitest';

//-- Project Code
import {
    isNamespace,
    isNamespaceComponent,
    isNamespaceComponentArray
} from '@src/namespace';

/**
 * The fake data source.
 */
const fakeData = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:logging/namespace', (): void => {
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
            const nscArray = [
                fakeData.string.alphanumeric(),
                `${fakeData.string.alphanumeric()}:${fakeData.string.alphanumeric()}`
            ];

            //-- When
            const result = isNamespaceComponentArray(nscArray);

            //-- Then
            expect(result).to.be.false;
        });
    });
});
