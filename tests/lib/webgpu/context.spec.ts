//-- NPM Packages
import {
    afterEach,
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
    createContext,
    createHTMLContext,
    createOffscreenContext,
    resetGlobalObject,
    setGlobalObject
} from '@src/lib/webgpu/context';

/**
 * The fake data provider.
 */
const faker = new Faker({
    locale: [en_CA, en_US, en, base]
});

describe('module:lib/webgpu/context', (): void => {
    beforeAll(() => {
        if (FAKER_SEED && isFinite(parseInt(FAKER_SEED))) {
            faker.seed(parseInt(FAKER_SEED));
        }
    });
    describe('.createContext', (): void => {
        const stubCanvas = {
            getContext: vi.fn()
        };
        const stubCanvasContext = {
            configure: vi.fn()
        };
        const stubGPU = {
            getPreferredCanvasFormat: vi.fn(),
            requestAdapter: vi.fn()
        };
        const stubAdapter = {
            requestDevice: vi.fn()
        };
        const stubNavigator = {
            gpu: stubGPU
        };
        const globalObject = {
            navigator: stubNavigator
        };
        beforeEach((): void => {
            setGlobalObject(globalObject as unknown as typeof globalThis);
            stubCanvas.getContext.mockReset();
            stubCanvasContext.configure.mockReset();
            stubGPU.getPreferredCanvasFormat.mockReset();
            stubGPU.requestAdapter.mockReset();
            stubAdapter.requestDevice.mockReset();
        });
        afterEach((): void => {
            resetGlobalObject();
        });
        it('should create a new WebGPU rendering context', async (): Promise<void> => {
            //-- Given
            const stubDevice = {};
            stubNavigator.gpu.getPreferredCanvasFormat.mockReturnValue(
                'rgba8unorm'
            );
            stubGPU.requestAdapter.mockResolvedValue(stubAdapter);
            stubAdapter.requestDevice.mockResolvedValue(stubDevice);
            stubCanvas.getContext.mockReturnValue(stubCanvasContext);

            //-- When
            const context = await createContext(
                stubCanvas as unknown as HTMLCanvasElement,
                {
                    adapter: {
                        powerPreference: 'high-performance'
                    },
                    device: {
                        requiredFeatures: ['timestamp-query']
                    },
                    canvasContext: {
                        alphaMode: 'premultiplied'
                    }
                }
            );

            //-- Then
            expect(context).toEqual({
                adapter: stubAdapter,
                device: stubDevice,
                canvas: stubCanvas,
                canvasContext: stubCanvasContext
            });
            expect(stubGPU.requestAdapter).toHaveBeenCalledWith({
                powerPreference: 'high-performance'
            });
            expect(stubAdapter.requestDevice).toHaveBeenCalledWith({
                requiredFeatures: ['timestamp-query']
            });
            expect(stubCanvas.getContext).toHaveBeenCalledWith('webgpu');
            expect(stubCanvasContext.configure).toHaveBeenCalledWith({
                format: 'rgba8unorm',
                alphaMode: 'premultiplied',
                device: stubDevice
            });
        });
        it('should throw an error if WebGPU is not supported by the platform', async (): Promise<void> => {
            //-- Given
            const secondaryStubNavigator = {
                gpu: undefined
            };
            const secondaryGlobalObject = {
                navigator: secondaryStubNavigator
            };
            setGlobalObject(
                secondaryGlobalObject as unknown as typeof globalThis
            );
            let error: Error | null = null;

            //-- When
            try {
                await createContext(stubCanvas as unknown as HTMLCanvasElement);
            } catch (err) {
                error = err instanceof Error ? err : null;
            }

            //-- Then
            expect(error).not.toBeNull();
            expect(error?.message).toBe(
                'WebGPU is not supported on this platform'
            );
        });
        it('should throw an error if the WebGPU adapter could not be fetched', async (): Promise<void> => {
            //-- Given
            stubGPU.requestAdapter.mockResolvedValue(null);
            let error: Error | null = null;

            //-- When
            try {
                await createContext(stubCanvas as unknown as HTMLCanvasElement);
            } catch (err) {
                error = err instanceof Error ? err : null;
            }

            //-- Then
            expect(error).not.toBeNull();
            expect(error?.message).toBe('Failed to fetch WebGPU adapter');
        });
        it('should throw an error if the WebGPU device could not be fetched', async (): Promise<void> => {
            //-- Given
            stubGPU.requestAdapter.mockResolvedValue(stubAdapter);
            stubAdapter.requestDevice.mockResolvedValue(null);
            let error: Error | null = null;

            //-- When
            try {
                await createContext(stubCanvas as unknown as HTMLCanvasElement);
            } catch (err) {
                error = err instanceof Error ? err : null;
            }

            //-- Then
            expect(error).not.toBeNull();
            expect(error?.message).toBe('Failed to fetch WebGPU device');
        });
        it('should throw an error if the WebGPU canvas context could not be fetched', async (): Promise<void> => {
            //-- Given
            stubGPU.requestAdapter.mockResolvedValue(stubAdapter);
            stubAdapter.requestDevice.mockResolvedValue({});
            stubCanvas.getContext.mockReturnValue(null);
            let error: Error | null = null;

            //-- When
            try {
                await createContext(stubCanvas as unknown as HTMLCanvasElement);
            } catch (err) {
                error = err instanceof Error ? err : null;
            }

            //-- Then
            expect(error).not.toBeNull();
            expect(error?.message).toBe(
                'Failed to fetch WebGPU canvas context'
            );
        });
    });
    describe('.createHTMLContext()', (): void => {
        const stubCanvas = {
            getContext: vi.fn()
        };
        const stubDocument = {
            createElement: vi.fn()
        };
        const stubCanvasContext = {
            configure: vi.fn()
        };
        const stubGPU = {
            getPreferredCanvasFormat: vi.fn(),
            requestAdapter: vi.fn()
        };
        const stubAdapter = {
            requestDevice: vi.fn()
        };
        const stubNavigator = {
            gpu: stubGPU
        };
        const globalObject = {
            navigator: stubNavigator,
            document: stubDocument
        };
        beforeEach((): void => {
            setGlobalObject(globalObject as unknown as typeof globalThis);
            stubCanvas.getContext.mockReset();
            stubDocument.createElement.mockReset();
            stubCanvasContext.configure.mockReset();
            stubGPU.getPreferredCanvasFormat.mockReset();
            stubGPU.requestAdapter.mockReset();
            stubAdapter.requestDevice.mockReset();
        });
        afterEach((): void => {
            resetGlobalObject();
        });
        it('should create a new WebGPU rendering context that renders to a HTML canvas', async (): Promise<void> => {
            //-- Given
            stubDocument.createElement.mockReturnValue(stubCanvas);
            const stubDevice = {};
            stubNavigator.gpu.getPreferredCanvasFormat.mockReturnValue(
                'rgba8unorm'
            );
            stubGPU.requestAdapter.mockResolvedValue(stubAdapter);
            stubAdapter.requestDevice.mockResolvedValue(stubDevice);
            stubCanvas.getContext.mockReturnValue(stubCanvasContext);

            //-- When
            const r = await createHTMLContext();

            //-- Then
            expect(r.canvas).toEqual(stubCanvas);
        });
    });
    describe('.createOffscreenContext()', (): void => {
        const stubCanvasContext = {
            configure: vi.fn()
        };
        class StubOffscreenCanvas {
            public width: number;

            public height: number;

            public constructor(width: number, height: number) {
                this.width = width;
                this.height = height;
            }

            public getContext() {
                return stubCanvasContext;
            }
        }
        const stubDocument = {
            createElement: vi.fn()
        };
        const stubGPU = {
            getPreferredCanvasFormat: vi.fn(),
            requestAdapter: vi.fn()
        };
        const stubAdapter = {
            requestDevice: vi.fn()
        };
        const stubNavigator = {
            gpu: stubGPU
        };
        const globalObject = {
            navigator: stubNavigator,
            OffscreenCanvas: StubOffscreenCanvas
        };
        beforeEach((): void => {
            setGlobalObject(globalObject as unknown as typeof globalThis);
            stubDocument.createElement.mockReset();
            stubCanvasContext.configure.mockReset();
            stubGPU.getPreferredCanvasFormat.mockReset();
            stubGPU.requestAdapter.mockReset();
            stubAdapter.requestDevice.mockReset();
        });
        afterEach((): void => {
            resetGlobalObject();
        });
        it('should create a new WebGPU rendering context that renders to an offscreen canvas', async (): Promise<void> => {
            //-- Given
            const width = faker.number.int({min: 1, max: 1280});
            const height = faker.number.int({min: 1, max: 720});
            const stubDevice = {};
            stubNavigator.gpu.getPreferredCanvasFormat.mockReturnValue(
                'rgba8unorm'
            );
            stubGPU.requestAdapter.mockResolvedValue(stubAdapter);
            stubAdapter.requestDevice.mockResolvedValue(stubDevice);

            //-- When
            const r = await createOffscreenContext(width, height);

            //-- Then
            expect(r.canvas).toBeInstanceOf(StubOffscreenCanvas);
        });
    });
});
