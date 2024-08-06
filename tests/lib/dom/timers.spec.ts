//-- NPM Packages
import {
    afterAll,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    vi
} from 'vitest';
import {Faker, base, en, en_CA, en_US} from '@faker-js/faker';

//-- Project Code
import * as m from '@src/lib/dom/timers';

/**
 * The fake data provider.
 */
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:lib/dom/timers', (): void => {
    beforeAll((): void => {
        if (FAKER_SEED && isFinite(parseInt(FAKER_SEED))) {
            faker.seed(parseInt(FAKER_SEED));
        }
    });
    describe('.setTimeout()', (): void => {
        const globalObject = {
            setTimeout: vi.fn()
        };
        beforeAll((): void => {
            m.setGlobalObject(globalObject as unknown as typeof globalThis);
        });
        beforeEach((): void => {
            globalObject.setTimeout.mockReset();
        });
        afterAll((): void => {
            m.resetGlobalObject();
        });
        it('should call the global `setTimeout` function', (): void => {
            //-- Given
            const callback = vi.fn();
            const delay = faker.number.int();

            //-- When
            m.setTimeout(callback, delay);

            //-- Then
            expect(globalObject.setTimeout).toHaveBeenCalledOnce();
        });
        it('should return a unique ID', (): void => {
            //-- Given
            const callback = vi.fn();
            const delay = faker.number.int();
            const id = faker.number.int();
            globalObject.setTimeout.mockReturnValueOnce(id);

            //-- When
            const r = m.setTimeout(callback, delay);

            //-- Then
            expect(r).toBe(id);
        });
        it('should pass any provided arguments on', (): void => {
            //-- Given
            const callback = vi.fn();
            const delay = faker.number.int();
            const args = [faker.lorem.word(), faker.lorem.word()];

            //-- When
            m.setTimeout(callback, delay, ...args);

            //-- Then
            expect(globalObject.setTimeout).toHaveBeenCalledWith(
                callback,
                delay,
                ...args
            );
        });
    });
    describe('.setInterval()', (): void => {
        const globalObject = {
            setInterval: vi.fn()
        };
        beforeAll((): void => {
            m.setGlobalObject(globalObject as unknown as typeof globalThis);
        });
        beforeEach((): void => {
            globalObject.setInterval.mockReset();
        });
        afterAll((): void => {
            m.resetGlobalObject();
        });
        it('should call the global `setInterval` function', (): void => {
            //-- Given
            const callback = vi.fn();
            const delay = faker.number.int();

            //-- When
            m.setInterval(callback, delay);

            //-- Then
            expect(globalObject.setInterval).toHaveBeenCalledOnce();
        });
        it('should return a unique ID', (): void => {
            //-- Given
            const callback = vi.fn();
            const delay = faker.number.int();
            const id = faker.number.int();
            globalObject.setInterval.mockReturnValueOnce(id);

            //-- When
            const r = m.setInterval(callback, delay);

            //-- Then
            expect(r).toBe(id);
        });
        it('should pass any provided arguments on', (): void => {
            //-- Given
            const callback = vi.fn();
            const delay = faker.number.int();
            const args = [faker.lorem.word(), faker.lorem.word()];

            //-- When
            m.setInterval(callback, delay, ...args);

            //-- Then
            expect(globalObject.setInterval).toHaveBeenCalledWith(
                callback,
                delay,
                ...args
            );
        });
    });
    describe('.requestAnimationFrame()', (): void => {
        const globalObject = {
            requestAnimationFrame: vi.fn()
        };
        beforeAll((): void => {
            m.setGlobalObject(globalObject as unknown as typeof globalThis);
        });
        beforeEach((): void => {
            globalObject.requestAnimationFrame.mockReset();
        });
        afterAll((): void => {
            m.resetGlobalObject();
        });
        it('should call the global `requestAnimationFrame` function', (): void => {
            //-- Given
            const callback = vi.fn();

            //-- When
            m.requestAnimationFrame(callback);

            //-- Then
            expect(globalObject.requestAnimationFrame).toHaveBeenCalledOnce();
        });
        it('should return a unique ID', (): void => {
            //-- Given
            const callback = vi.fn();
            const id = faker.number.int();
            globalObject.requestAnimationFrame.mockReturnValueOnce(id);

            //-- When
            const r = m.requestAnimationFrame(callback);

            //-- Then
            expect(r).toBe(id);
        });
    });
    describe('.clearTimeout()', (): void => {
        const globalObject = {
            clearTimeout: vi.fn()
        };
        beforeAll((): void => {
            m.setGlobalObject(globalObject as unknown as typeof globalThis);
        });
        beforeEach((): void => {
            globalObject.clearTimeout.mockReset();
        });
        afterAll((): void => {
            m.resetGlobalObject();
        });
        it('should call the global `clearTimeout` function', (): void => {
            //-- Given
            const id = faker.number.int() as m.TimeoutID;

            //-- When
            m.clearTimeout(id);

            //-- Then
            expect(globalObject.clearTimeout).toHaveBeenCalledOnce();
        });
        it('should pass on the given callback ID', (): void => {
            //-- Given
            const id = faker.number.int() as m.TimeoutID;

            //-- When
            m.clearTimeout(id);

            //-- Then
            expect(globalObject.clearTimeout).toHaveBeenCalledWith(id);
        });
    });
    describe('.clearInterval()', (): void => {
        const globalObject = {
            clearInterval: vi.fn()
        };
        beforeAll((): void => {
            m.setGlobalObject(globalObject as unknown as typeof globalThis);
        });
        beforeEach((): void => {
            globalObject.clearInterval.mockReset();
        });
        afterAll((): void => {
            m.resetGlobalObject();
        });
        it('should call the global `clearInterval` function', (): void => {
            //-- Given
            const id = faker.number.int() as m.IntervalID;

            //-- When
            m.clearInterval(id);

            //-- Then
            expect(globalObject.clearInterval).toHaveBeenCalledOnce();
        });
        it('should pass on the given callback ID', (): void => {
            //-- Given
            const id = faker.number.int() as m.IntervalID;

            //-- When
            m.clearInterval(id);

            //-- Then
            expect(globalObject.clearInterval).toHaveBeenCalledWith(id);
        });
    });
    describe('.cancelAnimationFrame()', (): void => {
        const globalObject = {
            cancelAnimationFrame: vi.fn()
        };
        beforeAll((): void => {
            m.setGlobalObject(globalObject as unknown as typeof globalThis);
        });
        beforeEach((): void => {
            globalObject.cancelAnimationFrame.mockReset();
        });
        afterAll((): void => {
            m.resetGlobalObject();
        });
        it('should call the global `cancelAnimationFrame` function', (): void => {
            //-- Given
            const id = faker.number.int() as m.AnimationFrameID;

            //-- When
            m.cancelAnimationFrame(id);

            //-- Then
            expect(globalObject.cancelAnimationFrame).toHaveBeenCalledOnce();
        });
        it('should pass on the given callback ID', (): void => {
            //-- Given
            const id = faker.number.int() as m.AnimationFrameID;

            //-- When
            m.cancelAnimationFrame(id);

            //-- Then
            expect(globalObject.cancelAnimationFrame).toHaveBeenCalledWith(id);
        });
    });
});
