import {mat4} from 'gl-matrix';
import {Camera} from './camera';

/**
 * A renderer for a cube.
 */
export class CubeRenderer {
    /**
     * The raw vertex data.
     */
    public static readonly VERTEX_DATA = new Float32Array([
        // Front face
        -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
        // Back face
        -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
        // Top face
        -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
        // Bottom face
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
        // Right face
        1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
        // Left face
        -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0
    ]);

    /**
     * The raw texture UV data.
     */
    public static readonly UV_DATA = new Float32Array([
        // Front face
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        // Back face
        1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,
        // Top face
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
        // Bottom face
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        // Right face
        1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,
        // Left face
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0
    ]);

    /**
     * The indexing data.
     */
    public static readonly INDEX_DATA = new Uint16Array([
        // Front face
        0, 1, 2, 0, 2, 3,
        // Back face
        4, 5, 6, 4, 6, 7,
        // Top face
        8, 9, 10, 8, 10, 11,
        // Bottom face
        12, 13, 14, 12, 14, 15,
        // Right face
        16, 17, 18, 16, 18, 19,
        // Left face
        20, 21, 22, 20, 22, 23
    ]);

    /**
     * The vertex shader source code.
     */
    public static readonly VERTEX_SHADER_SOURCE = `
        precision mediump float;
        attribute vec3 v_position;
        attribute vec2 v_uv;
        varying vec2 f_uv;
        uniform mat4 v_projection;
        uniform mat4 v_view;
        uniform mat4 v_model;
        void main() {
            f_uv = v_uv;
            mat4 mvp = v_projection * v_view * v_model;
            gl_Position = mvp * vec4(v_position, 1.0);
        }
    `;

    /**
     * The fragment shader source code.
     */
    public static readonly FRAGMENT_SHADER_SOURCE = `
        precision mediump float;
        varying vec2 f_uv;
        uniform sampler2D f_texture;
        void main() {
            gl_FragColor = texture2D(f_texture, f_uv);
        }
    `;

    /**
     * The vertex buffer object.
     */
    public readonly vbo: WebGLBuffer;

    /**
     * The index buffer object.
     */
    public readonly ibo: WebGLBuffer;

    /**
     * The shader program.
     */
    public readonly shader: WebGLProgram;

    /**
     * The texture.
     */
    public readonly texture: WebGLTexture;

    /**
     * The native rendering context.
     */
    public readonly gl: WebGLRenderingContext;

    /**
     * Create a new instance.
     *
     * @param gl - The native rendering context.
     */
    public constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
        const vbo = gl.createBuffer();
        if (vbo === null) {
            throw new Error('Failed to create vertex buffer object');
        }
        this.vbo = vbo;
        const ibo = gl.createBuffer();
        if (ibo === null) {
            gl.deleteBuffer(vbo);
            throw new Error('Failed to create index buffer object');
        }
        this.ibo = ibo;
        const shader = gl.createProgram();
        if (shader === null) {
            gl.deleteBuffer(vbo);
            gl.deleteBuffer(ibo);
            throw new Error('Failed to create shader program');
        }
        this.shader = shader;

        // Combine vertex and UV data
        const vertexData = new Float32Array(
            CubeRenderer.VERTEX_DATA.length + CubeRenderer.UV_DATA.length
        );
        for (let i = 0; i < CubeRenderer.VERTEX_DATA.length / 3; i++) {
            const fullIndex = i * 5;
            const vIndex = i * 3;
            const vertices = CubeRenderer.VERTEX_DATA.subarray(
                vIndex,
                vIndex + 3
            );
            const uvIndex = i * 2;
            const uvs = CubeRenderer.UV_DATA.subarray(uvIndex, uvIndex + 2);
            vertexData.set(vertices, fullIndex);
            vertexData.set(uvs, fullIndex + 3);
        }

