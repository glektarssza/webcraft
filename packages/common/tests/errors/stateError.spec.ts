//-- NPM Packages
import chai, {expect} from 'chai';
import sinonChai from 'sinon-chai';
import {Faker, en, en_CA, en_US, base} from '@faker-js/faker';

//-- Project Code
import {StateError} from '@src/errors/stateError';

chai.use(sinonChai);

/**
 * The fake data generator.
 */
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:webcraft-common.errors', () => {
    describe('class:StateError', () => {
        describe('.constructor()', () => {
            it('should pass the `message` parameter to the base class', () => {
                //-- Given
                const objectType = faker.database.column();
                const operationName = faker.database.column();
                const message = faker.lorem.sentence();

                //-- When
                const r = new StateError(objectType, operationName, message);

                //-- Then
                expect(r.message).to.equal(message);
            });
            it('should pass a default `message` parameter to the base class if none is provided', () => {
                //-- Given
                const objectType = faker.database.column();
                const operationName = faker.database.column();

                //-- When
                const r = new StateError(objectType, operationName);

                //-- Then
                expect(r.message).to.equal(
                    `Operation "${operationName}" failed (object of type "${objectType}" was in an invalid state)`
                );
            });
            it('should pass the `inner` parameter to the base class', () => {
                //-- Given
                const objectType = faker.database.column();
                const operationName = faker.database.column();
                const inner = new Error();

                //-- When
                const r = new StateError(
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
                const r = new StateError(objectType, operationName);

                //-- Then
                expect(r.inner).to.be.undefined;
            });
            it('should pass the `operationName` parameter to the base class', () => {
                //-- Given
                const objectType = faker.database.column();
                const operationName = faker.database.column();

                //-- When
                const r = new StateError(objectType, operationName);

                //-- Then
                expect(r.operationName).to.equal(operationName);
            });
            it('should set the `objectType` property to the given value', () => {
                //-- Given
                const objectType = faker.database.column();
                const operationName = faker.database.column();

                //-- When
                const r = new StateError(objectType, operationName);

                //-- Then
                expect(r.objectType).to.equal(objectType);
            });
            it('should set the `name` property to `StateError`', () => {
                //-- Given
                const objectType = faker.database.column();
                const operationName = faker.database.column();

                //-- When
                const r = new StateError(objectType, operationName);

                //-- Then
                expect(r.name).to.equal(StateError.name);
            });
        });
    });
});
