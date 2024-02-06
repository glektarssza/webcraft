//-- NPM Packages
import {expect} from 'chai';
import {Faker, en, en_CA, en_US, base} from '@faker-js/faker';

//-- Project Code
import {DisposedError} from '@src/errors/disposedError';

/**
 * The fake data generator.
 */
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:webcraft-common.errors', () => {
    describe('class:DisposedError', () => {
        describe('.constructor()', () => {
            it('should pass the `message` parameter to the base class', () => {
                //-- Given
                const objectType = faker.database.column();
                const operationName = faker.database.column();
                const message = faker.lorem.sentence();

                //-- When
                const r = new DisposedError(objectType, operationName, message);

                //-- Then
                expect(r.message).to.equal(message);
            });
            it('should pass a default `message` parameter to the base class if none is provided', () => {
                //-- Given
                const objectType = faker.database.column();
                const operationName = faker.database.column();

                //-- When
                const r = new DisposedError(objectType, operationName);

                //-- Then
                expect(r.message).to.equal(
                    `Operation "${operationName}" failed (object of type "${objectType}" has been disposed)`
                );
            });
            it('should pass the `inner` parameter to the base class', () => {
                //-- Given
                const objectType = faker.database.column();
                const operationName = faker.database.column();
                const inner = new Error();

                //-- When
                const r = new DisposedError(
                    objectType,
                    operationName,
                    undefined,
                    inner
                );

                //-- Then
                expect(r.inner).to.equal(inner);
            });
            it('should pass an `undefined` `inner` parameter to the base class if none is provided', () => {
                //-- Given
                const objectType = faker.database.column();
                const operationName = faker.database.column();

                //-- When
                const r = new DisposedError(objectType, operationName);

                //-- Then
                expect(r.inner).to.be.undefined;
            });
            it('should pass the `operationName` parameter to the base class', () => {
                //-- Given
                const objectType = faker.database.column();
                const operationName = faker.database.column();

                //-- When
                const r = new DisposedError(objectType, operationName);

                //-- Then
                expect(r.operationName).to.equal(operationName);
            });
            it('should pass the `objectType` parameter to the base class', () => {
                //-- Given
                const objectType = faker.database.column();
                const operationName = faker.database.column();

                //-- When
                const r = new DisposedError(objectType, operationName);

                //-- Then
                expect(r.objectType).to.equal(objectType);
            });
            it('should set the `name` property to `DisposedError`', () => {
                //-- Given
                const objectType = faker.database.column();
                const operationName = faker.database.column();

                //-- When
                const r = new DisposedError(objectType, operationName);

                //-- Then
                expect(r.name).to.equal(DisposedError.name);
            });
        });
    });
});
