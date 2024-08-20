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
import {
    isDocumentReady,
    resetGlobalObject,
    setGlobalObject,
    waitForDocumentReady
} from '@src/lib/dom/ready';

/**
 * The fake data provider.
 */
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:lib/dom/ready', (): void => {
    beforeAll(() => {
        if (FAKER_SEED && isFinite(parseInt(FAKER_SEED))) {
            faker.seed(parseInt(FAKER_SEED));
        }
    });
    describe('.isDocumentReady()', (): void => {
        const stubDocument = {
            readyState: ''
        };
        const globalObject = {
            document: stubDocument
        };
        beforeAll((): void => {
            setGlobalObject(globalObject as unknown as typeof globalThis);
        });
        beforeEach((): void => {
            stubDocument.readyState = '';
        });
        afterAll((): void => {
            resetGlobalObject();
        });
        it('should return `true` if the global document is ready to be manipulated', (): void => {
            //-- Given
            stubDocument.readyState = 'complete';

            //-- When
            const r = isDocumentReady();

            //-- Then
            expect(r).toBe(true);
        });
        it('should return `false` if the global document is not ready to be manipulated', (): void => {
            //-- Given
            stubDocument.readyState = 'loading';

            //-- When
            const r = isDocumentReady();

            //-- Then
            expect(r).toBe(false);
        });
    });
    describe('.waitForDocumentReady()', (): void => {
        const stubDocument = {
            readyState: '',
            addEventListener: vi.fn<Document['addEventListener']>(),
            removeEventListener: vi.fn<Document['addEventListener']>()
        };
        const globalObject = {
            document: stubDocument,
            clearTimeout: vi.fn<(typeof globalThis)['clearTimeout']>(),
            setTimeout: vi.fn<(typeof globalThis)['setTimeout']>()
        };
        beforeAll((): void => {
            setGlobalObject(globalObject as unknown as typeof globalThis);
        });
        beforeEach((): void => {
            stubDocument.readyState = '';
        });
        afterAll((): void => {
            resetGlobalObject();
        });
        it('should resolve immediately if the global document is ready to be manipulated', async (): Promise<void> => {
            //-- Given
            stubDocument.readyState = 'complete';

            //-- When
            await waitForDocumentReady();

            //-- Then
            expect(stubDocument.addEventListener).not.toHaveBeenCalled();
        });
        it('should resolve when the global document becomes ready to be manipulated', async (): Promise<void> => {
            //-- Given
            stubDocument.readyState = 'loading';
            stubDocument.addEventListener.mockImplementation(
                (_, listener): void => {
                    stubDocument.readyState = 'complete';
                    typeof listener === 'function'
                        ? listener({} as Event)
                        : listener.handleEvent({} as Event);
                }
            );

            //-- When
            await waitForDocumentReady();

            //-- Then
            expect(stubDocument.addEventListener).toHaveBeenCalled();
            expect(stubDocument.removeEventListener).toHaveBeenCalled();
        });
        it('should reject if the global document does not become ready to be manipulated within a given timeout', async (): Promise<void> => {
            //-- Given
            stubDocument.readyState = 'loading';
            globalObject.setTimeout.mockImplementation((callback, delay) =>
                globalThis.setTimeout(callback, delay)
            );
            globalObject.clearTimeout.mockImplementation((timeoutId) =>
                globalThis.clearTimeout(timeoutId)
            );
            const timeout = faker.number.int({min: 1, max: 50});
            let error: Error | null = null;

            //-- When
            try {
                await waitForDocumentReady(timeout);
            } catch (e) {
                error = e instanceof Error ? e : null;
            }

            //-- Then
            expect(error).not.toBeNull();
            expect(error?.message).toBe(
                `Document did not become ready to manipulate within ${timeout} ms`
            );
        });
        it('should clear the timeout if the global document becomes ready to be manipulated', async (): Promise<void> => {
            //-- Given
            stubDocument.readyState = 'loading';
            stubDocument.addEventListener.mockImplementation(
                (_, listener): void => {
                    stubDocument.readyState = 'complete';
                    typeof listener === 'function'
                        ? listener({} as Event)
                        : listener.handleEvent({} as Event);
                }
            );
            globalObject.setTimeout.mockImplementation((callback, delay) =>
                globalThis.setTimeout(callback, delay)
            );
            globalObject.clearTimeout.mockImplementation((timeoutId) =>
                globalThis.clearTimeout(timeoutId)
            );
            const timeout = faker.number.int({min: 1, max: 50});

            //-- When
            await waitForDocumentReady(timeout);

            //-- Then
            expect(globalObject.clearTimeout).toHaveBeenCalled();
        });
    });
});
