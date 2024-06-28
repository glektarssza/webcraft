//-- NPM Packages
import {expect} from 'chai';
import {Faker, base, en, en_CA, en_US} from '@faker-js/faker';
import {reset, restore, stub, SinonStub} from 'sinon';

//-- Project Code
import {getInternalModule} from '@src/dom';

/**
 * The module under test.
 */
const m = getInternalModule();

/**
 * The fake data provider.
 */
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:@webcraft/common.dom', (): void => {
    before(() => {
        if (FAKER_SEED && isFinite(parseInt(FAKER_SEED))) {
            faker.seed(parseInt(FAKER_SEED));
        }
    });
    afterEach(() => {
        reset();
    });
    after(() => {
        restore();
    });
    describe('.domReady()', (): void => {
        let isDOMReadyStub: SinonStub<
            Parameters<(typeof m)['isDOMReady']>,
            ReturnType<(typeof m)['isDOMReady']>
        >;
        let setTimeoutStub: SinonStub<
            Parameters<(typeof m)['setTimeout']>,
            ReturnType<(typeof m)['setTimeout']>
        >;
        let addDocumentEventListenerStub: SinonStub<
            Parameters<(typeof m)['addDocumentEventListener']>,
            ReturnType<(typeof m)['addDocumentEventListener']>
        >;
        let removeDocumentEventListenerStub: SinonStub<
            Parameters<(typeof m)['removeDocumentEventListener']>,
            ReturnType<(typeof m)['removeDocumentEventListener']>
        >;
        before((): void => {
            isDOMReadyStub = stub(m, 'isDOMReady');
            setTimeoutStub = stub(m, 'setTimeout');
            addDocumentEventListenerStub = stub(m, 'addDocumentEventListener');
            removeDocumentEventListenerStub = stub(
                m,
                'removeDocumentEventListener'
            );
        });
        after((): void => {
            isDOMReadyStub.restore();
            setTimeoutStub.restore();
            addDocumentEventListenerStub.restore();
            removeDocumentEventListenerStub.restore();
        });
        afterEach((): void => {
            isDOMReadyStub.reset();
            setTimeoutStub.reset();
            addDocumentEventListenerStub.reset();
            removeDocumentEventListenerStub.reset();
        });
        it('should resolve immediately if the DOM is already ready', async (): Promise<void> => {
            //-- Given
            isDOMReadyStub.returns(true);

            //-- When
            await m.domReady();

            //-- Then
            expect(addDocumentEventListenerStub).to.satisfy(
                (stub: SinonStub) => stub.notCalled
            );
        });
    });
});
