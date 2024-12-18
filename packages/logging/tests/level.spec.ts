//-- NPM
import {Faker, base, en, en_CA, en_US} from '@faker-js/faker';
import {createSandbox} from 'sinon';
import {afterEach, beforeAll, describe} from 'vitest';

//-- Project Code
import {} from '@src/level';

/**
 * The fake data source.
 */
const fakeData = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:logging/level', (): void => {
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
});
