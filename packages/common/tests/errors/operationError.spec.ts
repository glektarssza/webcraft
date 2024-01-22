//-- NPM Packages
import chai, {expect} from 'chai';
import sinonChai from 'sinon-chai';
import {Faker, en, en_CA, en_US, base} from '@faker-js/faker';

//-- Project Code
import {OperationError} from '@src/errors/operationError';

chai.use(sinonChai);

/**
 * The fake data generator.
 */
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:webcraft-common.errors', () => {
    describe('class:OperationError', () => {
        describe('.constructor()', () => {
            it('should pass the `message` parameter to the base class', () => {
                //-- Given
                const operationName = faker.database.column();
                const message = faker.lorem.sentence();

                //-- When
                const r = new OperationError(operationName, message);

                //-- Then
                expect(r.message).to.equal(message);
            });
            it('should pass a default `message` parameter to the base class if none is provided', () => {
                //-- Given
                const operationName = faker.database.column();

                //-- When
                const r = new OperationError(operationName);

                //-- Then
                expect(r.message).to.equal(
                    `Operation "${operationName}" failed`
                );
            });
            it('should pass the `inner` parameter to the base class', () => {
                //-- Given
                const operationName = faker.database.column();
                const inner = new Error();

                //-- When
                const r = new OperationError(operationName, undefined, inner);

                //-- Then
                expect(r.inner).to.equal(inner);
            });
            it('should pass an `undefined` `inner` parameter to the base class if none is provided', () => {
                //-- Given
                const operationName = faker.database.column();

                //-- When
                const r = new OperationError(operationName);

                //-- Then
                expect(r.inner).to.be.undefined;
            });
            it('should set the `operationName` property to the given value', () => {
                //-- Given
                const operationName = faker.database.column();

                //-- When
                const r = new OperationError(operationName);

                //-- Then
                expect(r.operationName).to.equal(operationName);
            });
            it('should set the `name` property to `OperationError`', () => {
                //-- Given
                const operationName = faker.database.column();

                //-- When
                const r = new OperationError(operationName);

                //-- Then
                expect(r.name).to.equal(OperationError.name);
            });
        });
    });
});
