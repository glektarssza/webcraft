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
import * as m from '@src/lib/dom/events';

/**
 * The fake data provider.
 */
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

/**
 * A list of events a {@link Document} can fire for testing.
 */
const documentEvents: (keyof DocumentEventMap)[] = [
    'click',
    'dblclick',
    'keydown',
    'keyup',
    'keypress'
];

/**
 * A list of events a {@link Window} can fire for testing.
 */
const windowEvents: (keyof WindowEventMap)[] = [
    'click',
    'dblclick',
    'keydown',
    'keyup',
    'keypress'
];

describe('module:lib/dom/events', (): void => {
    beforeAll((): void => {
        if (FAKER_SEED && isFinite(parseInt(FAKER_SEED))) {
            faker.seed(parseInt(FAKER_SEED));
        }
    });
    describe('.addDocumentEventListener()', (): void => {
        const document = {
            addEventListener: vi.fn()
        };
        const overrideDocument = {
            addEventListener: vi.fn()
        };
        const globalObject = {
            document
        };
        beforeAll((): void => {
            m.setGlobalObject(globalObject as unknown as typeof globalThis);
        });
        beforeEach((): void => {
            document.addEventListener.mockReset();
            overrideDocument.addEventListener.mockReset();
        });
        afterAll((): void => {
            m.resetGlobalObject();
        });
        it('should add the given callback to the global document object by default', (): void => {
            //-- Given
            const callback = vi.fn();
            const event = faker.helpers.arrayElement(documentEvents);
            const capture = faker.datatype.boolean();

            //-- When
            m.addDocumentEventListener(event, callback, capture);

            //-- Then
            expect(document.addEventListener).toHaveBeenCalledWith(
                event,
                callback,
                capture
            );
        });
        it('should add the given callback to the given document object', (): void => {
            //-- Given
            const callback = vi.fn();
            const event = faker.helpers.arrayElement(documentEvents);
            const capture = faker.datatype.boolean();

            //-- When
            m.addDocumentEventListener(
                event,
                callback,
                capture,
                overrideDocument as unknown as Document
            );

            //-- Then
            expect(document.addEventListener).not.toHaveBeenCalled();
            expect(overrideDocument.addEventListener).toHaveBeenCalledWith(
                event,
                callback,
                capture
            );
        });
    });
    describe('.addWindowEventListener()', (): void => {
        const window = {
            addEventListener: vi.fn()
        };
        const overrideWindow = {
            addEventListener: vi.fn()
        };
        const globalObject = {
            window
        };
        beforeAll((): void => {
            m.setGlobalObject(globalObject as unknown as typeof globalThis);
        });
        beforeEach((): void => {
            window.addEventListener.mockReset();
            overrideWindow.addEventListener.mockReset();
        });
        afterAll((): void => {
            m.resetGlobalObject();
        });
        it('should add the given callback to the global window object by default', (): void => {
            //-- Given
            const callback = vi.fn();
            const event = faker.helpers.arrayElement(windowEvents);
            const capture = faker.datatype.boolean();

            //-- When
            m.addWindowEventListener(event, callback, capture);

            //-- Then
            expect(window.addEventListener).toHaveBeenCalledWith(
                event,
                callback,
                capture
            );
        });
        it('should add the given callback to the given window object', (): void => {
            //-- Given
            const callback = vi.fn();
            const event = faker.helpers.arrayElement(windowEvents);
            const capture = faker.datatype.boolean();

            //-- When
            m.addWindowEventListener(
                event,
                callback,
                capture,
                overrideWindow as unknown as Window
            );

            //-- Then
            expect(window.addEventListener).not.toHaveBeenCalled();
            expect(overrideWindow.addEventListener).toHaveBeenCalledWith(
                event,
                callback,
                capture
            );
        });
    });
    describe('.removeDocumentEventListener()', (): void => {
        const document = {
            removeEventListener: vi.fn()
        };
        const overrideDocument = {
            removeEventListener: vi.fn()
        };
        const globalObject = {
            document
        };
        beforeAll((): void => {
            m.setGlobalObject(globalObject as unknown as typeof globalThis);
        });
        beforeEach((): void => {
            document.removeEventListener.mockReset();
            overrideDocument.removeEventListener.mockReset();
        });
        afterAll((): void => {
            m.resetGlobalObject();
        });
        it('should remove the given callback from the global document object by default', (): void => {
            //-- Given
            const callback = vi.fn();
            const event = faker.helpers.arrayElement(documentEvents);
            const capture = faker.datatype.boolean();

            //-- When
            m.removeDocumentEventListener(event, callback, capture);

            //-- Then
            expect(document.removeEventListener).toHaveBeenCalledWith(
                event,
                callback,
                capture
            );
        });
        it('should remove the given callback from the given document object', (): void => {
            //-- Given
            const callback = vi.fn();
            const event = faker.helpers.arrayElement(documentEvents);
            const capture = faker.datatype.boolean();

            //-- When
            m.removeDocumentEventListener(
                event,
                callback,
                capture,
                overrideDocument as unknown as Document
            );

            //-- Then
            expect(document.removeEventListener).not.toHaveBeenCalled();
            expect(overrideDocument.removeEventListener).toHaveBeenCalledWith(
                event,
                callback,
                capture
            );
        });
    });
    describe('.removeWindowEventListener()', (): void => {
        const window = {
            removeEventListener: vi.fn()
        };
        const overrideWindow = {
            removeEventListener: vi.fn()
        };
        const globalObject = {
            window
        };
        beforeAll((): void => {
            m.setGlobalObject(globalObject as unknown as typeof globalThis);
        });
        beforeEach((): void => {
            window.removeEventListener.mockReset();
            overrideWindow.removeEventListener.mockReset();
        });
        afterAll((): void => {
            m.resetGlobalObject();
        });
        it('should remove the given callback from the global window object by default', (): void => {
            //-- Given
            const callback = vi.fn();
            const event = faker.helpers.arrayElement(windowEvents);
            const capture = faker.datatype.boolean();

            //-- When
            m.removeWindowEventListener(event, callback, capture);

            //-- Then
            expect(window.removeEventListener).toHaveBeenCalledWith(
                event,
                callback,
                capture
            );
        });
        it('should remove the given callback from the given window object', (): void => {
            //-- Given
            const callback = vi.fn();
            const event = faker.helpers.arrayElement(windowEvents);
            const capture = faker.datatype.boolean();

            //-- When
            m.removeWindowEventListener(
                event,
                callback,
                capture,
                overrideWindow as unknown as Window
            );

            //-- Then
            expect(window.removeEventListener).not.toHaveBeenCalled();
            expect(overrideWindow.removeEventListener).toHaveBeenCalledWith(
                event,
                callback,
                capture
            );
        });
    });
});
