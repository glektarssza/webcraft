import {CubeRenderer} from './cubeRenderer';

/**
 * The main game class.
 */
export class Game {
    /**
     * Whether the game has been initialized.
     */
    private _initialized: boolean;

    /**
     * Whether the game is running.
     */
    private _running: boolean;

    /**
     * The ID of the last call to {@link requestAnimationFrame}.
     */
    private _frameRequestID: number | null;

    /**
     * The timestamp at which the last frame was finished.
     */
    private _lastFrameTimestamp: number | null;

    /**
     * The WebGL rendering context.
     */
    public readonly gl: WebGLRenderingContext;

    /**
     * The cube renderer.
     */
    public readonly cubeRenderer: CubeRenderer;

    /**
     * Whether the game has been initialized.
     */
    public get isInitialized(): boolean {
        return this._initialized;
    }

    /**
     * Whether the game is running.
     */
    public get isRunning(): boolean {
        return this._running;
    }

    /**
     * Create a new instance.
     *
     * @param canvas - The HTML canvas element to use for rendering.
     *
     * @throws {@link Error} - Thrown if the WebGL rendering context could not
     * be created.
     */
    public constructor(canvas: HTMLCanvasElement) {
        const gl = canvas.getContext('webgl', {
            alpha: true,
            antialias: true,
            depth: true,
            desynchronized: false,
            failIfMajorPerformanceCaveat: false,
            powerPreference: 'default',
            premultipliedAlpha: true,
            preserveDrawingBuffer: false,
            stencil: false
        });
        if (gl === null) {
            throw new Error('Could not create WebGL rendering context');
        }
        this._initialized = false;
        this._running = false;
        this._frameRequestID = null;
        this._lastFrameTimestamp = null;
        this.gl = gl;
        this.cubeRenderer = new CubeRenderer(this.gl);
    }

    /**
     * Initialize the game.
     */
    public init(): void {
        if (this._initialized) {
            return;
        }
        // TODO
        this._initialized = true;
    }

    /**
     * Tear down the game.
     */
    public terminate(): void {
        this._initialized = false;
        // TODO
    }

    /**
     * Start the game running.
     *
     * @throws {@link Error} - Thrown if the game is not initialized.
     */
    public start(): void {
        if (!this._initialized) {
            throw new Error('Game is not initialized');
        }
        this._running = true;
        if (this._frameRequestID === null) {
            this._frameRequestID = requestAnimationFrame(this._gameLoop);
            this._lastFrameTimestamp = performance.now();
        }
    }

    /**
     * Stop the game from running.
     */
    public stop(): void {
        if (!this._initialized) {
            return;
        }
        this._running = false;
        if (this._frameRequestID !== null) {
            cancelAnimationFrame(this._frameRequestID);
            this._frameRequestID = null;
            this._lastFrameTimestamp = null;
        }
    }

    /**
     * Advance the game by one frame.
     *
     * @param delta - The time since the last frame, in milliseconds.
     */
    public advanceFrame(delta?: number): void {
        if (!this._initialized) {
            throw new Error('Game is not initialized');
        }
        const frameDelta =
            performance.now() - (this._lastFrameTimestamp ?? performance.now());
        this._doFrame(delta ?? frameDelta);
    }

    /**
     * Update the game.
     *
     * @param delta - The time since the last frame, in milliseconds.
     */
    private _update(delta: number): void {
        // TODO
    }

    /**
     * Render the game.
     */
    private _render(): void {
        const canvas = this.gl.canvas;
        if (canvas instanceof HTMLCanvasElement) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }
        this.gl.viewport(
            0,
            0,
            this.gl.drawingBufferWidth,
            this.gl.drawingBufferHeight
        );
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clearDepth(1);
        this.gl.clear(
            WebGLRenderingContext.COLOR_BUFFER_BIT |
                WebGLRenderingContext.DEPTH_BUFFER_BIT
        );
        this.cubeRenderer.render();
    }

    private readonly _gameLoop = (): void => {
        this._frameRequestID = null;
        const delta =
            performance.now() - (this._lastFrameTimestamp ?? performance.now());
        try {
            this._doFrame(delta);
        } catch (err) {
            // TODO
            return;
        }
        if (this._running && this._frameRequestID === null) {
            this._frameRequestID = requestAnimationFrame(this._gameLoop);
            this._lastFrameTimestamp = performance.now();
        }
    };

    /**
     * Perform an iteration of the game loop.
     *
     * @throws {@link Error} - Thrown if the game is not initialized.
     */
    private _doFrame(delta: number): void {
        if (!this._initialized) {
            throw new Error('Game is not initialized');
        }
        this._update(delta);
        this._render();
    }
}
