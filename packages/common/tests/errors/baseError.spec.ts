//-- NPM Packages
import chai, {expect} from 'chai';
import {stub, SinonStub} from 'sinon';
import sinonChai from 'sinon-chai';
import {Faker, en, en_CA, en_US, base} from '@faker-js/faker';

//-- Project Code
import {BaseError} from '@src/errors/baseError';

chai.use(sinonChai);

/**
 * The fake data generator.
 */
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:webcraft-common.errors', () => {
    describe('class:BaseError', () => {
        describe('.constructor()', () => {
            let captureStackTraceStub: SinonStub<
                Parameters<Required<ErrorConstructor>['captureStackTrace']>,
                ReturnType<Required<ErrorConstructor>['captureStackTrace']>
            >;
            before(() => {
                // HACK: Force types to align
                captureStackTraceStub = stub(
                    Error,
                    'captureStackTrace'
                ) as SinonStub<
                    Parameters<Required<ErrorConstructor>['captureStackTrace']>,
                    ReturnType<Required<ErrorConstructor>['captureStackTrace']>
                >;
            });
            beforeEach(() => {
                captureStackTraceStub.reset();

                captureStackTraceStub.throws(new Error('Stubbed function'));
            });
            after(() => {
                captureStackTraceStub.restore();
            });
            it('should pass the `message` parameter to the base class', () => {
                //-- Given
                const message = faker.lorem.sentence();
                captureStackTraceStub.returns();

                //-- When
                const r = new BaseError(message);

                //-- Then
                expect(r.message).to.equal(message);
            });
            it('should set the `inner` property to `undefined` if no value is given', () => {
                //-- Given
                captureStackTraceStub.returns();

                //-- When
                const r = new BaseError();

                //-- Then
                expect(r.inner).to.be.undefined;
            });
            it('should set the `inner` property to the given value', () => {
                //-- Given
                const inner = new Error();
                captureStackTraceStub.returns();

                //-- When
                const r = new BaseError(undefined, inner);

                //-- Then
                expect(r.inner).to.equal(inner);
            });
            it('should set the `name` property to the name of the constructor', () => {
                //-- Given
                class TestError extends BaseError {}
                captureStackTraceStub.returns();

                //-- When
                const r = new TestError();

                //-- Then
                expect(r.name).to.equal(TestError.name);
            });
            it('should call `captureStackTrace` if it is available', () => {
                //-- Given
                captureStackTraceStub.returns();

                //-- When
                const r = new BaseError();

                //-- Then
                expect(captureStackTraceStub).to.have.been.calledOnceWith(r);
            });
            it('should not call `captureStackTrace` if it is not available', () => {
                //-- Given
                captureStackTraceStub.value(undefined);

                //-- When
                new BaseError();

                //-- Then
                expect(captureStackTraceStub).to.not.have.been.called;
            });
        });
    });
});
