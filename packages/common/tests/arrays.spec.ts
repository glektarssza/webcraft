//-- NPM Packages
import {beforeAll, describe, expect, it, vi} from 'vitest';
import {Faker, base, en, en_CA, en_US} from '@faker-js/faker';

//-- Project Code
import * as m from '@src/arrays';

/**
 * The fake data provider.
 */
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:arrays', (): void => {
    beforeAll(() => {
        if (FAKER_SEED && isFinite(parseInt(FAKER_SEED))) {
            faker.seed(parseInt(FAKER_SEED));
        }
    });
    describe('.zip()', (): void => {
        it('should return a new, empty array if both input arrays are empty', (): void => {
            //-- Given
            const arr1: unknown[] = [];
            const arr2: unknown[] = [];

            //-- When
            const r = m.zip(arr1, arr2);

            //-- Then
            expect(r).to.be.empty;
        });
    });
});
