//-- NPM Packages
import chai, {expect} from 'chai';
import sinonChai from 'sinon-chai';
import {Faker, en, en_CA, en_US, base} from '@faker-js/faker';

//-- Project Code
import {ObjectDisposedError} from '@src/errors/objectDisposedError';

chai.use(sinonChai);

/**
 * The fake data generator.
 */
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:webcraft-common.errors', () => {
    describe('.ArgumentError', () => {
        describe('.constructor()', () => {
            it('should pass the operation name on to the base class', () => {
                //-- Given
                const operationName = faker.lorem.word();
                const objectType = faker.lorem.word();
                const message = faker.lorem.sentence();

                //-- When
                const e = new ObjectDisposedError(
                    operationName,
                    objectType,
                    message
                );

                //-- Then
                expect(e.operationName).to.equal(operationName);
            });
            it('should pass the object type on to the base class', () => {
                //-- Given
                const operationName = faker.lorem.word();
                const objectType = faker.lorem.word();
                const message = faker.lorem.sentence();

                //-- When
                const e = new ObjectDisposedError(
                    operationName,
                    objectType,
                    message
                );

                //-- Then
                expect(e.objectType).to.equal(objectType);
            });
            it('should pass a default message on to the base class', () => {
                //-- Given
                const operationName = faker.lorem.word();
                const objectType = faker.lorem.word();

                //-- When
                const e = new ObjectDisposedError(operationName, objectType);

                //-- Then
                expect(e.message).to.equal(
                    `The object of type "${objectType}" was in an invalid state for the operation "${operationName}" (object has been disposed)`
                );
            });
            it('should pass the message on to the base class', () => {
                //-- Given
                const operationName = faker.lorem.word();
                const objectType = faker.lorem.word();
                const message = faker.lorem.sentence();

                //-- When
                const e = new ObjectDisposedError(
                    operationName,
                    objectType,
                    message
                );

                //-- Then
                expect(e.message).to.equal(message);
            });
            it('should pass the inner error on to the base class', () => {
                //-- Given
                const operationName = faker.lorem.word();
                const objectType = faker.lorem.word();
                const message = faker.lorem.sentence();
                const inner = new Error(faker.lorem.sentence());

                //-- When
                const e = new ObjectDisposedError(
                    operationName,
                    objectType,
                    message,
                    inner
                );

                //-- Then
                expect(e.inner).to.equal(inner);
            });
            it('should set the `name` property to `ObjectDisposedError`', () => {
                //-- Given
                const operationName = faker.lorem.word();
                const objectType = faker.lorem.word();
                const message = faker.lorem.sentence();

                //-- When
                const e = new ObjectDisposedError(
                    operationName,
                    objectType,
                    message
                );

                //-- Then
                expect(e.name).to.equal('ObjectDisposedError');
            });
        });
    });
});
