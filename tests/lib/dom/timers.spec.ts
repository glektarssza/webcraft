//-- NPM Packages
import {expect} from 'chai';
import {Faker, base, en, en_CA, en_US} from '@faker-js/faker';
import {SinonSpy, reset, restore, spy} from 'sinon';

//-- Project Code
import {getInternalModule} from '@src/lib/dom/timers';

/**
 * The internal module under test.
 */
const m = getInternalModule();

/**
 * The fake data provider.
 */
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:lib.dom.timers', (): void => {
    before(() => {
        const possibleSeed = process.env.FAKER_SEED;
        if (possibleSeed && isFinite(parseInt(possibleSeed))) {
            faker.seed(parseInt(possibleSeed));
        }
    });
    afterEach(() => {
        reset();
    });
    after(() => {
        restore();
    });
    describe('.setTimeout()', (): void => {
        it('should call the callback after the set delay', async (): Promise<void> => {
            //-- Given
            const delay = faker.number.int({
                min: 100,
                max: 250
            });
            const callback = spy();

            //-- When
            m.setTimeout(callback, delay);

            await new Promise<void>((resolve): void => {
                globalThis.setTimeout(resolve, delay + 1);
            });

            //-- Then
            expect(callback).to.satisfy((spy: SinonSpy): boolean => {
                return spy.calledOnce;
            });
        });
        it('should call the callback with the given arguments', async (): Promise<void> => {
            //-- Given
            const delay = faker.number.int({
                min: 100,
                max: 250
            });
            const callback = spy();
            const args = faker.helpers.multiple(
                (): string => faker.lorem.word(),
                {
                    count: {
                        min: 3,
                        max: 5
                    }
                }
            );

            //-- When
            m.setTimeout(callback, delay, ...args);

            await new Promise<void>((resolve): void => {
                globalThis.setTimeout(resolve, delay + 1);
            });

            //-- Then
            expect(callback).to.satisfy((spy: SinonSpy): boolean => {
                return spy.calledOnceWithExactly(...args);
            });
        });
    });
    describe('.clearTimeout()', (): void => {
        it('should prevent the callback from being triggered', async (): Promise<void> => {
            //-- Given
            const delay = faker.number.int({
                min: 100,
                max: 250
            });
            const callback = spy();
            const id = m.setTimeout(callback, delay);

            //-- When
            m.clearTimeout(id);

            await new Promise<void>((resolve): void => {
                globalThis.setTimeout(resolve, delay + 1);
            });

            //-- Then
            expect(callback).not.to.satisfy((spy: SinonSpy): boolean => {
                return spy.called;
            });
        });
    });
    describe('.setInterval()', (): void => {
        it('should call the callback after the set delay', async (): Promise<void> => {
            //-- Given
            const delay = faker.number.int({
                min: 100,
                max: 250
            });
            const callback = spy();

            //-- When
            m.setInterval(callback, delay);

            await new Promise<void>((resolve): void => {
                globalThis.setTimeout(resolve, delay + 1);
            });

            //-- Then
            expect(callback).to.satisfy((spy: SinonSpy): boolean => {
                return spy.calledOnce;
            });
        });
        it('should call the callback once for each delay interval', async (): Promise<void> => {
            //-- Given
            const delay = faker.number.int({
                min: 100,
                max: 250
            });
            const callback = spy();

            //-- When
            m.setInterval(callback, delay);

            await new Promise<void>((resolve): void => {
                globalThis.setTimeout(resolve, delay * 2 + 1);
            });

            //-- Then
            expect(callback).to.satisfy((spy: SinonSpy): boolean => {
                return spy.calledTwice;
            });
        });
        it('should call the callback with the given arguments', async (): Promise<void> => {
            //-- Given
            const delay = faker.number.int({
                min: 100,
                max: 250
            });
            const callback = spy();
            const args = faker.helpers.multiple(
                (): string => faker.lorem.word(),
                {
                    count: {
                        min: 3,
                        max: 5
                    }
                }
            );

            //-- When
            m.setInterval(callback, delay, ...args);

            await new Promise<void>((resolve): void => {
                globalThis.setTimeout(resolve, delay + 1);
            });

            //-- Then
            expect(callback).to.satisfy((spy: SinonSpy): boolean => {
                return spy.calledOnceWithExactly(...args);
            });
        });
    });
    describe('.clearInterval()', (): void => {
        it('should prevent the callback from being triggered', async (): Promise<void> => {
            //-- Given
            const delay = faker.number.int({
                min: 100,
                max: 250
            });
            const callback = spy();
            const id = m.setInterval(callback, delay);

            //-- When
            m.clearInterval(id);

            await new Promise<void>((resolve): void => {
                globalThis.setTimeout(resolve, delay + 1);
            });

            //-- Then
            expect(callback).not.to.satisfy((spy: SinonSpy): boolean => {
                return spy.called;
            });
        });
    });
    describe('.requestAnimationFrame()', (): void => {
        it('should call the callback when the next animation frame is ready', async (): Promise<void> => {
            //-- Given
            const callback = spy();

            //-- When
            m.requestAnimationFrame(callback);

            await new Promise<void>((resolve): void => {
                globalThis.requestAnimationFrame((): void => resolve());
            });

            //-- Then
            expect(callback).to.satisfy((spy: SinonSpy): boolean => {
                return spy.calledOnce;
            });
        });
    });
    describe('.cancelAnimationFrame()', (): void => {
        it('should prevent the callback from being triggered', async (): Promise<void> => {
            //-- Given
            const callback = spy();
            const id = m.requestAnimationFrame(callback);

            //-- When
            m.cancelAnimationFrame(id);

            await new Promise<void>((resolve): void => {
                globalThis.setTimeout(resolve, 120);
            });

            //-- Then
            expect(callback).not.to.satisfy((spy: SinonSpy): boolean => {
                return spy.called;
            });
        });
    });
});
