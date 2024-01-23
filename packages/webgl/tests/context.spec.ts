//-- NPM Packages
import chai, {expect} from 'chai';
import {createStubInstance} from 'sinon';
import sinonChai from 'sinon-chai';

//-- Project Code
import {Context} from '@src/context';
import {ErrorCode} from '@src/errorCode';

chai.use(sinonChai);

describe('module:webcraft-webgl', () => {
    describe('class:Context', () => {
        describe('.isDisposed', () => {
            it('should be `true` if the instance has been disposed', () => {
                //-- Given
                const native = createStubInstance(WebGLRenderingContext);
                const context = new Context(native);

                //-- When
                context.dispose();
                const r = context.isDisposed;

                //-- Then
                expect(r).to.be.true;
            });
            it('should be `false` if the instance has not been disposed', () => {
                //-- Given
                const native = createStubInstance(WebGLRenderingContext);
                const context = new Context(native);

                //-- When
                const r = context.isDisposed;

                //-- Then
                expect(r).to.be.false;
            });
        });
        describe('.isLost', () => {
            it('should be `true` if the instance has been lost', () => {
                //-- Given
                const native = createStubInstance(WebGLRenderingContext);
                const context = new Context(native);
                native.isContextLost.returns(true);

                //-- When
                const r = context.isLost;

                //-- Then
                expect(r).to.be.true;
            });
            it('should be `false` if the instance has not been lost', () => {
                //-- Given
                const native = createStubInstance(WebGLRenderingContext);
                const context = new Context(native);
                native.isContextLost.returns(false);

                //-- When
                const r = context.isLost;

                //-- Then
                expect(r).to.be.false;
            });
        });
        describe('.constructor()', () => {
            it('should set the `native` property to the given value', () => {
                //-- Given
                const native = createStubInstance(WebGLRenderingContext);

                //-- When
                const r = new Context(native);

                //-- Then
                expect(r.native).to.equal(native);
            });
        });
        describe('.getError()', () => {
            it('should return the last error surfaced from the native WebGL rendering context', () => {
                //-- Given
                const native = createStubInstance(WebGLRenderingContext);
                const context = new Context(native);
                native.getError.returns(ErrorCode.NoError);

                //-- When
                let r = context.getError();

                //-- Then
                expect(r).to.equal(ErrorCode.NoError);

                //-- Given
                native.getError.returns(ErrorCode.InvalidEnum);

                //-- When
                r = context.getError();

                //-- Then
                expect(r).to.equal(ErrorCode.InvalidEnum);
            });
        });
        describe('.dispose()', () => {
            it('should do nothing if the instance has already been disposed');
            it('should set the `isDisposed` property to `true`', () => {
                //-- Given
                const native = createStubInstance(WebGLRenderingContext);
                const context = new Context(native);

                //-- Then
                expect(context.isDisposed).to.be.false;

                //-- When
                context.dispose();

                //-- Then
                expect(context.isDisposed).to.be.true;
            });
        });
    });
});
