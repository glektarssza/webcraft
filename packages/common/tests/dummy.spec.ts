//-- NPM Packages
import {expect} from 'chai';
import {Faker, base, en, en_CA, en_US} from '@faker-js/faker';
import {reset, restore} from 'sinon';

/**
 * The fake data provider.
 */
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('A dummy test module', (): void => {
    before(() => {
        const possibleSeed = process.env.FAKER_SEED;
        if (possibleSeed && isFinite(parseInt(possibleSeed))) {
            faker.seed(parseInt(possibleSeed));
        }
    });
    afterEach(() => {
        reset();
    });
    after(() => {
        restore();
    });
    it('should pass', (): void => {
        expect(true).to.be.true;
    });
});
