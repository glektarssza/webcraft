//-- NPM Packages
import {expect} from 'chai';
import {createStubInstance, match, SinonStubbedInstance} from 'sinon';
import {Faker, en, en_CA, en_US, base} from '@faker-js/faker';
import zip from 'lodash/zip';

//-- Project Code
import {Buffer} from '@src/buffer';
import {BufferTarget} from '@src/bufferTarget';
import {BufferUsageHint} from '@src/bufferUsageHint';
import {Context} from '@src/context';
import {WebGLError} from '@src/errors/webglError';
import {
    ArgumentError,
    ArgumentRangeError,
    DisposedError,
    StateError
} from 'webcraft-common';

/**
 * The fake data generator.
 */
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
            it('should return `null` if the instance is disposed', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                Reflect.set(buffer, '_disposed', true);

                //-- When
                const r = buffer.usageHint;

                //-- Then
                expect(r).to.be.null;
            });
            it('should return `null` if the instance does not wrap a valid WebGL buffer', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                Reflect.set(buffer, '_native', null);

                //-- When
                const r = buffer.usageHint;

                //-- Then
                expect(r).to.be.null;
            });
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
            it('should return `false` if the instance is disposed', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                Reflect.set(buffer, '_disposed', true);

                //-- When
                const r = buffer.isBound;

                //-- Then
                expect(r).to.be.false;
                expect(nativeContext.getParameter).to.satisfy(
                    () => nativeContext.getParameter.notCalled
                );
            });
            it('should return `false` if the instance does not wrap a valid WebGL buffer', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                Reflect.set(buffer, '_native', null);

                //-- When
                const r = buffer.isBound;

                //-- Then
                expect(r).to.be.false;
                expect(nativeContext.getParameter).to.satisfy(
                    () => nativeContext.getParameter.notCalled
                );
            });
            it('should be set to `true` if the instance is bound to its target', () => {
                //-- Given
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter
                    .withArgs(bindingParam)
                    .returns(native);

                //-- When
                const r = buffer.isBound;

                //-- Then
                expect(r).to.be.true;
                expect(nativeContext.getParameter).to.satisfy(() =>
                    nativeContext.getParameter.calledOnceWithExactly(
                        bindingParam
                    )
                );
            });
            it('should be set to `false` if the instance is not bound to its target', () => {
                //-- Given
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter.withArgs(bindingParam).returns(null);

                //-- When
                const r = buffer.isBound;

                //-- Then
                expect(r).to.be.false;
                expect(nativeContext.getParameter).to.satisfy(() =>
                    nativeContext.getParameter.calledOnceWithExactly(
                        bindingParam
                    )
                );
            });
        });
        describe('.constructor()', () => {
            it('should pass the `context` parameter to the base class', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);

                //-- When
                const r = new Buffer(context, target);

                //-- Then
                expect(r.context).to.equal(context);
            });
            it('should set the `native` property to the newly created native WebGL buffer', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);

                //-- When
                const r = new Buffer(context, target);

                //-- Then
                expect(r.native).to.equal(native);
            });
            it('should throw an `WebGLError` if the native WebGL buffer fails to be created', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(null);
                nativeContext.getError.returns(
                    WebGLRenderingContext.INVALID_OPERATION
                );

                //-- When
                try {
                    new Buffer(context, target);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(WebGLError);
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('createBuffer');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Failed to create native WebGL buffer resource'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should set the `target` property to the given value', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);

                //-- When
                const r = new Buffer(context, target);

                //-- Then
                expect(r.target).to.equal(target);
            });
            it('should set the `allocatedSize` property to `null`', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);

                //-- When
                const r = new Buffer(context, target);

                //-- Then
                expect(r.allocatedSize).to.be.null;
            });
            it('should set the `usageHint` property to `null`', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);

                //-- When
                const r = new Buffer(context, target);

                //-- Then
                expect(r.usageHint).to.be.null;
            });
        });
        describe('.bind()', () => {
            it('should throw a `DisposedError` if the instance has been disposed', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                Reflect.set(buffer, '_disposed', true);

                //-- When
                try {
                    buffer.bind();
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(DisposedError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Buffer');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('bind');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals('Cannot bind a disposed WebGL buffer');
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should throw a `StateError` if the instance does not wrap a valid WebGL buffer', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                Reflect.set(buffer, '_native', null);

                //-- When
                try {
                    buffer.bind();
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(StateError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Buffer');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('bind');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals('Cannot bind an invalid WebGL buffer');
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should do nothing if the instance is already bound to its target', () => {
                //-- Given
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter
                    .withArgs(bindingParam)
                    .returns(native);

                //-- When
                buffer.bind();

                //-- Then
                expect(nativeContext.bindBuffer).to.satisfy(
                    () => nativeContext.bindBuffer.notCalled
                );
            });
            it('should bind the instance to its target', () => {
                //-- Given
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter.withArgs(bindingParam).returns(null);
                nativeContext.getError.returns(WebGLRenderingContext.NO_ERROR);

                //-- When
                buffer.bind();

                //-- Then
                expect(nativeContext.bindBuffer).to.satisfy(() =>
                    nativeContext.bindBuffer.calledOnceWithExactly(
                        target,
                        native
                    )
                );
            });
            it('should throw an `WebGLError` if a WebGL error occurs', () => {
                //-- Given
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter.withArgs(bindingParam).returns(null);
                nativeContext.getError.returns(
                    WebGLRenderingContext.INVALID_ENUM
                );

                //-- When
                try {
                    buffer.bind();
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(WebGLError);
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('bind');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'An error occurred while binding a WebGL buffer'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
        });
        describe('.unbind()', () => {
            it('should throw a `DisposedError` if the instance has been disposed', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                Reflect.set(buffer, '_disposed', true);

                //-- When
                try {
                    buffer.unbind();
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(StateError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Buffer');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('unbind');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals('Cannot unbind a disposed WebGL buffer');
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should throw a `StateError` if the instance does not wrap a valid WebGL buffer', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                Reflect.set(buffer, '_native', null);

                //-- When
                try {
                    buffer.unbind();
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(StateError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Buffer');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('unbind');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals('Cannot unbind an invalid WebGL buffer');
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should do nothing if the instance is not bound to its target', () => {
                //-- Given
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter.withArgs(bindingParam).returns(null);

                //-- When
                buffer.unbind();

                //-- Then
                expect(nativeContext.bindBuffer).to.satisfy(
                    () => nativeContext.bindBuffer.notCalled
                );
            });
            it('should unbind the instance from its target', () => {
                //-- Given
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter
                    .withArgs(bindingParam)
                    .returns(native);
                nativeContext.getError.returns(WebGLRenderingContext.NO_ERROR);

                //-- When
                buffer.unbind();

                //-- Then
                expect(nativeContext.bindBuffer).to.satisfy(() =>
                    nativeContext.bindBuffer.calledOnceWithExactly(target, null)
                );
            });
            it('should throw an `WebGLError` if a WebGL error occurs', () => {
                //-- Given
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter
                    .withArgs(bindingParam)
                    .returns(native);
                nativeContext.getError.returns(
                    WebGLRenderingContext.INVALID_ENUM
                );

                //-- When
                try {
                    buffer.unbind();
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(WebGLError);
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('unbind');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'An error occurred while unbinding a WebGL buffer'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
        });
        describe('.allocate()', () => {
            it('should throw a `DisposedError` if the instance has been disposed', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                Reflect.set(buffer, '_disposed', true);
                const sizeBytes = faker.number.int({
                    min: 128,
                    max: 1024
                });
                const usageHint = faker.helpers.arrayElement(bufferUsageHints);

                //-- When
                try {
                    buffer.allocate(sizeBytes, usageHint);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(DisposedError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Buffer');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('allocate');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Cannot allocate a disposed WebGL buffer'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should throw a `StateError` if the instance does not wrap a valid WebGL buffer', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                Reflect.set(buffer, '_native', null);
                const sizeBytes = faker.number.int({
                    min: 128,
                    max: 1024
                });
                const usageHint = faker.helpers.arrayElement(bufferUsageHints);

                //-- When
                try {
                    buffer.allocate(sizeBytes, usageHint);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(StateError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Buffer');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('allocate');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Cannot allocate an invalid WebGL buffer'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should throw a `StateError` if the instance is not bound to its target', () => {
                //-- Given
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter.withArgs(bindingParam).returns(null);
                const sizeBytes = faker.number.int({
                    min: 128,
                    max: 1024
                });
                const usageHint = faker.helpers.arrayElement(bufferUsageHints);

                //-- When
                try {
                    buffer.allocate(sizeBytes, usageHint);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(StateError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Buffer');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('allocate');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Cannot allocate an unbound WebGL buffer'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should allocate the requested amount of space in VRAM for the instance', () => {
                //-- Given
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter
                    .withArgs(bindingParam)
                    .returns(native);
                nativeContext.getError.returns(WebGLRenderingContext.NO_ERROR);
                const sizeBytes = faker.number.int({
                    min: 128,
                    max: 1024
                });
                const usageHint = faker.helpers.arrayElement(bufferUsageHints);

                //-- When
                buffer.allocate(sizeBytes, usageHint);

                //-- Then
                expect(nativeContext.bufferData).to.satisfy(() =>
                    nativeContext.bufferData.calledOnceWithExactly(
                        target,
                        // HACK: Sinon TypeScript typings don't like methods with multiple overrides
                        sizeBytes as unknown as BufferSource,
                        usageHint
                    )
                );
            });
            it('should use the static draw usage hint by default', () => {
                //-- Given
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter
                    .withArgs(bindingParam)
                    .returns(native);
                nativeContext.getError.returns(WebGLRenderingContext.NO_ERROR);
                const sizeBytes = faker.number.int({
                    min: 128,
                    max: 1024
                });

                //-- When
                buffer.allocate(sizeBytes);

                //-- Then
                expect(nativeContext.bufferData).to.satisfy(() =>
                    nativeContext.bufferData.calledOnceWithExactly(
                        target,
                        // HACK: Sinon TypeScript typings don't like methods with multiple overrides
                        sizeBytes as unknown as BufferSource,
                        BufferUsageHint.StaticDraw
                    )
                );
            });
            it('should throw an `WebGLError` if a WebGL error occurs', () => {
                //-- Given
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter
                    .withArgs(bindingParam)
                    .returns(native);
                nativeContext.getError.returns(
                    WebGLRenderingContext.INVALID_ENUM
                );
                const sizeBytes = faker.number.int({
                    min: 128,
                    max: 1024
                });
                const usageHint = faker.helpers.arrayElement(bufferUsageHints);

                //-- When
                try {
                    buffer.allocate(sizeBytes, usageHint);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(WebGLError);
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('allocate');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'An error occurred while allocating a WebGL buffer'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should set the `allocatedSize` property to the requested size', () => {
                //-- Given
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter
                    .withArgs(bindingParam)
                    .returns(native);
                nativeContext.getError.returns(WebGLRenderingContext.NO_ERROR);
                const sizeBytes = faker.number.int({
                    min: 128,
                    max: 1024
                });
                const usageHint = faker.helpers.arrayElement(bufferUsageHints);

                //-- When
                buffer.allocate(sizeBytes, usageHint);

                //-- Then
                expect(buffer.allocatedSize).to.equal(sizeBytes);
            });
            it('should set the `usageHint` property to the configured value', () => {
                //-- Given
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter
                    .withArgs(bindingParam)
                    .returns(native);
                nativeContext.getError.returns(WebGLRenderingContext.NO_ERROR);
                const sizeBytes = faker.number.int({
                    min: 128,
                    max: 1024
                });
                const usageHint = faker.helpers.arrayElement(bufferUsageHints);

                //-- When
                buffer.allocate(sizeBytes, usageHint);

                //-- Then
                expect(buffer.usageHint).to.equal(usageHint);
            });
        });
        describe('.uploadData()', () => {
            it('should throw a `DisposedError` if the instance has been disposed', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                Reflect.set(buffer, '_disposed', true);
                const data = new Float32Array(
                    faker.helpers.multiple(faker.number.float, {
                        count: {
                            min: 8,
                            max: 64
                        }
                    })
                );
                const usageHint = faker.helpers.arrayElement(bufferUsageHints);

                //-- When
                try {
                    buffer.uploadData(data, usageHint);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(DisposedError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Buffer');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('uploadData');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Cannot upload data to a disposed WebGL buffer'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should throw a `StateError` if the instance does not wrap a valid WebGL buffer', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                Reflect.set(buffer, '_native', null);
                const data = new Float32Array(
                    faker.helpers.multiple(faker.number.float, {
                        count: {
                            min: 8,
                            max: 64
                        }
                    })
                );
                const usageHint = faker.helpers.arrayElement(bufferUsageHints);

                //-- When
                try {
                    buffer.uploadData(data, usageHint);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(StateError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Buffer');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('uploadData');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Cannot upload data to an invalid WebGL buffer'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should throw a `StateError` if the instance is not bound to its target', () => {
                //-- Given
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter.withArgs(bindingParam).returns(null);
                const data = new Float32Array(
                    faker.helpers.multiple(faker.number.float, {
                        count: {
                            min: 8,
                            max: 64
                        }
                    })
                );
                const usageHint = faker.helpers.arrayElement(bufferUsageHints);

                //-- When
                try {
                    buffer.uploadData(data, usageHint);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(StateError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Buffer');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('uploadData');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Cannot upload data to an unbound WebGL buffer'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should upload the given data into the instance', () => {
                //-- Given
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter
                    .withArgs(bindingParam)
                    .returns(native);
                const data = new Float32Array(
                    faker.helpers.multiple(faker.number.float, {
                        count: {
                            min: 8,
                            max: 64
                        }
                    })
                );
                const usageHint = faker.helpers.arrayElement(bufferUsageHints);
                nativeContext.bufferData
                    .withArgs(target, data, usageHint)
                    .returns();
                nativeContext.getError.returns(WebGLRenderingContext.NO_ERROR);

                //-- When
                buffer.uploadData(data, usageHint);

                //-- Then
                expect(nativeContext.bufferData).to.satisfy(() =>
                    nativeContext.bufferData.calledOnceWithExactly(
                        target,
                        data,
                        usageHint
                    )
                );
            });
            it('should use the static draw usage hint by default', () => {
                //-- Given
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter
                    .withArgs(bindingParam)
                    .returns(native);
                const data = new Float32Array(
                    faker.helpers.multiple(faker.number.float, {
                        count: {
                            min: 8,
                            max: 64
                        }
                    })
                );
                nativeContext.bufferData
                    .withArgs(target, data, BufferUsageHint.StaticDraw)
                    .returns();
                nativeContext.getError.returns(WebGLRenderingContext.NO_ERROR);

                //-- When
                buffer.uploadData(data);

                //-- Then
                expect(nativeContext.bufferData).to.satisfy(() =>
                    nativeContext.bufferData.calledOnceWithExactly(
                        target,
                        data,
                        BufferUsageHint.StaticDraw
                    )
                );
            });
            it('should throw an `WebGLError` if a WebGL error occurs', () => {
                //-- Given
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter
                    .withArgs(bindingParam)
                    .returns(native);
                const data = new Float32Array(
                    faker.helpers.multiple(faker.number.float, {
                        count: {
                            min: 8,
                            max: 64
                        }
                    })
                );
                const usageHint = faker.helpers.arrayElement(bufferUsageHints);
                nativeContext.bufferData
                    .withArgs(target, data, usageHint)
                    .returns();
                nativeContext.getError.returns(
                    WebGLRenderingContext.INVALID_ENUM
                );

                //-- When
                try {
                    buffer.uploadData(data, usageHint);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(WebGLError);
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('uploadData');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'An error occurred while uploading data to a WebGL buffer'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should set the `allocatedSize` property to the size of the data uploaded', () => {
                //-- Given
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter
                    .withArgs(bindingParam)
                    .returns(native);
                const data = new Float32Array(
                    faker.helpers.multiple(faker.number.float, {
                        count: {
                            min: 8,
                            max: 64
                        }
                    })
                );
                const usageHint = faker.helpers.arrayElement(bufferUsageHints);
                nativeContext.bufferData
                    .withArgs(target, data, usageHint)
                    .returns();
                nativeContext.getError.returns(WebGLRenderingContext.NO_ERROR);

                //-- When
                buffer.uploadData(data, usageHint);

                //-- Then
                expect(buffer.allocatedSize).to.equal(data.byteLength);
            });
            it('should set the `usageHint` property to the configured value', () => {
                //-- Given
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter
                    .withArgs(bindingParam)
                    .returns(native);
                const data = new Float32Array(
                    faker.helpers.multiple(faker.number.float, {
                        count: {
                            min: 8,
                            max: 64
                        }
                    })
                );
                const usageHint = faker.helpers.arrayElement(bufferUsageHints);
                nativeContext.bufferData
                    .withArgs(target, data, usageHint)
                    .returns();
                nativeContext.getError.returns(WebGLRenderingContext.NO_ERROR);

                //-- When
                buffer.uploadData(data, usageHint);

                //-- Then
                expect(buffer.usageHint).to.equal(usageHint);
            });
        });
        describe('.uploadSubData()', () => {
            it('should throw a `DisposedError` if the instance has been disposed', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                Reflect.set(buffer, '_disposed', true);
                const allocatedSize = faker.number.int({
                    min: 512,
                    max: 2048
                });
                const data = new Float32Array(
                    faker.helpers.multiple(faker.number.float, {
                        count: {
                            min: 8,
                            max: 64
                        }
                    })
                );
                const offset = faker.number.int({
                    min: 0,
                    max: allocatedSize - data.byteLength
                });

                //-- When
                try {
                    buffer.uploadSubData(data, offset);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(DisposedError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Buffer');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('uploadSubData');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Cannot upload sub data to a disposed WebGL buffer'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should throw a `StateError` if the instance does not wrap a valid WebGL buffer', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                Reflect.set(buffer, '_native', null);
                const allocatedSize = faker.number.int({
                    min: 512,
                    max: 2048
                });
                const data = new Float32Array(
                    faker.helpers.multiple(faker.number.float, {
                        count: {
                            min: 8,
                            max: 64
                        }
                    })
                );
                const offset = faker.number.int({
                    min: 0,
                    max: allocatedSize - data.byteLength
                });

                //-- When
                try {
                    buffer.uploadSubData(data, offset);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(StateError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Buffer');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('uploadSubData');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Cannot upload sub data to an invalid WebGL buffer'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should throw a `StateError` if the instance is not bound to its target', () => {
                //-- Given
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter.withArgs(bindingParam).returns(null);
                const allocatedSize = faker.number.int({
                    min: 512,
                    max: 2048
                });
                const data = new Float32Array(
                    faker.helpers.multiple(faker.number.float, {
                        count: {
                            min: 8,
                            max: 64
                        }
                    })
                );
                const offset = faker.number.int({
                    min: 0,
                    max: allocatedSize - data.byteLength
                });

                //-- When
                try {
                    buffer.uploadSubData(data, offset);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(StateError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Buffer');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('uploadSubData');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Cannot upload sub data to an unbound WebGL buffer'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should throw a `StateError` if the instance has not been allocated yet', () => {
                //-- Given
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                Reflect.set(buffer, '_allocatedSize', null);
                nativeContext.getParameter
                    .withArgs(bindingParam)
                    .returns(native);
                const allocatedSize = faker.number.int({
                    min: 512,
                    max: 2048
                });
                const data = new Float32Array(
                    faker.helpers.multiple(faker.number.float, {
                        count: {
                            min: 8,
                            max: 64
                        }
                    })
                );
                const offset = faker.number.int({
                    min: 0,
                    max: allocatedSize - data.byteLength
                });

                //-- When
                try {
                    buffer.uploadSubData(data, offset);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(StateError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Buffer');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('uploadSubData');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Cannot upload sub data to an unallocated WebGL buffer'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should throw an `ArgumentError` if the given offset is a non-finite value', () => {
                //-- Given
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter
                    .withArgs(bindingParam)
                    .returns(native);
                const allocatedSize = faker.number.int({
                    min: 512,
                    max: 2048
                });
                Reflect.set(buffer, '_allocatedSize', allocatedSize);
                const data = new Float32Array(
                    faker.helpers.multiple(faker.number.float, {
                        count: {
                            min: 8,
                            max: 64
                        }
                    })
                );
                const offset = Infinity;

                //-- When
                try {
                    buffer.uploadSubData(data, offset);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(ArgumentError);
                    expect(ex)
                        .to.have.a.property('argumentName')
                        .which.equals('offset');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals('Offset must be a finite number');
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should throw an `ArgumentRangeError` if the given offset is less than zero', () => {
                //-- Given
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter
                    .withArgs(bindingParam)
                    .returns(native);
                const allocatedSize = faker.number.int({
                    min: 512,
                    max: 2048
                });
                Reflect.set(buffer, '_allocatedSize', allocatedSize);
                const data = new Float32Array(
                    faker.helpers.multiple(faker.number.float, {
                        count: {
                            min: 8,
                            max: 64
                        }
                    })
                );
                const offset = faker.number.int({
                    min: -64,
                    max: -8
                });

                //-- When
                try {
                    buffer.uploadSubData(data, offset);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(ArgumentRangeError);
                    expect(ex)
                        .to.have.a.property('argumentName')
                        .which.equals('offset');
                    expect(ex)
                        .to.have.a.property('actualValue')
                        .which.equals(offset);
                    expect(ex)
                        .to.have.a.property('minimumValue')
                        .which.equals(0);
                    expect(ex)
                        .to.have.a.property('maximumValue')
                        .which.equals(allocatedSize - data.byteLength);
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Offset must be inside the allocation bounds'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should throw an `ArgumentRangeError` if the given offset is greater than the allocation size minus the data size', () => {
                //-- Given
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter
                    .withArgs(bindingParam)
                    .returns(native);
                const allocatedSize = faker.number.int({
                    min: 512,
                    max: 2048
                });
                Reflect.set(buffer, '_allocatedSize', allocatedSize);
                const data = new Float32Array(
                    faker.helpers.multiple(faker.number.float, {
                        count: {
                            min: 8,
                            max: 64
                        }
                    })
                );
                const offset = faker.number.int({
                    min: allocatedSize + 8,
                    max: allocatedSize * 4
                });

                //-- When
                try {
                    buffer.uploadSubData(data, offset);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(ArgumentRangeError);
                    expect(ex)
                        .to.have.a.property('argumentName')
                        .which.equals('offset');
                    expect(ex)
                        .to.have.a.property('actualValue')
                        .which.equals(offset);
                    expect(ex)
                        .to.have.a.property('minimumValue')
                        .which.equals(0);
                    expect(ex)
                        .to.have.a.property('maximumValue')
                        .which.equals(allocatedSize - data.byteLength);
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Offset must be inside the allocation bounds'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should upload the given data into the instance', () => {
                //-- Given
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter
                    .withArgs(bindingParam)
                    .returns(native);
                nativeContext.getError.returns(WebGLRenderingContext.NO_ERROR);
                const allocatedSize = faker.number.int({
                    min: 512,
                    max: 2048
                });
                Reflect.set(buffer, '_allocatedSize', allocatedSize);
                const data = new Float32Array(
                    faker.helpers.multiple(faker.number.float, {
                        count: {
                            min: 8,
                            max: 64
                        }
                    })
                );
                const offset = faker.number.int({
                    min: 0,
                    max: allocatedSize - data.byteLength
                });

                //-- When
                buffer.uploadSubData(data, offset);

                //-- Then
                expect(nativeContext.bufferSubData).to.satisfy(() =>
                    nativeContext.bufferSubData.calledOnceWithExactly(
                        target,
                        offset,
                        data
                    )
                );
            });
            it('should use an offset of zero by default', () => {
                //-- Given
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter
                    .withArgs(bindingParam)
                    .returns(native);
                nativeContext.getError.returns(WebGLRenderingContext.NO_ERROR);
                const allocatedSize = faker.number.int({
                    min: 512,
                    max: 2048
                });
                Reflect.set(buffer, '_allocatedSize', allocatedSize);
                const data = new Float32Array(
                    faker.helpers.multiple(faker.number.float, {
                        count: {
                            min: 8,
                            max: 64
                        }
                    })
                );

                //-- When
                buffer.uploadSubData(data);

                //-- Then
                expect(nativeContext.bufferSubData).to.satisfy(() =>
                    nativeContext.bufferSubData.calledOnceWithExactly(
                        target,
                        0,
                        data
                    )
                );
            });
            it('should throw an `WebGLError` if a WebGL error occurs', () => {
                //-- Given
                const [target, bindingParam] =
                    faker.helpers.arrayElement(bufferParams);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                nativeContext.getParameter
                    .withArgs(bindingParam)
                    .returns(native);
                nativeContext.getError.returns(
                    WebGLRenderingContext.INVALID_ENUM
                );
                const allocatedSize = faker.number.int({
                    min: 512,
                    max: 2048
                });
                Reflect.set(buffer, '_allocatedSize', allocatedSize);
                const data = new Float32Array(
                    faker.helpers.multiple(faker.number.float, {
                        count: {
                            min: 8,
                            max: 64
                        }
                    })
                );
                const offset = faker.number.int({
                    min: 0,
                    max: allocatedSize - data.byteLength
                });

                //-- When
                try {
                    buffer.uploadSubData(data, offset);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(WebGLError);
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('uploadSubData');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'An error occurred while uploading sub data to a WebGL buffer'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
        });
        describe('.dispose()', () => {
            it('should do nothing if the instance has already been disposed', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                Reflect.set(buffer, '_disposed', true);

                //-- When
                buffer.dispose();

                //-- Then
                expect(nativeContext.deleteBuffer).to.satisfy(
                    () => nativeContext.deleteBuffer.notCalled
                );
            });
            it('should delete the native WebGL buffer if the instance wraps one', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                nativeContext.deleteBuffer.withArgs(native).returns();

                //-- When
                buffer.dispose();

                //-- Then
                expect(nativeContext.deleteBuffer).to.satisfy(() =>
                    nativeContext.deleteBuffer.calledOnceWithExactly(native)
                );
            });
            it('should not delete the native WebGL buffer if the instance does not wrap one', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                Reflect.set(buffer, '_native', null);

                //-- When
                buffer.dispose();

                //-- Then
                expect(nativeContext.deleteBuffer).to.satisfy(
                    () => nativeContext.deleteBuffer.notCalled
                );
            });
            it('should set the `allocatedSize` property to `null`', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                const allocatedSize = faker.number.int({
                    min: 512,
                    max: 2048
                });
                Reflect.set(buffer, '_allocatedSize', allocatedSize);

                //-- When
                buffer.dispose();

                //-- Then
                expect(buffer.allocatedSize).to.be.null;
            });
            it('should set the `usageHint` property to `null`', () => {
                //-- Given
                const target = faker.helpers.arrayElement(bufferTargets);
                nativeContext.createBuffer.returns(native);
                const buffer = new Buffer(context, target);
                const usageHint = faker.helpers.arrayElement(bufferUsageHints);
                Reflect.set(buffer, '_usageHint', usageHint);

                //-- When
                buffer.dispose();

                //-- Then
                expect(buffer.usageHint).to.be.null;
            });
        });
    });
});
