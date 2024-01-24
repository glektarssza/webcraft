//-- NPM Packages
import chai, {expect} from 'chai';
import {createStubInstance, SinonStubbedInstance} from 'sinon';
import sinonChai from 'sinon-chai';
import {Faker, en, en_CA, en_US, base} from '@faker-js/faker';

//-- Project Code
import {Shader} from '@src/shader';
import {ShaderType} from '@src/shaderType';
import {Context} from '@src/context';
import {OperationError} from 'webcraft-common';

chai.use(sinonChai);

/**
 * The fake data generator.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:webcraft-webgl', () => {
    describe('class:Shader', () => {
        const shaderTypes = [
            ShaderType.VertexShader,
            ShaderType.FragmentShader
        ];
        let nativeContext: SinonStubbedInstance<WebGLRenderingContext>;
        let context: Context;
        let native: SinonStubbedInstance<WebGLShader>;
        beforeEach(() => {
            nativeContext = createStubInstance(WebGLRenderingContext);
            context = new Context(nativeContext);
            native = {} as WebGLShader;
        });
        describe('.type', () => {
            it('should be set to the type of shader wrapped by the instance', () => {
                //-- Given
                const type = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader.withArgs(type).returns(native);
                const shader = new Shader(context, type);

                //-- When
                const r = shader.type;

                //-- Then
                expect(r).to.equal(type);
            });
        });
        describe('.sourceCode', () => {
            it('should be set the `null` if no source code has been uploaded to the instance yet', () => {
                //-- Given
                const type = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader.withArgs(type).returns(native);
                const shader = new Shader(context, type);
                nativeContext.getShaderSource.withArgs(native).returns(null);

                //-- When
                const r = shader.sourceCode;

                //-- Then
                expect(r).to.be.null;
            });
            it('should be set the source code uploaded to the instance', () => {
                //-- Given
                const type = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader.withArgs(type).returns(native);
                const shader = new Shader(context, type);
                const sourceCode = faker.lorem.paragraph();
                nativeContext.getShaderSource
                    .withArgs(native)
                    .returns(sourceCode);

                //-- When
                const r = shader.sourceCode;

                //-- Then
                expect(r).to.equal(sourceCode);
            });
        });
        describe('.infoLog', () => {
            it('should be set the `null` if the instance has not been compiled yet', () => {
                //-- Given
                const type = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader.withArgs(type).returns(native);
                const shader = new Shader(context, type);
                nativeContext.getShaderInfoLog.withArgs(native).returns(null);

                //-- When
                const r = shader.infoLog;

                //-- Then
                expect(r).to.be.null;
            });
            it('should be set the information log from the last call to compile the instance', () => {
                //-- Given
                const type = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader.withArgs(type).returns(native);
                const shader = new Shader(context, type);
                const infoLog = faker.lorem.paragraph();
                nativeContext.getShaderInfoLog
                    .withArgs(native)
                    .returns(infoLog);

                //-- When
                const r = shader.infoLog;

                //-- Then
                expect(r).to.equal(infoLog);
            });
        });
        describe('.isCompiled', () => {
            it('should be set to `false` if the instance has not been compiled yet', () => {
                //-- Given
                const type = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader.withArgs(type).returns(native);
                const shader = new Shader(context, type);
                nativeContext.getShaderParameter
                    .withArgs(native, WebGLRenderingContext.COMPILE_STATUS)
                    .returns(false);

                //-- When
                const r = shader.isCompiled;

                //-- Then
                expect(r).to.be.false;
            });
            it('should be set to `true` if the instance has been compiled', () => {
                //-- Given
                const type = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader.withArgs(type).returns(native);
                const shader = new Shader(context, type);
                nativeContext.getShaderParameter
                    .withArgs(native, WebGLRenderingContext.COMPILE_STATUS)
                    .returns(true);

                //-- When
                const r = shader.isCompiled;

                //-- Then
                expect(r).to.be.true;
            });
        });
        describe('.constructor()', () => {
            it('should pass the `context` parameter to the base class', () => {
                //-- Given
                const type = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader.withArgs(type).returns(native);

                //-- When
                const r = new Shader(context, type);

                //-- Then
                expect(r.context).to.equal(context);
            });
            it('should set the `native` property to the newly created native WebGL shader', () => {
                //-- Given
                const type = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader.withArgs(type).returns(native);

                //-- When
                const r = new Shader(context, type);

                //-- Then
                expect(r.native).to.equal(native);
            });
            it('should throw an `OperationError` if the native WebGL shader fails to be created', () => {
                //-- Given
                const type = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader.withArgs(type).returns(null);

                //-- When
                try {
                    new Shader(context, type);
                } catch (ex) {
                    //-- Then
                    expect(ex).to.be.an.instanceOf(OperationError);
                    expect(ex)
                        .to.have.property('message')
                        .which.equals(
                            'Failed to create native WebGL shader resource'
                        );
                    expect(ex)
                        .to.have.property('operationName')
                        .which.equals('createShader');
                    return;
                }

                expect.fail('Function did not throw when it should have');
            });
            it('should set the `type` property to the given value', () => {
                //-- Given
                const type = faker.helpers.arrayElement(shaderTypes);
                nativeContext.createShader.withArgs(type).returns(native);

                //-- When
                const r = new Shader(context, type);

                //-- Then
                expect(r.type).to.equal(type);
            });
        });
        describe('.uploadSourceCode()', () => {
            it(
                'should throw a `DisposedError` if the instance has been disposed'
            );
            it(
                'should throw a `StateError` if the instance does not wrap a valid WebGL shader'
            );
            it('should upload the given source code to the instance');
            it('should throw an `OperationError` if a WebGL error occurs');
        });
        describe('.compile()', () => {
            it(
                'should throw a `DisposedError` if the instance has been disposed'
            );
            it(
                'should throw a `StateError` if the instance does not wrap a valid WebGL shader'
            );
            it(
                'should throw a `StateError` if the instance does not have any source code uploaded to it yet'
            );
            it('should compile the instance');
            it('should throw an `OperationError` if a WebGL error occurs');
        });
    });
});
