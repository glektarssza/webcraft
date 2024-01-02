//-- NPM Packages
import chai, {expect} from 'chai';
import sinon, {SinonStub} from 'sinon';
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
    describe('.BaseError', () => {
        describe('.constructor()', () => {
            let captureStackTraceStub: SinonStub<
                Parameters<typeof Error.captureStackTrace>,
                ReturnType<typeof Error.captureStackTrace>
            >;
            before(() => {
                captureStackTraceStub = sinon.stub(Error, 'captureStackTrace');
            });
            beforeEach(() => {
                captureStackTraceStub.reset();

                captureStackTraceStub.throws(new Error('Stubbed function'));
            });
            after(() => {
                captureStackTraceStub.restore();
            });
            it('should pass the message to the base class', () => {
                //-- Given
                const message = faker.lorem.sentence();
                captureStackTraceStub.returns();

                //-- When
                const e = new BaseError(message);

                //-- Then
                expect(e.message).to.equal(message);
            });
            it('should set the `name` property to `BaseError`', () => {
                //-- Given
                const message = faker.lorem.sentence();
                captureStackTraceStub.returns();

                //-- When
                const e = new BaseError(message);

                //-- Then
                expect(e.name).to.equal('BaseError');
            });
            it('should set the `inner` property to `undefined` by default', () => {
                //-- Given
                const message = faker.lorem.sentence();
                captureStackTraceStub.returns();

                //-- When
                const e = new BaseError(message);

                //-- Then
                expect(e.inner).to.be.undefined;
            });
            it('should set the `inner` property to the value given', () => {
                //-- Given
                const message = faker.lorem.sentence();
                const inner = new Error(faker.lorem.sentence());
                captureStackTraceStub.returns();

                //-- When
                const e = new BaseError(message, inner);

                //-- Then
                expect(e.inner).to.equal(inner);
            });
            it('should call `Error.captureStackTrace()` if it exists', () => {
                //-- Given
                const message = faker.lorem.sentence();
                captureStackTraceStub.returns();

                //-- When
                const e = new BaseError(message);

                //-- Then
                expect(
                    captureStackTraceStub
                ).to.have.been.calledOnceWithExactly(e, e.constructor);
            });
            it('should not call `Error.captureStackTrace()` if it does not exist', () => {
                //-- Given
                const message = faker.lorem.sentence();
                captureStackTraceStub.value(undefined);

                //-- When
                new BaseError(message);

                //-- Then
                expect(captureStackTraceStub).to.not.have.been.called;
            });
        });
    });
});
