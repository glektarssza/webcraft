//-- NPM Packages
import {beforeAll, describe, expect, it} from 'vitest';
import {Faker, base, en, en_CA, en_US} from '@faker-js/faker';

//-- Project Code
import * as m from '@src/severity';

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
    describe('.isSeverityName()', (): void => {
        it('should return `true` if the value is a severity name', (): void => {
            //-- Given

            //-- When
            const r = m.isSeverityName('info');

            //-- Then
            expect(r).toBe(true);
        });
        it('should return `false` if the value is not a severity name', (): void => {
            //-- Given
            const values: unknown[] = [[], {}, false, 1, 1.1, null, undefined];

            values.forEach((value) => {
                //-- When
                const r = m.isSeverityName(value);

                //-- Then
                expect(r).toBe(false);
            });
        });
    });
    describe('.isSeverityValue()', (): void => {
        it('should return `true` if the value is a severity value', (): void => {
            //-- Given

            //-- When
            const r = m.isSeverityValue(1);

            //-- Then
            expect(r).toBe(true);
        });
        it('should return `false` if the value is not a severity value', (): void => {
            //-- Given
            const values: unknown[] = [[], {}, false, 'info', null, undefined];

            values.forEach((value) => {
                //-- When
                const r = m.isSeverityValue(value);

                //-- Then
                expect(r).toBe(false);
            });
        });
    });
    describe('.isSeverity()', (): void => {
        it('should return `true` if the value is a severity', (): void => {
            //-- Given
            const values: unknown[] = ['info', 1, 1.1];

            values.forEach((value) => {
                //-- When
                const r = m.isSeverity(value);

                //-- Then
                expect(r).toBe(true);
            });
        });
        it('should return `false` if the value is not a severity', (): void => {
            //-- Given
            const values: unknown[] = [[], {}, false, null, undefined];

            values.forEach((value) => {
                //-- When
                const r = m.isSeverity(value);

                //-- Then
                expect(r).toBe(false);
            });
        });
    });
});
