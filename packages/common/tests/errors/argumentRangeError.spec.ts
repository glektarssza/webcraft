//-- NPM Packages
import chai, {expect} from 'chai';
import sinonChai from 'sinon-chai';
import {Faker, en, en_CA, en_US, base} from '@faker-js/faker';

//-- Project Code
import {ArgumentRangeError} from '@src/errors/argumentRangeError';

chai.use(sinonChai);

/**
 * The fake data generator.
 */
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:webcraft-common.errors', () => {
    describe('.ArgumentRangeError', () => {
        describe('.constructor()', () => {
            it('should pass the argument name to the base class', () => {
                //-- Given
                const argumentName = faker.lorem.word();
                const message = faker.lorem.sentence();
                const actualValue = faker.number.int();
                const minimumValue = faker.number.int();
                const maximumValue = faker.number.int();

                //-- When
                const e = new ArgumentRangeError(
                    argumentName,
                    actualValue,
                    minimumValue,
                    maximumValue,
                    message
                );

                //-- Then
                expect(e.argumentName).to.equal(argumentName);
            });
            it('should pass the message to the base class', () => {
                //-- Given
                const argumentName = faker.lorem.word();
                const message = faker.lorem.sentence();
                const actualValue = faker.number.int();
                const minimumValue = faker.number.int();
                const maximumValue = faker.number.int();

                //-- When
                const e = new ArgumentRangeError(
                    argumentName,
                    actualValue,
                    minimumValue,
                    maximumValue,
                    message
                );

                //-- Then
                expect(e.message).to.equal(message);
            });
            it('should pass the inner error to the base class', () => {
                //-- Given
                const argumentName = faker.lorem.word();
                const message = faker.lorem.sentence();
                const actualValue = faker.number.int();
                const minimumValue = faker.number.int();
                const maximumValue = faker.number.int();
                const inner = new Error(faker.lorem.sentence());

                //-- When
                const e = new ArgumentRangeError(
                    argumentName,
                    actualValue,
                    minimumValue,
                    maximumValue,
                    message,
                    inner
                );

                //-- Then
                expect(e.inner).to.equal(inner);
            });
            it('should set the `name` property to `ArgumentRangeError`', () => {
                //-- Given
                const argumentName = faker.lorem.word();
                const message = faker.lorem.sentence();
                const actualValue = faker.number.int();
                const minimumValue = faker.number.int();
                const maximumValue = faker.number.int();

                //-- When
                const e = new ArgumentRangeError(
                    argumentName,
                    actualValue,
                    minimumValue,
                    maximumValue,
                    message
                );

                //-- Then
                expect(e.name).to.equal('ArgumentRangeError');
            });
            it('should set the `actualValue` property to the provided value', () => {
                //-- Given
                const argumentName = faker.lorem.word();
                const message = faker.lorem.sentence();
                const actualValue = faker.number.int();
                const minimumValue = faker.number.int();
                const maximumValue = faker.number.int();

                //-- When
                const e = new ArgumentRangeError(
                    argumentName,
                    actualValue,
                    minimumValue,
                    maximumValue,
                    message
                );

                //-- Then
                expect(e.actualValue).to.equal(actualValue);
            });
            it('should set the `minimumValue` property to the provided value', () => {
                //-- Given
                const argumentName = faker.lorem.word();
                const message = faker.lorem.sentence();
                const actualValue = faker.number.int();
                const minimumValue = faker.number.int();
                const maximumValue = faker.number.int();

                //-- When
                const e = new ArgumentRangeError(
                    argumentName,
                    actualValue,
                    minimumValue,
                    maximumValue,
                    message
                );

                //-- Then
                expect(e.minimumValue).to.equal(minimumValue);
            });
            it('should set the `maximumValue` property to the provided value', () => {
                //-- Given
                const argumentName = faker.lorem.word();
                const message = faker.lorem.sentence();
                const actualValue = faker.number.int();
                const minimumValue = faker.number.int();
                const maximumValue = faker.number.int();

                //-- When
                const e = new ArgumentRangeError(
                    argumentName,
                    actualValue,
                    minimumValue,
                    maximumValue,
                    message
                );

                //-- Then
                expect(e.maximumValue).to.equal(maximumValue);
            });
        });
    });
});
