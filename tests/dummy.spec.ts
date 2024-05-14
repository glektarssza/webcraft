//-- NPM Packages
import {expect} from 'chai';
import sinon from 'sinon';
import {base, en, en_CA, en_US, Faker} from '@faker-js/faker';

/**
 * The fake data generator.
 */
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('A dummy test', () => {
    beforeEach(() => {
        if (process.env.FAKER_SEED) {
            const parsedSeed = parseInt(process.env.FAKER_SEED);
            if (isFinite(parsedSeed)) {
                faker.seed(parsedSeed);
            }
        }
    });
    after(() => {
        sinon.restore();
    });
    it('should pass', () => {
        expect(true).to.be.true;
    });
});
