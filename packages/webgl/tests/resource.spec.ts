//-- NPM Packages
import chai, {expect} from 'chai';
import {createStubInstance} from 'sinon';
import sinonChai from 'sinon-chai';

//-- Project Code
import {Resource} from '@src/resource';
import {Context} from '@src/context';

chai.use(sinonChai);

describe('module:webcraft-webgl', () => {
    describe('abstract class:Resource', () => {
        class TestResource extends Resource<WebGLBuffer> {
            public constructor(context: Context) {
                super(context);
            }
        }
        describe('.native', () => {
            it('should be set to `null`', () => {
                //-- Given
                const context = createStubInstance(Context);
                const resource = new TestResource(context);

                //-- When
                const r = resource.native;

                //-- Then
                expect(r).to.be.null;
            });
        });
        describe('.isDisposed', () => {
            it('should be set to `false` if the instance has not been disposed', () => {
                //-- Given
                const context = createStubInstance(Context);
                const resource = new TestResource(context);

                //-- When
                const r = resource.isDisposed;

                //-- Then
                expect(r).to.be.false;
            });
            it('should be set to `true` if the instance has been disposed', () => {
                //-- Given
                const context = createStubInstance(Context);
                const resource = new TestResource(context);
                Reflect.set(resource, '_disposed', true);

                //-- When
                const r = resource.isDisposed;

                //-- Then
                expect(r).to.be.true;
            });
        });
        describe('.isValid', () => {
            it('should be set to `true` is the instance is valid', () => {
                //-- Given
                const context = createStubInstance(Context);
                const native = {} as WebGLBuffer;
                const resource = new TestResource(context);
                Reflect.set(resource, '_native', native);

                //-- When
                const r = resource.isValid;

                //-- Then
                expect(r).to.be.true;
            });
            it('should be set to `false` is the instance is not valid', () => {
                //-- Given
                const context = createStubInstance(Context);
                const resource = new TestResource(context);

                //-- When
                const r = resource.isValid;

                //-- Then
                expect(r).to.be.false;
            });
            it('should be set to `false` is the instance is disposed', () => {
                //-- Given
                const context = createStubInstance(Context);
                const resource = new TestResource(context);
                Reflect.set(resource, '_disposed', true);

                //-- When
                const r = resource.isValid;

                //-- Then
                expect(r).to.be.false;
            });
        });
        describe('.constructor()', () => {
            it('should set the `context` property to the given value', () => {
                //-- Given
                const context = createStubInstance(Context);

                //-- When
                const r = new TestResource(context);

                //-- Then
                expect(r.context).to.equal(context);
            });
            it('should set the `native` property to `null`', () => {
                //-- Given
                const context = createStubInstance(Context);

                //-- When
                const r = new TestResource(context);

                //-- Then
                expect(r.native).to.be.null;
            });
            it('should set the `isDisposed` property to `false`', () => {
                //-- Given
                const context = createStubInstance(Context);

                //-- When
                const r = new TestResource(context);

                //-- Then
                expect(r.isDisposed).to.be.false;
            });
            it('should set the `isValid` property to `false`', () => {
                //-- Given
                const context = createStubInstance(Context);

                //-- When
                const r = new TestResource(context);

                //-- Then
                expect(r.isValid).to.be.false;
            });
        });
        describe('.dispose()', () => {
            it('should do nothing if the instance has already been disposed', () => {
                //-- Given
                const context = createStubInstance(Context);
                const native = {} as WebGLBuffer;
                const resource = new TestResource(context);
                Reflect.set(resource, '_native', native);
                Reflect.set(resource, '_disposed', true);

                //-- When
                resource.dispose();

                //-- Then
                expect(resource.native).to.equal(native);
            });
            it('should set the `native` property to `null`', () => {
                //-- Given
                const context = createStubInstance(Context);
                const native = {} as WebGLBuffer;
                const resource = new TestResource(context);
                Reflect.set(resource, '_native', native);

                //-- When
                resource.dispose();

                //-- Then
                expect(resource.native).to.be.null;
            });
            it('should set the `isDisposed` property to `true`', () => {
                //-- Given
                const context = createStubInstance(Context);
                const native = {} as WebGLBuffer;
                const resource = new TestResource(context);
                Reflect.set(resource, '_native', native);

                //-- When
                resource.dispose();

                //-- Then
                expect(resource.isDisposed).to.be.true;
            });
        });
    });
});
