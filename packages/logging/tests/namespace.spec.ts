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

            //-- When
            const r = m.isNamespace('a:b:c');

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
            const components = ['a', 'b', 'c'];

            //-- When
            const r = m.namespaceFromComponents(...components);

            //-- Then
            expect(r).toBe('a:b:c');
        });
    });
    describe('.namespaceToComponents()', (): void => {
        it('should split a namespace into its components', (): void => {
            //-- Given
            const namespace = 'a:b:c';

            //-- When
            const r = m.namespaceToComponents(namespace);

            //-- Then
            expect(r).toEqual(['a', 'b', 'c']);
        });
    });
});
