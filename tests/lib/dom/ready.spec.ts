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
import * as m from '@src/lib/dom/ready';

/**
 * The fake data provider.
 */
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:lib/dom/ready', (): void => {
    beforeAll((): void => {
        if (FAKER_SEED && isFinite(parseInt(FAKER_SEED))) {
            faker.seed(parseInt(FAKER_SEED));
        }
    });
    describe('.isReady()', (): void => {
        const document = {
            readyState: ''
        };
        const globalObject = {
            document
        };
        beforeAll((): void => {
            m.setGlobalObject(globalObject as unknown as typeof globalThis);
        });
        beforeEach((): void => {
            document.readyState = '';
        });
        afterAll((): void => {
            m.resetGlobalObject();
        });
        it('should return `true` if the DOM is ready to be manipulated', (): void => {
            //-- Given
            document.readyState = 'complete';

            //-- When
            const r = m.isReady();

            //-- Then
            expect(r).toBe(true);
        });
        it('should return `false` if the DOM is not ready to be manipulated', (): void => {
            //-- Given
            document.readyState = 'loading';

            //-- When
            let r = m.isReady();

            //-- Then
            expect(r).toBe(false);

            //-- Given
            document.readyState = 'interactive';

            //-- When
            r = m.isReady();

            //-- Then
            expect(r).toBe(false);
        });
    });
    describe('.awaitReady()', (): void => {
        const document = {
            readyState: '',
            addEventListener: vi.fn<Document['addEventListener']>(),
            removeEventListener: vi.fn<Document['removeEventListener']>()
        };
        const globalObject = {
            document,
            setTimeout: vi.fn<(typeof globalThis)['setTimeout']>(),
            clearTimeout: vi.fn<(typeof globalThis)['clearTimeout']>(),
            isFinite: vi.fn<(typeof globalThis)['isFinite']>()
        };
        beforeAll((): void => {
            m.setGlobalObject(globalObject as unknown as typeof globalThis);
        });
        beforeEach((): void => {
            document.readyState = '';
            document.addEventListener.mockReset();
            document.removeEventListener.mockReset();
            globalObject.setTimeout.mockReset();
            globalObject.clearTimeout.mockReset();
            globalObject.isFinite.mockReset();
        });
        afterAll((): void => {
            m.resetGlobalObject();
        });
        it('should resolve immediately if the DOM is already ready', async (): Promise<void> => {
            //-- Given
            document.readyState = 'complete';

            //-- When
            await m.awaitReady();

            //-- Then
            expect(document.addEventListener).not.toHaveBeenCalled();
        });
        it('should resolve when the DOM becomes ready', async (): Promise<void> => {
            //-- Given
            document.readyState = 'loading';
            globalObject.isFinite.mockImplementation(globalThis.isFinite);
            globalObject.setTimeout.mockImplementation(globalThis.setTimeout);
            globalObject.clearTimeout.mockImplementation(
                globalThis.clearTimeout
            );
            globalObject.document.addEventListener.mockImplementation(
                (_, listener): void => {
                    document.readyState = 'complete';
                    if (typeof listener === 'function') {
                        listener({} as Event);
                    } else {
                        listener.handleEvent({} as Event);
                    }
                }
            );

            //-- When
            await m.awaitReady();

            //-- Then
            expect(document.addEventListener).toHaveBeenCalled();
            expect(document.removeEventListener).toHaveBeenCalled();
        });
        it('should reject if the DOM does not become ready within the timeout', async (): Promise<void> => {
            //-- Given
            document.readyState = 'loading';
            globalObject.isFinite.mockImplementation((n): boolean => {
                return globalThis.isFinite(n);
            });
            globalObject.setTimeout.mockImplementation(
                (fn, timeout): NodeJS.Timeout => {
                    return globalThis.setTimeout(fn, timeout);
                }
            );
            const timeout = faker.number.int({
                min: 5,
                max: 50
            });
            let err: Error | null = null;

            //-- When
            try {
                await m.awaitReady(timeout);
            } catch (e) {
                if (e instanceof Error) {
                    err = e;
                }
            }

            //-- Then
            expect(err).not.toBeNull();
            expect(err).toBeInstanceOf(Error);
            expect(err!.message).toBe(
                `The DOM did not become ready within ${timeout} milliseconds`
            );
            expect(document.addEventListener).toHaveBeenCalled();
            expect(document.removeEventListener).toHaveBeenCalled();
        });
        it('should clear a timeout if the DOM becomes ready within the timeout', async (): Promise<void> => {
            //-- Given
            document.readyState = 'loading';
            globalObject.isFinite.mockImplementation((n): boolean => {
                return globalThis.isFinite(n);
            });
            globalObject.setTimeout.mockImplementation(
                (fn, timeout): NodeJS.Timeout => {
                    return globalThis.setTimeout(fn, timeout);
                }
            );
            globalObject.clearTimeout.mockImplementation((id): void => {
                globalThis.clearTimeout(id);
            });
            globalObject.document.addEventListener.mockImplementation(
                (_, listener): void => {
                    document.readyState = 'complete';
                    if (typeof listener === 'function') {
                        listener({} as Event);
                    } else {
                        listener.handleEvent({} as Event);
                    }
                }
            );
            const timeout = faker.number.int({
                min: 5,
                max: 50
            });

            //-- When
            await m.awaitReady(timeout);

            //-- Then
            expect(document.addEventListener).toHaveBeenCalled();
            expect(document.removeEventListener).toHaveBeenCalled();
            expect(globalObject.clearTimeout).toHaveBeenCalled();
        });
    });
});