        // Fill buffers
        gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, vbo);
        gl.bufferData(
            WebGLRenderingContext.ARRAY_BUFFER,
            vertexData,
            WebGLRenderingContext.STATIC_DRAW
        );

        gl.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(
            WebGLRenderingContext.ELEMENT_ARRAY_BUFFER,
            CubeRenderer.INDEX_DATA,
            WebGLRenderingContext.STATIC_DRAW
        );

        // Create shader
        const vertexShader = gl.createShader(
            WebGLRenderingContext.VERTEX_SHADER
        );
        if (vertexShader === null) {
            gl.deleteBuffer(vbo);
            gl.deleteBuffer(ibo);
            gl.deleteProgram(shader);
            throw new Error('Failed to create vertex shader');
        }
        gl.shaderSource(vertexShader, CubeRenderer.VERTEX_SHADER_SOURCE);
        gl.compileShader(vertexShader);
        if (
            !gl.getShaderParameter(
                vertexShader,
                WebGLRenderingContext.COMPILE_STATUS
            )
        ) {
            gl.deleteShader(vertexShader);
            gl.deleteBuffer(vbo);
            gl.deleteBuffer(ibo);
            gl.deleteProgram(shader);
            throw new Error('Failed to compile vertex shader');
        }
        gl.attachShader(shader, vertexShader);
        const fragmentShader = gl.createShader(
            WebGLRenderingContext.FRAGMENT_SHADER
        );
        if (fragmentShader === null) {
            gl.deleteShader(vertexShader);
            gl.deleteBuffer(vbo);
            gl.deleteBuffer(ibo);
            gl.deleteProgram(shader);
            throw new Error('Failed to create fragment shader');
        }
        gl.shaderSource(fragmentShader, CubeRenderer.FRAGMENT_SHADER_SOURCE);
        gl.compileShader(fragmentShader);
        if (
            !gl.getShaderParameter(
                fragmentShader,
                WebGLRenderingContext.COMPILE_STATUS
            )
        ) {
            gl.deleteShader(fragmentShader);
            gl.deleteShader(vertexShader);
            gl.deleteBuffer(vbo);
            gl.deleteBuffer(ibo);
            gl.deleteProgram(shader);
            throw new Error('Failed to compile fragment shader');
        }
        gl.attachShader(shader, fragmentShader);
        gl.linkProgram(shader);
        if (
            !gl.getProgramParameter(shader, WebGLRenderingContext.LINK_STATUS)
        ) {
            gl.deleteShader(fragmentShader);
            gl.deleteShader(vertexShader);
            gl.deleteBuffer(vbo);
            gl.deleteBuffer(ibo);
            gl.deleteProgram(shader);
            throw new Error('Failed to link shader program');
        }
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);

        // Generate a texture
        const texture = gl.createTexture();
        if (texture === null) {
            gl.deleteBuffer(vbo);
            gl.deleteBuffer(ibo);
            gl.deleteProgram(shader);
            throw new Error('Failed to create texture');
        }
        this.texture = texture;
        gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, texture);
        gl.texParameteri(
            WebGLRenderingContext.TEXTURE_2D,
            WebGLRenderingContext.TEXTURE_MIN_FILTER,
            WebGLRenderingContext.NEAREST
        );
        gl.texParameteri(
            WebGLRenderingContext.TEXTURE_2D,
            WebGLRenderingContext.TEXTURE_MAG_FILTER,
            WebGLRenderingContext.NEAREST
        );
        gl.texParameteri(
            WebGLRenderingContext.TEXTURE_2D,
            WebGLRenderingContext.TEXTURE_WRAP_S,
            WebGLRenderingContext.CLAMP_TO_EDGE
        );
        gl.texParameteri(
            WebGLRenderingContext.TEXTURE_2D,
            WebGLRenderingContext.TEXTURE_WRAP_T,
            WebGLRenderingContext.CLAMP_TO_EDGE
        );
        gl.texParameteri(
            WebGLRenderingContext.TEXTURE_2D,
            WebGLRenderingContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
            1
        );
        gl.texImage2D(
            WebGLRenderingContext.TEXTURE_2D,
            0,
            WebGLRenderingContext.RGBA,
            2,
            2,
            0,
            WebGLRenderingContext.RGBA,
            WebGLRenderingContext.UNSIGNED_BYTE,
            new Uint8Array([
                251, 72, 196, 255, 0, 0, 0, 255, 0, 0, 0, 255, 251, 72, 196, 255
            ])
        );
    }

    public render(camera: Camera): void {
        const gl = this.gl;
        gl.useProgram(this.shader);
        gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, this.vbo);
        gl.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, this.ibo);
        const positionLocation = gl.getAttribLocation(
            this.shader,
            'v_position'
        );
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(
            positionLocation,
            3,
            gl.FLOAT,
            false,
            5 * Float32Array.BYTES_PER_ELEMENT,
            0
        );
        const uvLocation = gl.getAttribLocation(this.shader, 'v_uv');
        gl.enableVertexAttribArray(uvLocation);
        gl.vertexAttribPointer(
            uvLocation,
            2,
            gl.FLOAT,
            false,
            5 * Float32Array.BYTES_PER_ELEMENT,
            3 * Float32Array.BYTES_PER_ELEMENT
        );
        gl.activeTexture(WebGLRenderingContext.TEXTURE0);
        gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, this.texture);
        const textureLocation = gl.getUniformLocation(this.shader, 'f_texture');
        gl.uniform1i(textureLocation, 0);
        const modelMat = mat4.create();
        const modelLocation = gl.getUniformLocation(this.shader, 'v_model');
        gl.uniformMatrix4fv(modelLocation, false, modelMat);
        const viewLocation = gl.getUniformLocation(this.shader, 'v_view');
        gl.uniformMatrix4fv(viewLocation, false, camera.viewMatrix);
        const projLocation = gl.getUniformLocation(this.shader, 'v_projection');
        gl.uniformMatrix4fv(projLocation, false, camera.projectionMatrix);
        gl.enable(WebGLRenderingContext.DEPTH_TEST);
        gl.drawElements(
            WebGLRenderingContext.TRIANGLES,
            36,
            WebGLRenderingContext.UNSIGNED_SHORT,
            0
        );
        gl.disableVertexAttribArray(positionLocation);
        gl.disableVertexAttribArray(uvLocation);
    }
}
