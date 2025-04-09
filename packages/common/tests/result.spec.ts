//-- NPM Packages
import {beforeAll, describe, expect, it} from 'vitest';
import {Faker, base, en, en_CA, en_US} from '@faker-js/faker';

//-- Project Code
import * as m from '@src/result';

/**
 * The fake data provider.
 */
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:result', (): void => {
    beforeAll(() => {
        if (FAKER_SEED && isFinite(parseInt(FAKER_SEED))) {
            faker.seed(parseInt(FAKER_SEED));
        }
    });
    describe('class:Result', (): void => {
        describe('.ok()', (): void => {
            it('should return a new object with the given success value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();

                //-- When
                const r = m.Result.ok(value);

                //-- Then
                expect(r).to.have.property('_holdsSuccess').which.is.true;
                expect(r).to.have.property('_successValue').which.equals(value);
            });
        });
        describe('.error()', (): void => {
            it('should return a new object with the given error value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();

                //-- When
                const r = m.Result.error(value);

                //-- Then
                expect(r).to.have.property('_holdsError').which.is.true;
                expect(r).to.have.property('_errorValue').which.equals(value);
            });
        });
    });
});
