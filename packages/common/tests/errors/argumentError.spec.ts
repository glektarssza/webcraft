//-- NPM Packages
import chai, {expect} from 'chai';
import sinonChai from 'sinon-chai';
import {Faker, en, en_CA, en_US, base} from '@faker-js/faker';

//-- Project Code
import {ArgumentError} from '@src/errors/argumentError';

chai.use(sinonChai);

/**
 * The fake data generator.
 */
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:webcraft-common.errors', () => {
    describe('class:ArgumentError', () => {
        describe('.constructor()', () => {
            it('should pass the `message` parameter to the base class', () => {
                //-- Given
                const argumentName = faker.database.column();
                const message = faker.lorem.sentence();

                //-- When
                const r = new ArgumentError(argumentName, message);

                //-- Then
                expect(r.message).to.equal(message);
            });
            it('should pass a default `message` parameter to the base class if none is provided', () => {
                //-- Given
                const argumentName = faker.database.column();

                //-- When
                const r = new ArgumentError(argumentName);

                //-- Then
                expect(r.message).to.equal(
                    `Invalid argument "${argumentName}"`
                );
            });
            it('should pass the `inner` parameter to the base class', () => {
                //-- Given
                const argumentName = faker.database.column();
                const inner = new Error();

                //-- When
                const r = new ArgumentError(argumentName, undefined, inner);

                //-- Then
                expect(r.inner).to.equal(inner);
            });
            it('should pass an `undefined` `inner` parameter to the base class if none is provided', () => {
                //-- Given
                const argumentName = faker.database.column();

                //-- When
                const r = new ArgumentError(argumentName);

                //-- Then
                expect(r.inner).to.be.undefined;
            });
            it('should set the `argumentName` property to the given value', () => {
                //-- Given
                const argumentName = faker.database.column();

                //-- When
                const r = new ArgumentError(argumentName);

                //-- Then
                expect(r.argumentName).to.equal(argumentName);
            });
            it('should set the `name` property to `ArgumentError`', () => {
                //-- Given
                const argumentName = faker.database.column();

                //-- When
                const r = new ArgumentError(argumentName);

                //-- Then
                expect(r.name).to.equal(ArgumentError.name);
            });
        });
    });
});
