//-- NPM Packages
import chai, {expect} from 'chai';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {Faker, en, en_CA, en_US, base} from '@faker-js/faker';

//-- Project Code
import * as lib from '@src';

chai.use(sinonChai);

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
            const r = lib.helloWorld();

            //-- Then
            expect(r).to.equal('Hello world!');
        });
    });
});
