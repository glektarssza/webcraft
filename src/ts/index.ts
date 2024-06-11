//-- NPM Packages
import * as wgpu_matrix from 'wgpu-matrix';

//-- Project Code
import {dom, webgpu} from './lib';

//-- Assets
import defaultShaderURL from '@shaders/default-matrices.wgsl?url';

/**
 * The vertex position data.
 */
// prettier-ignore
const VERTEX_POSITION_DATA = new Float32Array([
    //-- Back Face
    0, 0, 0,
    1, 0, 0,
    1, 1, 0,

    0, 0, 0,
    0, 1, 0,
    1, 1, 0,

    //-- Front Face
    0, 0, 1,
    1, 0, 1,
    1, 1, 1,

    0, 0, 1,
    0, 1, 1,
    1, 1, 1,

    //-- Top Face
    0, 1, 0,
    0, 1, 1,
    1, 1, 1,

    0, 1, 0,
    1, 1, 0,
    1, 1, 1,

    //-- Bottom Face
    0, 0, 0,
    0, 0, 1,
    1, 0, 1,

    0, 0, 0,
    1, 0, 0,
    1, 0, 1,

    //-- Left Face
    0, 0, 0,
    0, 0, 1,
    0, 1, 1,

    0, 0, 0,
    0, 1, 0,
    0, 1, 1,

    //-- Right Face
    1, 0, 0,
    1, 0, 1,
    1, 1, 1,

    1, 0, 0,
    1, 1, 0,
    1, 1, 1
].map((value) => value - 0.5));

/**
 * The vertex color data.
 */
// prettier-ignore
const VERTEX_COLOR_DATA = new Float32Array([
    //-- Back Face
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    //-- Front Face
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    //-- Top Face
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    //-- Bottom Face
    1, 1, 0,
    1, 1, 0,
    1, 1, 0,
    1, 1, 0,
    1, 1, 0,
    1, 1, 0,

    //-- Left Face
    0, 1, 1,
    0, 1, 1,
    0, 1, 1,
    0, 1, 1,
    0, 1, 1,
    0, 1, 1,

    //-- Right Face
    1, 0, 1,
    1, 0, 1,
    1, 0, 1,
    1, 0, 1,
    1, 0, 1,
    1, 0, 1
]);

/**
 * The index rendering data.
 */
// prettier-ignore
const INDEX_DATA = new Uint32Array([
    //-- Front Face
    0, 1, 2,
    3, 4, 5,

    //-- Back Face
    6, 7, 8,
    9, 10, 11,

    //-- Top Face
    12, 13, 14,
    15, 16, 17,

    //-- Bottom Face
    18, 19, 20,
    21, 22, 23
]);

/**
 * The program entry point.
 */
