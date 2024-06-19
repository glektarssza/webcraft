//-- NPM Packages
import {expect} from 'chai';
import {Faker, base, en, en_CA, en_US} from '@faker-js/faker';
import {SinonSpy, reset, restore, spy} from 'sinon';

//-- Project Code
import {Optional} from '@src/lib/utils/optional';

/**
 * The fake data provider.
 */
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:lib.utils', () => {
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
    describe('.Optional', () => {
        describe('.from()', () => {
            it('should return a new instance that wraps some value if passed a value', () => {
                //-- Given
                const value = {};

                //-- When
                const r = Optional.from(value);

                //-- Then
                expect(r).to.have.property('_value').which.equals(value);
            });
            it('should return a new instance that wraps no value if passed no value', () => {
                //-- Given

                //-- When
                const r = Optional.from(null);

                //-- Then
                expect(r).to.have.property('_value').which.is.null;
            });
        });
        describe('.fromSome()', () => {
            let fromSpy: SinonSpy<
                Parameters<(typeof Optional)['from']>,
                ReturnType<(typeof Optional)['from']>
            >;
            before(() => {
                fromSpy = spy(Optional, 'from');
            });
            after(() => {
                restore();
            });
            it('should return a new instance that wraps some value', () => {
                //-- Given
                const value = {};

                //-- When
                const r = Optional.fromSome(value);

                //-- Then
                expect(r).to.have.property('_value').which.equals(value);
                expect(fromSpy).to.satisfy(() =>
                    fromSpy.calledOnceWithExactly(value)
                );
            });
        });
        describe('.fromNone()', () => {
            let fromSpy: SinonSpy<
                Parameters<(typeof Optional)['from']>,
                ReturnType<(typeof Optional)['from']>
            >;
            before(() => {
                fromSpy = spy(Optional, 'from');
            });
            after(() => {
                restore();
            });
            it('should return a new instance that wraps no value', () => {
                //-- Given

                //-- When
                const r = Optional.fromNone();

                //-- Then
                expect(r).to.have.property('_value').which.is.null;
                expect(fromSpy).to.satisfy(() =>
                    fromSpy.calledOnceWithExactly(null)
                );
            });
        });
    });
});
