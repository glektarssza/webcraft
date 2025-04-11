//-- NPM Packages
import {beforeAll, describe, expect, it, vi} from 'vitest';
import {Faker, base, en, en_CA, en_US} from '@faker-js/faker';

//-- Project Code
import * as m from '@src/result';
import {
    type Mapper,
    type Predicate,
    type UnaryFunction
} from '@src/types/functions';

/**
 * The fake data provider.
 */
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:result', (): void => {
    beforeAll(() => {
        if (FAKER_SEED && isFinite(parseInt(FAKER_SEED))) {
            faker.seed(parseInt(FAKER_SEED));
        }
    });
    describe('class:Result', (): void => {
        describe('.ok()', (): void => {
            it('should return a new object with the given success value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();

                //-- When
                const r = m.Result.ok(value);

                //-- Then
                expect(r).to.have.property('_holdsSuccess').which.is.true;
                expect(r).to.have.property('_successValue').which.equals(value);
            });
        });
        describe('.error()', (): void => {
            it('should return a new object with the given error value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();

                //-- When
                const r = m.Result.error(value);

                //-- Then
                expect(r).to.have.property('_holdsError').which.is.true;
                expect(r).to.have.property('_errorValue').which.equals(value);
            });
        });
        describe('#clone()', (): void => {
            it('should return a clone of the instance', (): void => {
                const cases = [m.Result.ok, m.Result.error];

                cases.forEach((routine): void => {
                    //-- Given
                    const value = faker.string.alphanumeric();
                    const instance = routine(value);

                    //-- When
                    const r = instance.clone();

                    //-- Then
                    expect(r).to.deep.equal(instance);
                });
            });
        });
        describe('#isOk()', (): void => {
            it('should return `true` if the instance holds a success value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const instance = m.Result.ok(value);

                //-- When
                const r = instance.isOk();

                //-- Then
                expect(r).to.be.true;
            });
            it('should return `false` if the instance holds an error value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const instance = m.Result.error(value);

                //-- When
                const r = instance.isOk();

                //-- Then
                expect(r).to.be.false;
            });
        });
        describe('#isOkAnd()', (): void => {
            it('should return `true` if the instance holds a success value and the predicate returns `true`', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const predicate = vi
                    .fn<Predicate<typeof value>>()
                    .mockReturnValue(true);
                const instance = m.Result.ok(value);

                //-- When
                const r = instance.isOkAnd(predicate);

                //-- Then
                expect(r).to.be.true;
                expect(predicate).toHaveBeenCalled();
            });
            it('should return `false` if the instance holds a success value and the predicate returns `false`', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const predicate = vi
                    .fn<Predicate<typeof value>>()
                    .mockReturnValue(false);
                const instance = m.Result.ok(value);

                //-- When
                const r = instance.isOkAnd(predicate);

                //-- Then
                expect(r).to.be.false;
                expect(predicate).toHaveBeenCalled();
            });
            it('should return `false` if the instance holds an error value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const predicate = vi
                    .fn<Predicate<typeof value>>()
                    .mockReturnValue(false);
                const instance = m.Result.error<typeof value, typeof value>(
                    value
                );

                //-- When
                const r = instance.isOkAnd(predicate);

                //-- Then
                expect(r).to.be.false;
                expect(predicate).not.toHaveBeenCalled();
            });
        });
        describe('#isError()', (): void => {
            it('should return `true` if the instance holds an error value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const instance = m.Result.error(value);

                //-- When
                const r = instance.isError();

                //-- Then
                expect(r).to.be.true;
            });
            it('should return `false` if the instance holds a success value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const instance = m.Result.ok(value);

                //-- When
                const r = instance.isError();

                //-- Then
                expect(r).to.be.false;
            });
        });
        describe('#isErrorAnd()', (): void => {
            it('should return `true` if the instance holds an error value and the predicate returns `true`', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const predicate = vi
                    .fn<Predicate<typeof value>>()
                    .mockReturnValue(true);
                const instance = m.Result.error(value);

                //-- When
                const r = instance.isErrorAnd(predicate);

                //-- Then
                expect(r).to.be.true;
                expect(predicate).toHaveBeenCalled();
            });
            it('should return `false` if the instance holds an error value and the predicate returns `false`', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const predicate = vi
                    .fn<Predicate<typeof value>>()
                    .mockReturnValue(false);
                const instance = m.Result.error(value);

                //-- When
                const r = instance.isErrorAnd(predicate);

                //-- Then
                expect(r).to.be.false;
                expect(predicate).toHaveBeenCalled();
            });
            it('should return `false` if the instance holds a success value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const predicate = vi
                    .fn<Predicate<typeof value>>()
                    .mockReturnValue(false);
                const instance = m.Result.ok<typeof value, typeof value>(value);

                //-- When
                const r = instance.isErrorAnd(predicate);

                //-- Then
                expect(r).to.be.false;
                expect(predicate).not.toHaveBeenCalled();
            });
        });
        describe('#and()', (): void => {
            it('should return the other instance if the called instance holds a success value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const otherValue = faker.string.alphanumeric();
                const instance = m.Result.ok(value);
                const otherInstance = m.Result.ok(otherValue);

                //-- When
                const r = instance.and(otherInstance);

                //-- Then
                expect(r).to.equal(otherInstance);
            });
            it('should return a new instance holding the error value if the called instance holds an error value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const otherValue = faker.string.alphanumeric();
                const instance = m.Result.error(value);
                const otherInstance = m.Result.ok<string, string>(otherValue);

                //-- When
                const r = instance.and(otherInstance);

                //-- Then
                expect(r).to.not.equal(otherInstance);
                expect(r).to.not.equal(instance);
                expect(r)
                    .to.have.property('_errorValue')
                    .which.equals(instance['_errorValue']);
            });
        });
        describe('#andThen()', (): void => {
            it('should return the result of calling the given function if the called instance holds a success value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const otherValue = faker.string.alphanumeric();
                const instance = m.Result.ok<string, string>(value);
                const otherInstance = m.Result.ok<string, string>(otherValue);
                const mapper = vi
                    .fn<Mapper<string, m.Result<string, string>>>()
                    .mockReturnValue(otherInstance);

                //-- When
                const r = instance.andThen(mapper);

                //-- Then
                expect(r).to.equal(otherInstance);
                expect(mapper).toHaveBeenCalled();
            });
            it('should pass the success value to the provided function', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const otherValue = faker.string.alphanumeric();
                const instance = m.Result.ok<string, string>(value);
                const otherInstance = m.Result.ok<string, string>(otherValue);
                const mapper = vi
                    .fn<Mapper<string, m.Result<string, string>>>()
                    .mockReturnValue(otherInstance);

                //-- When
                instance.andThen(mapper);

                //-- Then
                expect(mapper).toHaveBeenCalledWith(value);
            });
            it('should return a new instance holding the error value if the called instance holds an error value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const otherValue = faker.string.alphanumeric();
                const instance = m.Result.error<string, string>(value);
                const otherInstance = m.Result.ok<string, string>(otherValue);
                const mapper = vi
                    .fn<Mapper<string, m.Result<string, string>>>()
                    .mockReturnValue(otherInstance);

                //-- When
                const r = instance.andThen(mapper);

                //-- Then
                expect(r).to.not.equal(otherInstance);
                expect(r).to.not.equal(instance);
                expect(r)
                    .to.have.property('_errorValue')
                    .which.equals(instance['_errorValue']);
                expect(mapper).not.toHaveBeenCalled();
            });
        });
        describe('#or()', (): void => {
            it('should return the other instance if the called instance holds an error value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const otherValue = faker.string.alphanumeric();
                const instance = m.Result.error(value);
                const otherInstance = m.Result.ok(otherValue);

                //-- When
                const r = instance.or(otherInstance);

                //-- Then
                expect(r).to.equal(otherInstance);
            });
            it('should return a new instance holding the success value if the called instance holds a success value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const otherValue = faker.string.alphanumeric();
                const instance = m.Result.ok(value);
                const otherInstance = m.Result.error<string, string>(
                    otherValue
                );

                //-- When
                const r = instance.or(otherInstance);

                //-- Then
                expect(r).to.not.equal(otherInstance);
                expect(r).to.not.equal(instance);
                expect(r)
                    .to.have.property('_successValue')
                    .which.equals(instance['_successValue']);
            });
        });
        describe('#orElse()', (): void => {
            it('should return the result of calling the given function if the called instance holds an error value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const otherValue = faker.string.alphanumeric();
                const instance = m.Result.error<string, string>(value);
                const otherInstance = m.Result.ok<string, string>(otherValue);
                const mapper = vi
                    .fn<Mapper<string, m.Result<string, string>>>()
                    .mockReturnValue(otherInstance);

                //-- When
                const r = instance.orElse(mapper);

                //-- Then
                expect(r).to.equal(otherInstance);
                expect(mapper).toHaveBeenCalled();
            });
            it('should pass the error value to the provided function', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const otherValue = faker.string.alphanumeric();
                const instance = m.Result.error<string, string>(value);
                const otherInstance = m.Result.ok<string, string>(otherValue);
                const mapper = vi
                    .fn<Mapper<string, m.Result<string, string>>>()
                    .mockReturnValue(otherInstance);

                //-- When
                instance.orElse(mapper);

                //-- Then
                expect(mapper).toHaveBeenCalledWith(value);
            });
            it('should return a new instance holding the error value if the called instance holds a success value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const otherValue = faker.string.alphanumeric();
                const instance = m.Result.ok<string, string>(value);
                const otherInstance = m.Result.ok<string, string>(otherValue);
                const mapper = vi
                    .fn<Mapper<string, m.Result<string, string>>>()
                    .mockReturnValue(otherInstance);

                //-- When
                const r = instance.orElse(mapper);

                //-- Then
                expect(r).to.not.equal(otherInstance);
                expect(r).to.not.equal(instance);
                expect(r)
                    .to.have.property('_successValue')
                    .which.equals(instance['_successValue']);
                expect(mapper).not.toHaveBeenCalled();
            });
        });
        describe('#map()', (): void => {
            it('should return the result of calling the given function if the called instance holds a success value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const otherValue = faker.string.alphanumeric();
                const instance = m.Result.ok<string, string>(value);
                const otherInstance = m.Result.ok<string, string>(otherValue);
                const mapper = vi
                    .fn<Mapper<string, m.Result<string, string>>>()
                    .mockReturnValue(otherInstance);

                //-- When
                const r = instance.map(mapper);

                //-- Then
                expect(r).to.equal(otherInstance);
                expect(mapper).toHaveBeenCalled();
            });
            it('should pass the success value to the provided function', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const otherValue = faker.string.alphanumeric();
                const instance = m.Result.ok<string, string>(value);
                const otherInstance = m.Result.ok<string, string>(otherValue);
                const mapper = vi
                    .fn<Mapper<string, m.Result<string, string>>>()
                    .mockReturnValue(otherInstance);

                //-- When
                instance.map(mapper);

                //-- Then
                expect(mapper).toHaveBeenCalledWith(value);
            });
            it('should return a new instance holding the error value if the called instance holds an error value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const otherValue = faker.string.alphanumeric();
                const instance = m.Result.error<string, string>(value);
                const otherInstance = m.Result.ok<string, string>(otherValue);
                const mapper = vi
                    .fn<Mapper<string, m.Result<string, string>>>()
                    .mockReturnValue(otherInstance);

                //-- When
                const r = instance.map(mapper);

                //-- Then
                expect(r).to.not.equal(otherInstance);
                expect(r).to.not.equal(instance);
                expect(r)
                    .to.have.property('_errorValue')
                    .which.equals(instance['_errorValue']);
            });
        });
        describe('#mapOr()', (): void => {
            it('should return the result of calling the given function if the called instance holds a success value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const otherValue = faker.string.alphanumeric();
                const defaultValue = faker.string.alphanumeric();
                const instance = m.Result.ok<string, string>(value);
                const mapper = vi
                    .fn<Mapper<string, string>>()
                    .mockReturnValue(otherValue);

                //-- When
                const r = instance.mapOr(mapper, defaultValue);

                //-- Then
                expect(r).to.equal(otherValue);
                expect(mapper).toHaveBeenCalled();
            });
            it('should pass the success value to the provided function', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const otherValue = faker.string.alphanumeric();
                const defaultValue = faker.string.alphanumeric();
                const instance = m.Result.ok<string, string>(value);
                const mapper = vi
                    .fn<Mapper<string, string>>()
                    .mockReturnValue(otherValue);

                //-- When
                instance.mapOr(mapper, defaultValue);

                //-- Then
                expect(mapper).toHaveBeenCalledWith(value);
            });
            it('should return the given default value if the called instance holds an error value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const otherValue = faker.string.alphanumeric();
                const defaultValue = faker.string.alphanumeric();
                const instance = m.Result.error<string, string>(value);
                const mapper = vi
                    .fn<Mapper<string, string>>()
                    .mockReturnValue(otherValue);

                //-- When
                const r = instance.mapOr(mapper, defaultValue);

                //-- Then
                expect(r).to.equal(defaultValue);
            });
        });
        describe('#mapOrElse()', (): void => {
            it('should return the result of calling the given function if the called instance holds a success value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const otherValue = faker.string.alphanumeric();
                const defaultValue = faker.string.alphanumeric();
                const instance = m.Result.ok<string, string>(value);
                const mapper = vi
                    .fn<Mapper<string, string>>()
                    .mockReturnValue(otherValue);
                const defaultValueFn = vi
                    .fn<Mapper<string, string>>()
                    .mockReturnValue(defaultValue);

                //-- When
                const r = instance.mapOrElse(mapper, defaultValueFn);

                //-- Then
                expect(r).to.equal(otherValue);
                expect(mapper).toHaveBeenCalled();
                expect(defaultValueFn).not.toHaveBeenCalled();
            });
            it('should pass the success value to the provided function', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const otherValue = faker.string.alphanumeric();
                const defaultValue = faker.string.alphanumeric();
                const instance = m.Result.ok<string, string>(value);
                const mapper = vi
                    .fn<Mapper<string, string>>()
                    .mockReturnValue(otherValue);
                const defaultValueFn = vi
                    .fn<Mapper<string, string>>()
                    .mockReturnValue(defaultValue);

                //-- When
                instance.mapOrElse(mapper, defaultValueFn);

                //-- Then
                expect(mapper).toHaveBeenCalledWith(value);
            });
            it('should return the result of calling the given default value function if the called instance holds an error value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const otherValue = faker.string.alphanumeric();
                const defaultValue = faker.string.alphanumeric();
                const instance = m.Result.error<string, string>(value);
                const mapper = vi
                    .fn<Mapper<string, string>>()
                    .mockReturnValue(otherValue);
                const defaultValueFn = vi
                    .fn<Mapper<string, string>>()
                    .mockReturnValue(defaultValue);

                //-- When
                const r = instance.mapOrElse(mapper, defaultValueFn);

                //-- Then
                expect(r).to.equal(defaultValue);
                expect(defaultValueFn).toHaveBeenCalled();
            });
            it('should pass the error value to the provided default value function', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const otherValue = faker.string.alphanumeric();
                const defaultValue = faker.string.alphanumeric();
                const instance = m.Result.error<string, string>(value);
                const mapper = vi
                    .fn<Mapper<string, string>>()
                    .mockReturnValue(otherValue);
                const defaultValueFn = vi
                    .fn<Mapper<string, string>>()
                    .mockReturnValue(defaultValue);

                //-- When
                instance.mapOrElse(mapper, defaultValueFn);

                //-- Then
                expect(defaultValueFn).toHaveBeenCalledWith(value);
            });
        });
        describe('#mapError()', (): void => {
            it('should return the result of calling the given function if the called instance holds an error value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const otherValue = faker.string.alphanumeric();
                const instance = m.Result.error<string, string>(value);
                const otherInstance = m.Result.ok<string, string>(otherValue);
                const mapper = vi
                    .fn<Mapper<string, m.Result<string, string>>>()
                    .mockReturnValue(otherInstance);

                //-- When
                const r = instance.mapError(mapper);

                //-- Then
                expect(r).to.equal(otherInstance);
                expect(mapper).toHaveBeenCalled();
            });
            it('should pass the error value to the provided function', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const otherValue = faker.string.alphanumeric();
                const instance = m.Result.error<string, string>(value);
                const otherInstance = m.Result.ok<string, string>(otherValue);
                const mapper = vi
                    .fn<Mapper<string, m.Result<string, string>>>()
                    .mockReturnValue(otherInstance);

                //-- When
                instance.mapError(mapper);

                //-- Then
                expect(mapper).toHaveBeenCalledWith(value);
            });
            it('should return a new instance holding the success value if the called instance holds an success value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const otherValue = faker.string.alphanumeric();
                const instance = m.Result.ok<string, string>(value);
                const otherInstance = m.Result.ok<string, string>(otherValue);
                const mapper = vi
                    .fn<Mapper<string, m.Result<string, string>>>()
                    .mockReturnValue(otherInstance);

                //-- When
                const r = instance.mapError(mapper);

                //-- Then
                expect(r).to.not.equal(otherInstance);
                expect(r).to.not.equal(instance);
                expect(r)
                    .to.have.property('_successValue')
                    .which.equals(instance['_successValue']);
            });
        });
        describe('#inspectOk()', (): void => {
            it('should return the same instance', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const instance = m.Result.ok<string, string>(value);
                const fn = vi.fn<UnaryFunction<string>>();

                //-- When
                const r = instance.inspectOk(fn);

                //-- Then
                expect(r).to.equal(instance);
            });
            it('should call the given function if the instance holds a success value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const instance = m.Result.ok<string, string>(value);
                const fn = vi.fn<UnaryFunction<string>>();

                //-- When
                instance.inspectOk(fn);

                //-- Then
                expect(fn).toHaveBeenCalled();
            });
            it('should pass the success value to the given function', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const instance = m.Result.ok<string, string>(value);
                const fn = vi.fn<UnaryFunction<string>>();

                //-- When
                instance.inspectOk(fn);

                //-- Then
                expect(fn).toHaveBeenCalledWith(value);
            });
            it('should not call the given function if the instance holds an error value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const instance = m.Result.error<string, string>(value);
                const fn = vi.fn<UnaryFunction<string>>();

                //-- When
                instance.inspectOk(fn);

                //-- Then
                expect(fn).not.toHaveBeenCalled();
            });
        });
        describe('#inspectError()', (): void => {
            it('should return the same instance', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const instance = m.Result.error<string, string>(value);
                const fn = vi.fn<UnaryFunction<string>>();

                //-- When
                const r = instance.inspectError(fn);

                //-- Then
                expect(r).to.equal(instance);
            });
            it('should call the given function if the instance holds an error value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const instance = m.Result.error<string, string>(value);
                const fn = vi.fn<UnaryFunction<string>>();

                //-- When
                instance.inspectError(fn);

                //-- Then
                expect(fn).toHaveBeenCalled();
            });
            it('should pass the error value to the given function', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const instance = m.Result.error<string, string>(value);
                const fn = vi.fn<UnaryFunction<string>>();

                //-- When
                instance.inspectError(fn);

                //-- Then
                expect(fn).toHaveBeenCalledWith(value);
            });
            it('should not call the given function if the instance holds a success value', (): void => {
                //-- Given
                const value = faker.string.alphanumeric();
                const instance = m.Result.ok<string, string>(value);
                const fn = vi.fn<UnaryFunction<string>>();

                //-- When
                instance.inspectError(fn);

                //-- Then
                expect(fn).not.toHaveBeenCalled();
            });
        });
    });
});