async function main(): Promise<void> {
    await dom.waitForDOMReady();
    const context = await webgpu.createHTMLCanvasContext({
        adapterOptions: {
            powerPreference: 'high-performance'
        },
        deviceOptions: {
            label: 'Default high performance WebGPU device',
            defaultQueue: {
                label: 'Default high performance WebGPU device queue'
            }
        },
        canvasContextOptions: {
            alphaMode: 'premultiplied'
        }
    });
    const {device, canvas, canvasContext} = context;
    document.body.appendChild(canvas);
    const bindGroupLayout = device.createBindGroupLayout({
        label: 'Default WebGPU bind group layout',
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.VERTEX,
                buffer: {
                    type: 'uniform'
                }
            }
        ]
    });

    const mvpMatrixData = new Float32Array(16);
    const mvpMatrixBuffer = device.createBuffer({
        label: 'Default WebGPU MVP matrix',
        size: mvpMatrixData.byteLength,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM
    });

    const bindGroup = device.createBindGroup({
        label: 'Default WebGPU bind group',
        layout: bindGroupLayout,
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: mvpMatrixBuffer
                }
            }
        ]
    });
    const pipelineLayout = device.createPipelineLayout({
        label: 'Default WebGPU pipeline layout',
        bindGroupLayouts: [bindGroupLayout]
    });
    const shader = await webgpu.loadShaderModule(context, defaultShaderURL, {
        label: 'Default WebGPU shader module',
        compilationHints: [
            {
                entryPoint: 'vertex_main',
                layout: pipelineLayout
            },
            {
                entryPoint: 'fragment_main',
                layout: pipelineLayout
            }
        ]
    });
    const renderPipeline = device.createRenderPipeline({
        label: 'Default WebGPU render pipeline',
        layout: pipelineLayout,
        vertex: {
            module: shader,
            entryPoint: 'vertex_main',
            buffers: [
                {
                    attributes: [
                        {
                            format: 'float32x3',
                            offset: 0,
                            shaderLocation: 0
                        }
                    ],
                    stepMode: 'vertex',
                    arrayStride: 12
                },
                {
                    attributes: [
                        {
                            format: 'float32x3',
                            offset: 0,
                            shaderLocation: 1
                        }
                    ],
                    stepMode: 'vertex',
                    arrayStride: 12
                }
            ],
            constants: {}
        },
        fragment: {
            module: shader,
            entryPoint: 'fragment_main',
            targets: [
                {
                    format: navigator.gpu.getPreferredCanvasFormat()
                }
            ],
            constants: {}
        },
        multisample: {
            count: 1
        },
        primitive: {
            topology: 'triangle-list'
        }
    });

    const vertexBuffer = device.createBuffer({
        label: 'Default WebGPU vertex position buffer',
        size: VERTEX_POSITION_DATA.byteLength,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX
    });
    device.queue.writeBuffer(vertexBuffer, 0, VERTEX_POSITION_DATA);

    const colorBuffer = device.createBuffer({
        label: 'Default WebGPU vertex color buffer',
        size: VERTEX_COLOR_DATA.byteLength,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX
    });
    device.queue.writeBuffer(colorBuffer, 0, VERTEX_COLOR_DATA);

    const indexBuffer = device.createBuffer({
        label: 'Default WebGPU index buffer',
        size: INDEX_DATA.byteLength,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.INDEX
    });
    device.queue.writeBuffer(indexBuffer, 0, INDEX_DATA);

    const render = (): void => {
        if (
            canvas.width !== canvas.clientWidth ||
            canvas.height !== canvas.clientHeight
        ) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }

        const modelMatrix = wgpu_matrix.mat4.identity();
        const viewMatrix = wgpu_matrix.mat4.lookAt(
            [2, 2, 2],
            [0, 0, 0],
            [0, 1, 0]
        );
        const projectionMatrix = wgpu_matrix.mat4.perspective(
            wgpu_matrix.utils.degToRad(45),
            canvas.clientWidth / canvas.clientHeight,
            0.001,
            1000
        );
        const vpMatrix = wgpu_matrix.mat4.multiply(
            projectionMatrix,
            viewMatrix,
            wgpu_matrix.mat4.identity()
        );
        wgpu_matrix.mat4.multiply(vpMatrix, modelMatrix, mvpMatrixData);
        device.queue.writeBuffer(mvpMatrixBuffer, 0, mvpMatrixData);
        const canvasTextureView = canvasContext
            .getCurrentTexture()
            .createView();
        const encoder = device.createCommandEncoder();
        const renderPass = encoder.beginRenderPass({
            colorAttachments: [
                {
                    loadOp: 'clear',
                    storeOp: 'store',
                    view: canvasTextureView,
                    clearValue: {
                        r: 100 / 255,
                        g: 149 / 255,
                        b: 237 / 255,
                        a: 1
                    }
                }
            ]
        });
        renderPass.setViewport(0, 0, canvas.width, canvas.height, 0, 1);
        renderPass.setPipeline(renderPipeline);
        renderPass.setBindGroup(0, bindGroup);
        renderPass.setVertexBuffer(0, vertexBuffer);
        renderPass.setVertexBuffer(1, colorBuffer);
        renderPass.setIndexBuffer(indexBuffer, 'uint32');
        renderPass.draw(36);
        renderPass.end();
        device.queue.submit([encoder.finish()]);
        dom.requestAnimationFrame(render);
    };
    dom.requestAnimationFrame(render);
}

main()
    .then((): void => {
        console.info('Application started normally');
    })
    .catch((err: Error): void => {
        console.error('Fatal error during startup');
        console.error(err);
    });
