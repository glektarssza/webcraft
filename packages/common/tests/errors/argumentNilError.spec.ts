//-- NPM Packages
import chai, {expect} from 'chai';
import sinonChai from 'sinon-chai';
import {Faker, en, en_CA, en_US, base} from '@faker-js/faker';

//-- Project Code
import {ArgumentNilError} from '@src/errors/argumentNilError';

chai.use(sinonChai);

/**
 * The fake data generator.
 */
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:webcraft-common.errors', () => {
    describe('.ArgumentNilError', () => {
        describe('.constructor()', () => {
            it('should pass the argument name to the base class', () => {
                //-- Given
                const argumentName = faker.lorem.word();
                const message = faker.lorem.sentence();

                //-- When
                const e = new ArgumentNilError(argumentName, message);

                //-- Then
                expect(e.argumentName).to.equal(argumentName);
            });
            it('should pass the message to the base class', () => {
                //-- Given
                const argumentName = faker.lorem.word();
                const message = faker.lorem.sentence();

                //-- When
                const e = new ArgumentNilError(argumentName, message);

                //-- Then
                expect(e.message).to.equal(message);
            });
            it('should pass the inner error to the base class', () => {
                //-- Given
                const argumentName = faker.lorem.word();
                const inner = new Error(faker.lorem.sentence());

                //-- When
                const e = new ArgumentNilError(
                    argumentName,
                    faker.lorem.sentence(),
                    inner
                );

                //-- Then
                expect(e.inner).to.equal(inner);
            });
            it('should set the `name` property to `ArgumentNilError`', () => {
                //-- Given
                const argumentName = faker.lorem.word();
                const message = faker.lorem.sentence();

                //-- When
                const e = new ArgumentNilError(argumentName, message);

                //-- Then
                expect(e.name).to.equal('ArgumentNilError');
            });
        });
    });
});
