//-- NPM Packages
import {expect} from 'chai';
import {Faker, en, en_CA, en_US, base} from '@faker-js/faker';

//-- Project Code
import {getTestModule} from '@src/index';

const module = getTestModule();

/**
 * The fake data generator.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:webcraft-package-template', () => {
    describe('.helloWorld()', () => {
        it('should return the string `Hello world`', () => {
            //-- Given

            //-- When
            const r = module.helloWorld();

            //-- Then
            expect(r).to.equal('Hello world!');
        });
    });
});
