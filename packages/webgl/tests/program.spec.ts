//-- NPM Packages
import chai, {expect} from 'chai';
import {createStubInstance, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import {Faker, en, en_CA, en_US, base} from '@faker-js/faker';

//-- Project Code
import {Program} from '@src/program';
import {Context} from '@src/context';
import {Shader} from '@src/shader';
import {ShaderType} from '@src/shaderType';
import {WebGLError} from '@src/errors/webglError';
import {DisposedError, StateError} from 'webcraft-common';

chai.use(sinonChai);

/**
 * The fake data generator.
 */
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:webcraft-webgl', () => {
    describe('class:Program', () => {
        const shaderTypes = [
            ShaderType.VertexShader,
            ShaderType.FragmentShader
        ];
        let nativeContext: SinonStubbedInstance<WebGLRenderingContext>;
        let context: Context;
        let native: SinonStubbedInstance<WebGLProgram>;
        beforeEach(() => {
            nativeContext = createStubInstance(WebGLRenderingContext);
            context = new Context(nativeContext);
            native = {} as WebGLProgram;
        });
        describe('.attachedShaders', () => {
            it('should be an empty list of the instance has no attached shaders', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);

                //-- When
                const r = program.attachedShaders;

                //-- Then
                expect(r).to.be.empty;
            });
            it('should contain the shaders attached to the instance', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                const shaders = faker.helpers.multiple(() => {
                    const type = faker.helpers.arrayElement(shaderTypes);
                    return new Shader(context, type);
                });
                Reflect.set(program, '_attachedShaders', shaders);

                //-- When
                const r = program.attachedShaders;

                //-- Then
                expect(r).to.contain.all.members(shaders);
            });
            it('should be a shallow clone', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                const shaders = faker.helpers.multiple(() => {
                    const type = faker.helpers.arrayElement(shaderTypes);
                    return new Shader(context, type);
                });
                Reflect.set(program, '_attachedShaders', shaders);

                //-- When
                const r = program.attachedShaders;

                //-- Then
                expect(r).to.not.equal(shaders);
            });
        });
        describe('.infoLog', () => {
            it('should set to `null` if the instance is disposed', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_disposed', true);

                //-- When
                const r = program.infoLog;

                //-- Then
                expect(r).to.be.null;
            });
            it('should be set to `null` if the instance does not wrap a valid WebGL program', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_native', null);

                //-- When
                const r = program.infoLog;

                //-- Then
                expect(r).to.be.null;
            });
            it('should be set to `null` if the instance has not been linked yet', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                nativeContext.getProgramInfoLog.withArgs(native).returns(null);

                //-- When
                const r = program.infoLog;

                //-- Then
                expect(r).to.be.null;
            });
            it('should be set to the information log from the last call to compile the instance', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                const infoLog = faker.lorem.paragraph();
                nativeContext.getProgramInfoLog
                    .withArgs(native)
                    .returns(infoLog);

                //-- When
                const r = program.infoLog;

                //-- Then
                expect(r).to.equal(infoLog);
            });
        });
        describe('.isLinked', () => {
            it('should set to `false` if the instance is disposed', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_disposed', true);

                //-- When
                const r = program.isLinked;

                //-- Then
                expect(r).to.be.false;
            });
            it('should set to `false` if the instance does not wrap a valid WebGL program', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_native', null);

                //-- When
                const r = program.isLinked;

                //-- Then
                expect(r).to.be.false;
            });
            it('should be set to `false` if the instance has not been linked yet', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                nativeContext.getProgramParameter
                    .withArgs(native, WebGLRenderingContext.LINK_STATUS)
                    .returns(false);

                //-- When
                const r = program.isLinked;

                //-- Then
                expect(r).to.be.false;
            });
            it('should be set to `true` if the instance has been linked', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                nativeContext.getProgramParameter
                    .withArgs(native, WebGLRenderingContext.LINK_STATUS)
                    .returns(true);

                //-- When
                const r = program.isLinked;

                //-- Then
                expect(r).to.be.true;
            });
        });
        describe('.isActive', () => {
            it('should set to `false` if the instance is disposed', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_disposed', true);

                //-- When
                const r = program.isActive;

                //-- Then
                expect(r).to.be.false;
            });
            it('should set to `false` if the instance does not wrap a valid WebGL program', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_native', null);

                //-- When
                const r = program.isActive;

                //-- Then
                expect(r).to.be.false;
            });
            it('should be set to `false` if the instance is not active', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                nativeContext.getParameter
                    .withArgs(WebGLRenderingContext.CURRENT_PROGRAM)
                    .returns(null);

                //-- When
                const r = program.isActive;

                //-- Then
                expect(r).to.be.false;
            });
            it('should be set to `true` if the instance is active', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                nativeContext.getParameter
                    .withArgs(WebGLRenderingContext.CURRENT_PROGRAM)
                    .returns(native);

                //-- When
                const r = program.isActive;

                //-- Then
                expect(r).to.be.true;
            });
        });
        describe('.constructor()', () => {
            it('should pass the `context` parameter to the base class', () => {
                //-- Given
                nativeContext.createProgram.returns(native);

                //-- When
                const program = new Program(context);

                //-- Then
                expect(program.context).to.equal(context);
            });
            it('should set the `native` property to the newly created native WebGL program', () => {
                //-- Given
                nativeContext.createProgram.returns(native);

                //-- When
                const program = new Program(context);

                //-- Then
                expect(program.native).to.equal(native);
            });
            it('should throw an `WebGLError` if the native WebGL program fails to be created', () => {
                //-- Given
                nativeContext.createProgram.returns(null);

                //-- When
                try {
                    new Program(context);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(WebGLError);
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('createProgram');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Failed to create native WebGL program resource'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should set the `attachedShaders` property to an empty list', () => {
                //-- Given
                nativeContext.createProgram.returns(native);

                //-- When
                const program = new Program(context);

                //-- Then
                expect(program.attachedShaders).to.be.empty;
            });
        });
        describe('.hasAttachedShader()', () => {
            it('should return `false` if the instance has is disposed', () => {
                //-- Given
                const nativeShader = {} as WebGLShader;
                const shaderType = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader
                    .withArgs(shaderType)
                    .returns(nativeShader);
                const shader = new Shader(context, shaderType);
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_disposed', true);

                //-- When
                const r = program.hasAttachShader(shader);

                //-- Then
                expect(r).to.be.false;
            });
            it('should return `false` if the instance has does not wrap a valid WebGL program', () => {
                //-- Given
                const nativeShader = {} as WebGLShader;
                const shaderType = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader
                    .withArgs(shaderType)
                    .returns(nativeShader);
                const shader = new Shader(context, shaderType);
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_native', null);

                //-- When
                const r = program.hasAttachShader(shader);

                //-- Then
                expect(r).to.be.false;
            });
            it('should return `false` if the instance does not have the given shader attached', () => {
                //-- Given
                const nativeShader = {} as WebGLShader;
                const shaderType = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader
                    .withArgs(shaderType)
                    .returns(nativeShader);
                const shader = new Shader(context, shaderType);
                nativeContext.createProgram.returns(native);
                const program = new Program(context);

                //-- When
                const r = program.hasAttachShader(shader);

                //-- Then
                expect(r).to.be.false;
            });
            it('should return `true` if the instance does have the given shader attached', () => {
                //-- Given
                const nativeShader = {} as WebGLShader;
                const shaderType = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader
                    .withArgs(shaderType)
                    .returns(nativeShader);
                const shader = new Shader(context, shaderType);
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_attachedShaders', [shader]);

                //-- When
                const r = program.hasAttachShader(shader);

                //-- Then
                expect(r).to.be.true;
            });
        });
        describe('.attachShader()', () => {
            it('should throw a `DisposedError` if the instance has been disposed', () => {
                //-- Given
                const nativeShader = {} as WebGLShader;
                const shaderType = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader
                    .withArgs(shaderType)
                    .returns(nativeShader);
                const shader = new Shader(context, shaderType);
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_disposed', true);

                //-- When
                try {
                    program.attachShader(shader);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(DisposedError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Program');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('attachShader');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Cannot attach a shader to a disposed WebGL program'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should throw a `StateError` if the instance does not wrap a valid WebGL program', () => {
                //-- Given
                const nativeShader = {} as WebGLShader;
                const shaderType = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader
                    .withArgs(shaderType)
                    .returns(nativeShader);
                const shader = new Shader(context, shaderType);
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_native', null);

                //-- When
                try {
                    program.attachShader(shader);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(StateError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Program');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('attachShader');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Cannot attach a shader to an invalid WebGL program'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should do nothing if the instance already has the given shader attached to it', () => {
                //-- Given
                const nativeShader = {} as WebGLShader;
                const shaderType = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader
                    .withArgs(shaderType)
                    .returns(nativeShader);
                const shader = new Shader(context, shaderType);
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_attachedShaders', [shader]);

                //-- When
                program.attachShader(shader);

                //-- Then
                expect(nativeContext.attachShader).to.not.have.been.called;
            });
            it('should throw a `DisposedError` if the given shader has been disposed', () => {
                //-- Given
                const nativeShader = {} as WebGLShader;
                const shaderType = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader
                    .withArgs(shaderType)
                    .returns(nativeShader);
                const shader = new Shader(context, shaderType);
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(shader, '_disposed', true);

                //-- When
                try {
                    program.attachShader(shader);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(DisposedError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Shader');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('attachShader');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Cannot attach a disposed shader to a WebGL program'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should throw a `StateError` if the given shader does not wrap a valid WebGL shader', () => {
                //-- Given
                const nativeShader = {} as WebGLShader;
                const shaderType = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader
                    .withArgs(shaderType)
                    .returns(nativeShader);
                const shader = new Shader(context, shaderType);
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(shader, '_native', null);

                //-- When
                try {
                    program.attachShader(shader);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(StateError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Shader');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('attachShader');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Cannot attach an invalid shader to a WebGL program'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should attach the given shader to the instance', () => {
                //-- Given
                const nativeShader = {} as WebGLShader;
                const shaderType = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader
                    .withArgs(shaderType)
                    .returns(nativeShader);
                const shader = new Shader(context, shaderType);
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                nativeContext.getError.returns(WebGLRenderingContext.NO_ERROR);

                //-- When
                program.attachShader(shader);

                //-- Then
                expect(
                    nativeContext.attachShader
                ).to.have.been.calledOnceWithExactly(native, nativeShader);
            });
            it('should throw an `WebGLError` if a WebGL error occurs', () => {
                //-- Given
                const nativeShader = {} as WebGLShader;
                const shaderType = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader
                    .withArgs(shaderType)
                    .returns(nativeShader);
                const shader = new Shader(context, shaderType);
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                nativeContext.getError.returns(
                    WebGLRenderingContext.INVALID_OPERATION
                );

                //-- When
                try {
                    program.attachShader(shader);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(WebGLError);
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('attachShader');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'An error occurred while attaching a shader to a WebGL program'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should add the given shader to the `attachedShaders` list', () => {
                //-- Given
                const nativeShader = {} as WebGLShader;
                const shaderType = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader
                    .withArgs(shaderType)
                    .returns(nativeShader);
                const shader = new Shader(context, shaderType);
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                nativeContext.getError.returns(WebGLRenderingContext.NO_ERROR);

                //-- When
                program.attachShader(shader);

                //-- Then
                expect(program.attachedShaders).to.include(shader);
            });
        });
        describe('.detachShader()', () => {
            it('should throw a `DisposedError` if the instance has been disposed', () => {
                //-- Given
                const nativeShader = {} as WebGLShader;
                const shaderType = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader
                    .withArgs(shaderType)
                    .returns(nativeShader);
                const shader = new Shader(context, shaderType);
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_disposed', true);

                //-- When
                try {
                    program.detachShader(shader);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(DisposedError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Program');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('detachShader');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Cannot detach a shader from a disposed WebGL program'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should throw a `StateError` if the instance does not wrap a valid WebGL program', () => {
                //-- Given
                const nativeShader = {} as WebGLShader;
                const shaderType = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader
                    .withArgs(shaderType)
                    .returns(nativeShader);
                const shader = new Shader(context, shaderType);
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_native', null);

                //-- When
                try {
                    program.detachShader(shader);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(StateError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Program');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('detachShader');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Cannot detach a shader from an invalid WebGL program'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should do nothing if the instance does not have the given shader attached to it', () => {
                //-- Given
                const nativeShader = {} as WebGLShader;
                const shaderType = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader
                    .withArgs(shaderType)
                    .returns(nativeShader);
                const shader = new Shader(context, shaderType);
                nativeContext.createProgram.returns(native);
                const program = new Program(context);

                //-- When
                program.detachShader(shader);

                //-- Then
                expect(nativeContext.detachShader).to.not.have.been.called;
            });
            it('should throw a `DisposedError` if the given shader has been disposed', () => {
                //-- Given
                const nativeShader = {} as WebGLShader;
                const shaderType = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader
                    .withArgs(shaderType)
                    .returns(nativeShader);
                const shader = new Shader(context, shaderType);
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_attachedShaders', [shader]);
                Reflect.set(shader, '_disposed', true);

                //-- When
                try {
                    program.detachShader(shader);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(DisposedError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Shader');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('detachShader');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Cannot detach a disposed shader from a WebGL program'
                        );
                    return;
                }
                expect.fail('Function did not throw when it should have');
            });
            it('should throw a `StateError` if the given shader does not wrap a valid WebGL shader', () => {
                //-- Given
                const nativeShader = {} as WebGLShader;
                const shaderType = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader
                    .withArgs(shaderType)
                    .returns(nativeShader);
                const shader = new Shader(context, shaderType);
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_attachedShaders', [shader]);
                Reflect.set(shader, '_native', null);

                //-- When
                try {
                    program.detachShader(shader);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(StateError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Shader');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('detachShader');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Cannot detach an invalid shader from a WebGL program'
                        );
                    return;
                }
                expect.fail('Function did not throw when it should have');
            });
            it('should detach the given shader from the instance', () => {
                //-- Given
                const nativeShader = {} as WebGLShader;
                const shaderType = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader
                    .withArgs(shaderType)
                    .returns(nativeShader);
                const shader = new Shader(context, shaderType);
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_attachedShaders', [shader]);
                nativeContext.getError.returns(WebGLRenderingContext.NO_ERROR);

                //-- When
                program.detachShader(shader);

                //-- Then
                expect(
                    nativeContext.detachShader
                ).to.have.been.calledOnceWithExactly(native, nativeShader);
            });
            it('should throw an `WebGLError` if a WebGL error occurs', () => {
                //-- Given
                const nativeShader = {} as WebGLShader;
                const shaderType = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader
                    .withArgs(shaderType)
                    .returns(nativeShader);
                const shader = new Shader(context, shaderType);
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_attachedShaders', [shader]);
                nativeContext.getError.returns(
                    WebGLRenderingContext.INVALID_VALUE
                );

                //-- When
                try {
                    program.detachShader(shader);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(WebGLError);
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('detachShader');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'An error occurred while detaching a shader from a WebGL program'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should remove the given shader from the `attachedShaders` list', () => {
                //-- Given
                const nativeShader = {} as WebGLShader;
                const shaderType = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader
                    .withArgs(shaderType)
                    .returns(nativeShader);
                const shader = new Shader(context, shaderType);
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_attachedShaders', [shader]);
                nativeContext.getError.returns(WebGLRenderingContext.NO_ERROR);

                //-- When
                program.detachShader(shader);

                //-- Then
                expect(program.attachedShaders).to.not.include(shader);
            });
        });
        describe('.link()', () => {
            it('should throw a `DisposedError` if the instance has been disposed', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_disposed', true);

                //-- When
                try {
                    program.link();
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(DisposedError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Program');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('link');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals('Cannot link a disposed WebGL program');
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should throw a `StateError` if the instance does not wrap a valid WebGL program', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_native', null);

                //-- When
                try {
                    program.link();
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(StateError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Program');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('link');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals('Cannot link an invalid WebGL program');
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should throw a `StateError` if the instance does not have any shaders attached to it', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);

                //-- When
                try {
                    program.link();
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(StateError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Program');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('link');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Cannot link a WebGL program with no attached shaders'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should link the instance', () => {
                //-- Given
                const nativeShader = {} as WebGLShader;
                const shaderType = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader
                    .withArgs(shaderType)
                    .returns(nativeShader);
                const shader = new Shader(context, shaderType);
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_attachedShaders', [shader]);
                nativeContext.getError.returns(WebGLRenderingContext.NO_ERROR);

                //-- When
                program.link();

                //-- Then
                expect(
                    nativeContext.linkProgram
                ).to.have.been.calledOnceWithExactly(native);
            });
            it('should throw an `WebGLError` if a WebGL error occurs', () => {
                //-- Given
                const nativeShader = {} as WebGLShader;
                const shaderType = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader
                    .withArgs(shaderType)
                    .returns(nativeShader);
                const shader = new Shader(context, shaderType);
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_attachedShaders', [shader]);
                nativeContext.getError.returns(
                    WebGLRenderingContext.INVALID_VALUE
                );

                //-- When
                try {
                    program.link();
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(WebGLError);
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('link');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'An error occurred while linking a WebGL program'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
        });
        describe('.activate()', () => {
            it('should throw a `DisposedError` if the instance has been disposed', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_disposed', true);

                //-- When
                try {
                    program.activate();
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(DisposedError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Program');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('activate');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Cannot activate a disposed WebGL program'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should throw a `StateError` if the instance does not wrap a valid WebGL program', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_native', null);

                //-- When
                try {
                    program.activate();
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(StateError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Program');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('activate');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Cannot activate an invalid WebGL program'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should throw a `StateError` if the instance is not linked', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                nativeContext.getProgramParameter
                    .withArgs(native, WebGLRenderingContext.LINK_STATUS)
                    .returns(false);

                //-- When
                try {
                    program.activate();
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(StateError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Program');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('activate');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Cannot activate an unlinked WebGL program'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should do nothing if the instance is not active', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                nativeContext.getParameter
                    .withArgs(WebGLRenderingContext.CURRENT_PROGRAM)
                    .returns(native);
                nativeContext.getProgramParameter
                    .withArgs(native, WebGLRenderingContext.LINK_STATUS)
                    .returns(true);
                nativeContext.getError.returns(WebGLRenderingContext.NO_ERROR);

                //-- When
                program.activate();

                //-- Then
                expect(nativeContext.useProgram).to.not.have.been.called;
            });
            it('should activate the instance', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                nativeContext.getProgramParameter
                    .withArgs(native, WebGLRenderingContext.LINK_STATUS)
                    .returns(true);
                nativeContext.getError.returns(WebGLRenderingContext.NO_ERROR);

                //-- When
                program.activate();

                //-- Then
                expect(
                    nativeContext.useProgram
                ).to.have.been.calledOnceWithExactly(native);
            });
            it('should throw an `WebGLError` if a WebGL error occurs', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                nativeContext.getProgramParameter
                    .withArgs(native, WebGLRenderingContext.LINK_STATUS)
                    .returns(true);
                nativeContext.getError.returns(
                    WebGLRenderingContext.INVALID_OPERATION
                );

                //-- When
                try {
                    program.activate();
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(WebGLError);
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('activate');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'An error occurred while activating a WebGL program'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
        });
        describe('.deactivate()', () => {
            it('should throw a `DisposedError` if the instance has been disposed', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_disposed', true);

                //-- When
                try {
                    program.deactivate();
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(DisposedError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Program');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('deactivate');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Cannot deactivate a disposed WebGL program'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should throw a `StateError` if the instance does not wrap a valid WebGL program', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_native', null);

                //-- When
                try {
                    program.deactivate();
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(StateError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Program');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('deactivate');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Cannot deactivate an invalid WebGL program'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should throw a `StateError` if the instance is not linked', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                nativeContext.getProgramParameter
                    .withArgs(native, WebGLRenderingContext.LINK_STATUS)
                    .returns(false);

                //-- When
                try {
                    program.deactivate();
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(StateError);
                    expect(ex)
                        .to.have.a.property('objectType')
                        .which.equals('Program');
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('deactivate');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'Cannot deactivate an unlinked WebGL program'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should do nothing if the instance is not active', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                nativeContext.getParameter
                    .withArgs(WebGLRenderingContext.CURRENT_PROGRAM)
                    .returns(null);
                nativeContext.getProgramParameter
                    .withArgs(native, WebGLRenderingContext.LINK_STATUS)
                    .returns(true);
                nativeContext.getError.returns(WebGLRenderingContext.NO_ERROR);

                //-- When
                program.deactivate();

                //-- Then
                expect(nativeContext.useProgram).to.not.have.been.called;
            });
            it('should deactivate the instance', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                nativeContext.getParameter
                    .withArgs(WebGLRenderingContext.CURRENT_PROGRAM)
                    .returns(native);
                nativeContext.getProgramParameter
                    .withArgs(native, WebGLRenderingContext.LINK_STATUS)
                    .returns(true);
                nativeContext.getError.returns(WebGLRenderingContext.NO_ERROR);

                //-- When
                program.deactivate();

                //-- Then
                expect(
                    nativeContext.useProgram
                ).to.have.been.calledOnceWithExactly(null);
            });
            it('should throw an `WebGLError` if a WebGL error occurs', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                nativeContext.getParameter
                    .withArgs(WebGLRenderingContext.CURRENT_PROGRAM)
                    .returns(native);
                nativeContext.getProgramParameter
                    .withArgs(native, WebGLRenderingContext.LINK_STATUS)
                    .returns(true);
                nativeContext.getError.returns(
                    WebGLRenderingContext.INVALID_OPERATION
                );

                //-- When
                try {
                    program.deactivate();
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(WebGLError);
                    expect(ex)
                        .to.have.a.property('operationName')
                        .which.equals('deactivate');
                    expect(ex)
                        .to.have.a.property('message')
                        .which.equals(
                            'An error occurred while deactivating a WebGL program'
                        );
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
        });
        describe('.dispose()', () => {
            it('should do nothing if the instance is already disposed', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_disposed', true);

                //-- When
                program.dispose();

                //-- Then
                expect(nativeContext.deleteProgram).to.not.have.been.called;
            });
            it('should do nothing if the instance does not wrap a valid native WebGL program', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_native', null);

                //-- When
                program.dispose();

                //-- Then
                expect(nativeContext.deleteProgram).to.not.have.been.called;
            });
            it('should delete the native WebGL program', () => {
                //-- Given
                nativeContext.createProgram.returns(native);
                const program = new Program(context);

                //-- When
                program.dispose();

                //-- Then
                expect(
                    nativeContext.deleteProgram
                ).to.have.been.calledOnceWithExactly(native);
            });
            it('should set the `attachedShaders` list to an empty list', () => {
                //-- Given
                const nativeShader = {} as WebGLShader;
                const shaderType = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader
                    .withArgs(shaderType)
                    .returns(nativeShader);
                const shader = new Shader(context, shaderType);
                nativeContext.createProgram.returns(native);
                const program = new Program(context);
                Reflect.set(program, '_attachedShaders', [shader]);

                //-- When
                program.dispose();

                //-- Then
                expect(program.attachedShaders).to.be.empty;
            });
        });
    });
});
