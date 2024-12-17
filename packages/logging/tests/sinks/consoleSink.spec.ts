//-- NPM
import {Faker, base, en, en_CA, en_US} from '@faker-js/faker';
import {createSandbox, SinonStub} from 'sinon';
import {afterAll, afterEach, beforeAll, describe, expect, it} from 'vitest';

//-- Project Code
import {ConsoleSink} from '@src/sinks/consoleSink';

/**
 * The fake data source.
 */
const fakeData = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:logging/sinks/consoleSink', (): void => {
    const sinonSandbox = createSandbox();
    afterEach((): void => {
        sinonSandbox.reset();
    });
    beforeAll((): void => {
        let seed = fakeData.seed();
        if (FAKER_SEED) {
            const fakerSeed = parseInt(FAKER_SEED, 10);
            if (!isNaN(fakerSeed)) {
                seed = fakerSeed;
            }
        }
        fakeData.seed(seed);
    });
    describe('.ConsoleSink', (): void => {
        describe('.tryWrite', (): void => {
            let logStub: SinonStub<
                Parameters<(typeof console)['log']>,
                ReturnType<(typeof console)['log']>
            >;
            beforeAll((): void => {
                logStub = sinonSandbox.stub(console, 'log');
            });
            afterAll((): void => {
                sinonSandbox.restore();
            });
            it('should return `true`', (): void => {
                //-- Given
                const sink = new ConsoleSink();

                //-- When
                const result = sink.tryWrite({
                    timestamp: new Date(),
                    namespace: fakeData.string.alphanumeric(),
                    message: fakeData.lorem.sentence()
                });

                //-- Then
                expect(result).to.be.true;
            });
            it('should call `console.log`', (): void => {
                //-- Given
                const sink = new ConsoleSink();

                //-- When
                sink.tryWrite({
                    timestamp: new Date(),
                    namespace: fakeData.string.alphanumeric(),
                    message: fakeData.lorem.sentence()
                });

                //-- Then
                expect(logStub).to.satisfy((stub: SinonStub): boolean => {
                    return stub.calledOnce;
                });
            });
        });
    });
});
