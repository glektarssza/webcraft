//-- NPM Packages
import {expect} from 'chai';
import {Faker, en, en_CA, en_US, base} from '@faker-js/faker';

//-- Project Code
import {ArgumentRangeError} from '@src/errors/argumentRangeError';

/**
 * The fake data generator.
 */
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:webcraft-common.errors', () => {
    describe('class:ArgumentRangeError', () => {
        describe('.constructor()', () => {
            it('should pass the `message` parameter to the base class', () => {
                //-- Given
                const actualValue = faker.number.int({
                    min: 20,
                    max: 40
                });
                const minimumValue =
                    actualValue -
                    faker.number.int({
                        min: 1,
                        max: 20
                    });
                const maximumValue =
                    actualValue +
                    faker.number.int({
                        min: 1,
                        max: 20
                    });
                const argumentName = faker.database.column();
                const message = faker.lorem.sentence();

                //-- When
                const r = new ArgumentRangeError(
                    actualValue,
                    minimumValue,
                    maximumValue,
                    argumentName,
                    message
                );

                //-- Then
                expect(r.message).to.equal(message);
            });
            it('should pass a default `message` parameter to the base class if none is provided', () => {
                //-- Given
                const actualValue = faker.number.int({
                    min: 20,
                    max: 40
                });
                const minimumValue =
                    actualValue -
                    faker.number.int({
                        min: 1,
                        max: 20
                    });
                const maximumValue =
                    actualValue +
                    faker.number.int({
                        min: 1,
                        max: 20
                    });
                const argumentName = faker.database.column();

                //-- When
                const r = new ArgumentRangeError(
                    actualValue,
                    minimumValue,
                    maximumValue,
                    argumentName
                );

                //-- Then
                expect(r.message).to.equal(
                    `Invalid argument "${argumentName}" (value "${actualValue}" is outside the allowed range of "${minimumValue}" to "${maximumValue}")`
                );
            });
            it('should pass the `inner` parameter to the base class', () => {
                //-- Given
                const actualValue = faker.number.int({
                    min: 20,
                    max: 40
                });
                const minimumValue =
                    actualValue -
                    faker.number.int({
                        min: 1,
                        max: 20
                    });
                const maximumValue =
                    actualValue +
                    faker.number.int({
                        min: 1,
                        max: 20
                    });
                const argumentName = faker.database.column();
                const inner = new Error();

                //-- When
                const r = new ArgumentRangeError(
                    actualValue,
                    minimumValue,
                    maximumValue,
                    argumentName,
                    undefined,
                    inner
                );

                //-- Then
                expect(r.inner).to.equal(inner);
            });
            it('should pass an `undefined` `inner` parameter to the base class if none is provided', () => {
                //-- Given
                const actualValue = faker.number.int({
                    min: 20,
                    max: 40
                });
                const minimumValue =
                    actualValue -
                    faker.number.int({
                        min: 1,
                        max: 20
                    });
                const maximumValue =
                    actualValue +
                    faker.number.int({
                        min: 1,
                        max: 20
                    });
                const argumentName = faker.database.column();

                //-- When
                const r = new ArgumentRangeError(
                    actualValue,
                    minimumValue,
                    maximumValue,
                    argumentName
                );

                //-- Then
                expect(r.inner).to.be.undefined;
            });
            it('should pass the `argumentName` property to the base class', () => {
                //-- Given
                const actualValue = faker.number.int({
                    min: 20,
                    max: 40
                });
                const minimumValue =
                    actualValue -
                    faker.number.int({
                        min: 1,
                        max: 20
                    });
                const maximumValue =
                    actualValue +
                    faker.number.int({
                        min: 1,
                        max: 20
                    });
                const argumentName = faker.database.column();

                //-- When
                const r = new ArgumentRangeError(
                    actualValue,
                    minimumValue,
                    maximumValue,
                    argumentName
                );

                //-- Then
                expect(r.argumentName).to.equal(argumentName);
            });
            it('should set the `actualValue` property to the given value', () => {
                //-- Given
                const actualValue = faker.number.int({
                    min: 20,
                    max: 40
                });
                const minimumValue =
                    actualValue -
                    faker.number.int({
                        min: 1,
                        max: 20
                    });
                const maximumValue =
                    actualValue +
                    faker.number.int({
                        min: 1,
                        max: 20
                    });
                const argumentName = faker.database.column();

                //-- When
                const r = new ArgumentRangeError(
                    actualValue,
                    minimumValue,
                    maximumValue,
                    argumentName
                );

                //-- Then
                expect(r.actualValue).to.equal(actualValue);
            });
            it('should set the `minimumValue` property to the given value', () => {
                //-- Given
                const actualValue = faker.number.int({
                    min: 20,
                    max: 40
                });
                const minimumValue =
                    actualValue -
                    faker.number.int({
                        min: 1,
                        max: 20
                    });
                const maximumValue =
                    actualValue +
                    faker.number.int({
                        min: 1,
                        max: 20
                    });
                const argumentName = faker.database.column();

                //-- When
                const r = new ArgumentRangeError(
                    actualValue,
                    minimumValue,
                    maximumValue,
                    argumentName
                );

                //-- Then
                expect(r.minimumValue).to.equal(minimumValue);
            });
            it('should set the `maximumValue` property to the given value', () => {
                //-- Given
                const actualValue = faker.number.int({
                    min: 20,
                    max: 40
                });
                const minimumValue =
                    actualValue -
                    faker.number.int({
                        min: 1,
                        max: 20
                    });
                const maximumValue =
                    actualValue +
                    faker.number.int({
                        min: 1,
                        max: 20
                    });
                const argumentName = faker.database.column();

                //-- When
                const r = new ArgumentRangeError(
                    actualValue,
                    minimumValue,
                    maximumValue,
                    argumentName
                );

                //-- Then
                expect(r.maximumValue).to.equal(maximumValue);
            });
            it('should set the `name` property to `ArgumentRangeError`', () => {
                //-- Given
                const actualValue = faker.number.int({
                    min: 20,
                    max: 40
                });
                const minimumValue =
                    actualValue -
                    faker.number.int({
                        min: 1,
                        max: 20
                    });
                const maximumValue =
                    actualValue +
                    faker.number.int({
                        min: 1,
                        max: 20
                    });
                const argumentName = faker.database.column();

                //-- When
                const r = new ArgumentRangeError(
                    actualValue,
                    minimumValue,
                    maximumValue,
                    argumentName
                );

                //-- Then
                expect(r.name).to.equal(ArgumentRangeError.name);
            });
        });
    });
});
