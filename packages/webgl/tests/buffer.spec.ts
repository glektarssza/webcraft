//-- NPM Packages
import chai, {expect} from 'chai';
import {createStubInstance, match, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import {Faker, en, en_CA, en_US, base} from '@faker-js/faker';
import zip from 'lodash/zip';

//-- Project Code
import {Buffer} from '@src/buffer';
import {BufferTarget} from '@src/bufferTarget';
import {BufferUsageHint} from '@src/bufferUsageHint';
import {Context} from '@src/context';

chai.use(sinonChai);

/**
 * The fake data generator.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:webcraft-webgl', () => {
    describe('class:Buffer', () => {
        const bufferTargets = [
            BufferTarget.ArrayBuffer,
            BufferTarget.ElementArrayBuffer
        ];
        const bufferUsageHints = [
            BufferUsageHint.StaticDraw,
            BufferUsageHint.StreamDraw,
            BufferUsageHint.DynamicDraw
        ];
        const bufferBindingParams = [
            WebGLRenderingContext.ARRAY_BUFFER_BINDING,
            WebGLRenderingContext.ELEMENT_ARRAY_BUFFER_BINDING
        ];
        const bufferParams = zip(bufferTargets, bufferBindingParams) as [
            BufferTarget,
            GLenum
        ][];
        let nativeContext: SinonStubbedInstance<WebGLRenderingContext>;
        let context: Context;
        let native: SinonStubbedInstance<WebGLBuffer>;
        beforeEach(() => {
            nativeContext = createStubInstance(WebGLRenderingContext);
            context = new Context(nativeContext);
            native = {} as WebGLBuffer;
        });
        describe('.target', () => {
            it('should be set to the target the instance binds to', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);

                //-- When
                const r = buffer.target;

                //-- Then
                expect(r).to.equal(target);
            });
        });
        describe('.allocatedSize', () => {
            it('should return `null` if the instance is disposed', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                Reflect.set(buffer, '_disposed', true);

                //-- When
                const r = buffer.allocatedSize;

                //-- Then
                expect(r).to.be.null;
            });
            it('should return `null` if the instance does not wrap a valid WebGL buffer', () => {
                //-- Given
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                Reflect.set(buffer, '_native', null);

                //-- When
                const r = buffer.allocatedSize;

                //-- Then
                expect(r).to.be.null;
            });
            it('should be set to `null` if the instance has not been allocated yet', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);

                //-- When
                const r = buffer.allocatedSize;

                //-- Then
                expect(r).to.be.null;
            });
            it('should be set to the number of bytes allocated to the instance in VRAM', () => {
                //-- Given
                nativeContext.createBuffer.returns(native);
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter
                    .withArgs(bindingParam)
                    .returns(native);
                const usageHint = faker.helpers.arrayElement(bufferUsageHints);
                const sizeBytes = faker.number.int({
                    min: 128,
                    max: 1024
                });
                nativeContext.bufferData
                    .withArgs(target, match.number, usageHint)
                    .returns();
                nativeContext.getError.returns(WebGLRenderingContext.NO_ERROR);
                buffer.allocate(sizeBytes, usageHint);

                //-- When
                const r = buffer.allocatedSize;

                //-- Then
                expect(r).to.equal(sizeBytes);
            });
        });
        describe('.usageHint', () => {
            it('should be set to `null` if the instance has not been configured yet', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);

                //-- When
                const r = buffer.usageHint;

                //-- Then
                expect(r).to.be.null;
            });
            it('should be set to the value the instance was configured with', () => {
                //-- Given
                nativeContext.createBuffer.returns(native);
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter
                    .withArgs(bindingParam)
                    .returns(native);
                const sizeBytes = faker.number.int({
                    min: 128,
                    max: 1024
                });
                const usageHint = faker.helpers.arrayElement(bufferUsageHints);
                nativeContext.bufferData
                    .withArgs(target, match.number, usageHint)
                    .returns();
                nativeContext.getError.returns(WebGLRenderingContext.NO_ERROR);
                buffer.allocate(sizeBytes, usageHint);

                //-- When
                const r = buffer.usageHint;

                //-- Then
                expect(r).to.equal(usageHint);
            });
        });
        describe('.isBound', () => {
            it(
                'should be set to `true` if the instance is bound to its target'
            );
            it(
                'should be set to `false` if the instance is not bound to its target'
            );
        });
        describe('.constructor()', () => {
            it('should pass the `context` parameter to the base class');
            it(
                'should set the `native` property to the newly created native WebGL buffer'
            );
            it(
                'should throw an `OperationError` if the native WebGL buffer fails to be created'
            );
            it('should set the `target` property to the given value');
            it('should set the `allocatedSize` property to `null`');
            it('should set the `usageHint` property to `null`');
        });
        describe('.bind()', () => {
            it(
                'should throw a `DisposedError` if the instance has been disposed'
            );
            it(
                'should throw a `StateError` if the instance does not wrap a valid WebGL buffer'
            );
            it(
                'should do nothing if the instance is already bound to its target'
            );
            it('should bind the instance to its target');
            it('should throw an `OperationError` if a WebGL error occurs');
        });
        describe('.unbind()', () => {
            it(
                'should throw a `DisposedError` if the instance has been disposed'
            );
            it(
                'should throw a `StateError` if the instance does not wrap a valid WebGL buffer'
            );
            it('should do nothing if the instance is not bound to its target');
            it('should unbind the instance from its target');
            it('should throw an `OperationError` if a WebGL error occurs');
        });
        describe('.allocate()', () => {
            it(
                'should throw a `DisposedError` if the instance has been disposed'
            );
            it(
                'should throw a `StateError` if the instance does not wrap a valid WebGL buffer'
            );
            it(
                'should throw a `StateError` if the instance is not bound to its target'
            );
            it(
                'should allocate the requested amount of space in VRAM for the instance'
            );
            it('should throw an `OperationError` if a WebGL error occurs');
            it('should set the `allocatedSize` property to the requested size');
            it('should set the `usageHint` property to the configured value');
        });
        describe('.uploadData()', () => {
            it(
                'should throw a `DisposedError` if the instance has been disposed'
            );
            it(
                'should throw a `StateError` if the instance does not wrap a valid WebGL buffer'
            );
            it(
                'should throw a `StateError` if the instance is not bound to its target'
            );
            it('should upload the given data into the instance');
            it('should throw an `OperationError` if a WebGL error occurs');
            it(
                'should set the `allocatedSize` property to the size of the data uploaded'
            );
            it('should set the `usageHint` property to the configured value');
        });
        describe('.uploadSubData()', () => {
            it(
                'should throw a `DisposedError` if the instance has been disposed'
            );
            it(
                'should throw a `StateError` if the instance does not wrap a valid WebGL buffer'
            );
            it(
                'should throw a `StateError` if the instance is not bound to its target'
            );
            it(
                'should throw a `StateError` if the instance has not been allocated yet'
            );
            it(
                'should throw an `ArgumentError` if the given offset is a non-finite value'
            );
            it(
                'should throw an `ArgumentRangeError` if the given offset is less than zero'
            );
            it(
                'should throw an `ArgumentRangeError` if the given offset is greater than the allocation size minus the data size'
            );
            it('should upload the given data into the instance');
            it('should throw an `OperationError` if a WebGL error occurs');
        });
        describe('.dispose()', () => {
            it('should do nothing if the instance has already been disposed');
            it(
                'should delete the native WebGL buffer if the instance wraps one'
            );
            it(
                'should not delete the native WebGL buffer if the instance does not wrap one'
            );
            it('should set the `allocatedSize` property to `null`');
            it('should set the `usageHint` property to `null`');
        });
    });
});
