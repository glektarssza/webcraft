//-- NPM Packages
import {expect} from 'chai';
import {base, en, en_CA, en_US, Faker} from '@faker-js/faker';

//-- Project Code
// TODO

/**
 * The fake data provider.
 */
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('A dummy test', () => {
    before(() => {
        faker.seed();
    });
    it('should pass', () => {
        expect('Hello world!').to.equal('Hello world!');
    });
});
