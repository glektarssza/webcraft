//-- NPM Packages
import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {Faker, en, en_CA, en_US, base} from '@faker-js/faker';

//-- Project Code
import * as lib from '@src';

chai.use(sinonChai);

/**
 * The fake data generator.
 */
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:webcraft-common', () => {
    describe('.helloWorld()', () => {
        it('should return the string `Hello world`', () => {
            //-- Given

            //-- When
            const r = lib.helloWorld();

            //-- Then
            expect(r).to.equal('Hello world!');
        });
    });
});
