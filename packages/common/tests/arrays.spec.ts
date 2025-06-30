//-- NPM Packages
import {beforeAll, describe, expect, it} from 'vitest';
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
        it('should return a new array containing one element from each input array', (): void => {
            //-- Given
            const length = faker.number.int({
                min: 5,
                max: 20
            });
            const arr1 = faker.helpers.multiple(() => faker.number.int(), {
                count: length
            });
            const arr2 = faker.helpers.multiple(
                () => faker.string.alphanumeric(),
                {
                    count: length
                }
            );

            //-- When
            const r = m.zip(arr1, arr2);

            //-- Then
            expect(r).to.have.lengthOf(length);
            r.forEach(([elem1, elem2], i) => {
                expect(elem1).to.equal(arr1[i]);
                expect(elem2).to.equal(arr2[i]);
            });
        });
        it('should return a new array containing `null` for the element of the array that is shorter than the other', (): void => {
            //-- Given
            const length1 = faker.number.int({
                min: 10,
                max: 20
            });
            const length2 = faker.number.int({
                min: 1,
                max: 9
            });
            const arr1 = faker.helpers.multiple(() => faker.number.int(), {
                count: length1
            });
            const arr2 = faker.helpers.multiple(
                () => faker.string.alphanumeric(),
                {
                    count: length2
                }
            );

            //-- When
            const r = m.zip(arr1, arr2);

            //-- Then
            expect(r).to.have.lengthOf(length1);
            r.forEach(([elem1, elem2], i) => {
                expect(elem1).to.equal(arr1[i]);
                if (i < length2) {
                    expect(elem2).to.equal(arr2[i]);
                } else {
                    expect(elem2).to.be.null;
                }
            });

            //-- Given
            const length3 = faker.number.int({
                min: 1,
                max: 9
            });
            const length4 = faker.number.int({
                min: 10,
                max: 20
            });
            const arr3 = faker.helpers.multiple(() => faker.number.int(), {
                count: length3
            });
            const arr4 = faker.helpers.multiple(
                () => faker.string.alphanumeric(),
                {
                    count: length4
                }
            );

            //-- When
            const r2 = m.zip(arr3, arr4);

            //-- Then
            expect(r2).to.have.lengthOf(length4);
            r2.forEach(([elem1, elem2], i) => {
                if (i < length3) {
                    expect(elem1).to.equal(arr3[i]);
                } else {
                    expect(elem1).to.be.null;
                }
                expect(elem2).to.equal(arr4[i]);
            });
        });
    });
});
