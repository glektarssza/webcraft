//-- NPM Packages
import chai, {expect} from 'chai';
import sinonChai from 'sinon-chai';
import {Faker, en, en_CA, en_US, base} from '@faker-js/faker';

//-- Project Code
import {WebGLError} from '@src/errors/webglError';
import {ErrorCode} from '@src/errorCode';

chai.use(sinonChai);

/**
 * The fake data generator.
 */
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:webcraft-webgl.errors', () => {
    describe('class:Buffer', () => {
        const errorCodes = [
            ErrorCode.ContextLost,
            ErrorCode.InvalidEnum,
            ErrorCode.InvalidFramebufferOperation,
            ErrorCode.InvalidOperation,
            ErrorCode.InvalidValue,
            ErrorCode.OutOfMemory
        ];
        describe('.constructor()', () => {
            it('should pass the `operationName` parameter to the base class', () => {
                //-- Given
                const errorCode = faker.helpers.arrayElement(errorCodes);
                const operationName = faker.database.column();

                //-- When
                const r = new WebGLError(errorCode, operationName);

                //-- Then
                expect(r.operationName).to.equal(operationName);
            });
            it('should pass the `message` parameter to the base class', () => {
                //-- Given
                const errorCode = faker.helpers.arrayElement(errorCodes);
                const operationName = faker.database.column();
                const message = faker.lorem.sentence();

                //-- When
                const r = new WebGLError(errorCode, operationName, message);

                //-- Then
                expect(r.message).to.equal(message);
            });
            it('should pass a default `message` parameter to the base class if none is provider', () => {
                //-- Given
                const errorCode = faker.helpers.arrayElement(errorCodes);
                const operationName = faker.database.column();

                //-- When
                const r = new WebGLError(errorCode, operationName);

                //-- Then
                expect(r.message).to.equal(
                    `WebGL operation "${operationName}" failed with error "${ErrorCode[errorCode]}"`
                );
            });
            it('should pass the `inner` parameter to the base class', () => {
                //-- Given
                const errorCode = faker.helpers.arrayElement(errorCodes);
                const operationName = faker.database.column();
                const inner = new Error();

                //-- When
                const r = new WebGLError(
                    errorCode,
                    operationName,
                    undefined,
                    inner
                );

                //-- Then
                expect(r.inner).to.equal(inner);
            });
            it('should pass `undefined` as the `inner` parameter to the base class if none is provided', () => {
                //-- Given
                const errorCode = faker.helpers.arrayElement(errorCodes);
                const operationName = faker.database.column();

                //-- When
                const r = new WebGLError(errorCode, operationName);

                //-- Then
                expect(r.inner).to.be.undefined;
            });
            it('should set the `errorCode` property to the given value', () => {
                //-- Given
                const errorCode = faker.helpers.arrayElement(errorCodes);
                const operationName = faker.database.column();

                //-- When
                const r = new WebGLError(errorCode, operationName);

                //-- Then
                expect(r.errorCode).to.equal(errorCode);
            });
        });
    });
});
