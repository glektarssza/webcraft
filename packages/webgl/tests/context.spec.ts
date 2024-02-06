//-- NPM Packages
import {expect} from 'chai';
import {SinonStub, createStubInstance, stub} from 'sinon';

//-- Project Code
import {Context} from '@src/context';
import {ErrorCode} from '@src/errorCode';
import {Resource} from '@src/resource';

describe('module:webcraft-webgl', () => {
    describe('class:Context', () => {
        class TestResource extends Resource<WebGLBuffer> {
            public constructor(context: Context) {
                super(context);
            }
        }
        describe('.resources', () => {
            it('should be an empty list by default', () => {
                //-- Given
                const native = createStubInstance(WebGLRenderingContext);
                const context = new Context(native);

                //-- When
                const r = context.resources;

                //-- Then
                expect(r).to.be.empty;
            });
            it('should contain any managed resources', () => {
                //-- Given
                const native = createStubInstance(WebGLRenderingContext);
                const context = new Context(native);
                const resource = new TestResource(context);
                Reflect.set(context, '_resources', [resource]);

                //-- When
                const r = context.resources;

                //-- Then
                expect(r).to.include(resource);
            });
            it('should be a shallow clone', () => {
                //-- Given
                const native = createStubInstance(WebGLRenderingContext);
                const context = new Context(native);
                const resource = new TestResource(context);
                const resources = [resource];
                Reflect.set(context, '_resources', resources);

                //-- When
                const r = context.resources;

                //-- Then
                expect(r).to.not.equal(resources);
            });
        });
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
            const native = createStubInstance(WebGLRenderingContext);
            let context: Context;
            let resource: TestResource;
            let disposeStub: SinonStub<
                Parameters<TestResource['dispose']>,
                ReturnType<TestResource['dispose']>
            >;
            beforeEach(() => {
                context = new Context(native);
                resource = new TestResource(context);
                disposeStub = stub(resource, 'dispose');
                disposeStub.reset();

                disposeStub.throws(new Error('Stubbed method'));
            });
            afterEach(() => {
                disposeStub.restore();
            });
            it('should do nothing if the instance has already been disposed', () => {
                //-- Given
                disposeStub.returns();
                Reflect.set(context, '_resources', [resource]);
                Reflect.set(context, '_disposed', true);

                //-- When
                context.dispose();

                //-- Then
                expect(disposeStub).to.satisfy(() => disposeStub.notCalled);
            });
            it('should dispose of all managed resource objects', () => {
                //-- Given
                disposeStub.returns();
                Reflect.set(context, '_resources', [resource]);

                //-- When
                context.dispose();

                //-- Then
                expect(disposeStub).to.satisfy(() => disposeStub.calledOnce);
            });
            it('should set the `resources` property to an empty list', () => {
                //-- Given
                disposeStub.returns();
                Reflect.set(context, '_resources', [resource]);

                //-- When
                context.dispose();

                //-- Then
                expect(context.resources).to.be.empty;
            });
            it('should set the `isDisposed` property to `true`', () => {
                //-- Given
                disposeStub.returns();

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
