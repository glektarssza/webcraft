//-- NPM Packages
import {beforeAll, describe, expect, it} from 'vitest';
import {Faker, base, en, en_CA, en_US} from '@faker-js/faker';

/**
 * The fake data provider.
 */
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('A dummy test module', (): void => {
    beforeAll(() => {
        if (FAKER_SEED && isFinite(parseInt(FAKER_SEED))) {
            faker.seed(parseInt(FAKER_SEED));
        }
    });
    it('should pass', (): void => {
        expect(true).to.be.true;
    });
});
