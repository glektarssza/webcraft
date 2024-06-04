//-- Project Code
import {utils} from '@glektarssza/webcraft-common';

/**
 * The position data for the triangle vertices.
 */
// prettier-ignore
const VERTEX_POSITION_DATA = new Float32Array([
    -0.5, -0.5, 0,
     0.5, -0.5, 0,
     0,    0.5, 0
]);

/**
 * The color data for the triangle vertices.
 */
// prettier-ignore
const VERTEX_COLOR_DATA = new Float32Array([
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
]);

/**
 * The order in which to render the triangle vertices.
 */
// prettier-ignore
const VERTEX_INDEX_DATA = new Uint32Array([
    0, 1, 2
]);

/**
 * Display an error on the page.
 *
 * @param title - The title to set the dialog with.
 * @param message - The message to set the dialog with.
 * @param error - An optional error to use for a stack trace.
 */
function displayError(title: string, message: string, error?: Error): void {
    const container = document.getElementById('error-container');
    const titleElem = document.getElementById('error-header-text');
    const messageElem = document.getElementById('error-content-text');
    const stackElem = document.getElementById('error-content-stack-text');
    if (titleElem) {
        titleElem.innerText = title;
    }
    if (messageElem) {
        messageElem.innerText = message;
    }
    if (stackElem) {
        if (error && error.stack) {
            stackElem.innerText = error.stack;
        } else {
            stackElem.classList.add('display-none');
        }
    }
    if (container) {
        container.classList.remove('display-none');
    }
}

/**
 * The program entry point.
 *
 * @returns A promise that resolves when the program has started or rejects if
 * an error occurs.
 */
async function main(): Promise<void> {
    await utils.dom.waitForDOMReady();
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    const canvasContext = canvas.getContext('webgpu');
    if (canvasContext === null) {
        throw new Error('Failed to get canvas WebGPU context');
    }
    if (!navigator.gpu) {
        throw new Error('WebGPU is not supported on this platform');
    }
    const adapter = await navigator.gpu.requestAdapter({
        powerPreference: 'high-performance'
    });
    if (!adapter) {
        throw new Error('Failed to get WebGPU adapter');
    }
    const device = await adapter.requestDevice({
        label: 'Default high performance WebGPU device',
        defaultQueue: {
            label: 'Default high performance WebGPU device queue'
        }
    });
    if (!device) {
        throw new Error('Failed to get WebGPU device');
    }
    canvasContext.configure({
        device,
        format: navigator.gpu.getPreferredCanvasFormat(),
        alphaMode: 'premultiplied'
    });

    const bindGroupLayout = device.createBindGroupLayout({
        label: 'Default WebGPU bind group layout',
        entries: []
    });
    const bindGroup = device.createBindGroup({
        label: 'Default WebGPU bind group',
        layout: bindGroupLayout,
        entries: []
    });
    const pipelineLayout = device.createPipelineLayout({
        label: 'Default WebGPU pipeline layout',
        bindGroupLayouts: [bindGroupLayout]
    });
    const shaderModule = device.createShaderModule({
        label: 'Default WebGPU shader module',
        code: `
struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(1) color: vec3<f32>
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) color: vec4<f32>
}

@vertex
fn vertex_main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    output.position = vec4<f32>(input.position, 1.0);
    output.color = vec4<f32>(input.color, 1.0);
    return output;
}

struct FragmentOutput {
    @location(0) color: vec4<f32>
}

@fragment
fn fragment_main(input: VertexOutput) -> FragmentOutput {
    var output: FragmentOutput;
    output.color = input.color;
    return output;
}
`,
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
    const pipeline = device.createRenderPipeline({
        label: 'Default WebGPU render pipeline',
        layout: pipelineLayout,
        vertex: {
            module: shaderModule,
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
            module: shaderModule,
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

    const vertexPositionBuffer = device.createBuffer({
        label: 'Default WebGPU vertex position buffer',
        size: VERTEX_POSITION_DATA.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(vertexPositionBuffer, 0, VERTEX_POSITION_DATA);
    const vertexColorBuffer = device.createBuffer({
        label: 'Default WebGPU vertex color buffer',
        size: VERTEX_COLOR_DATA.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(vertexColorBuffer, 0, VERTEX_COLOR_DATA);
    const vertexIndexBuffer = device.createBuffer({
        label: 'Default WebGPU vertex index buffer',
        size: VERTEX_INDEX_DATA.byteLength,
        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(vertexIndexBuffer, 0, VERTEX_INDEX_DATA);

    if (
        canvas.width !== canvas.clientWidth ||
        canvas.height !== canvas.clientHeight
    ) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }

    const render = (): void => {
        const commandEncoder = device.createCommandEncoder({
            label: 'Default WebGPU command encoder'
        });
        const renderPass = commandEncoder.beginRenderPass({
            label: 'Default WebGPU render pass',
            colorAttachments: [
                {
                    loadOp: 'clear',
                    storeOp: 'store',
                    view: canvasContext.getCurrentTexture().createView({
                        label: 'Default WebGPU canvas context texture view'
                    }),
                    clearValue: {
                        r: 100 / 255,
                        g: 149 / 255,
                        b: 237 / 255,
                        a: 1
                    }
                }
            ]
        });
        renderPass.setViewport(
            0,
            0,
            canvas.clientWidth,
            canvas.clientHeight,
            0,
            1
        );
        if (
            canvas.width !== canvas.clientWidth ||
            canvas.height !== canvas.clientHeight
        ) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }
        renderPass.setBindGroup(0, bindGroup);
        renderPass.setPipeline(pipeline);
        renderPass.setVertexBuffer(0, vertexPositionBuffer);
        renderPass.setVertexBuffer(1, vertexColorBuffer);
        renderPass.setIndexBuffer(vertexIndexBuffer, 'uint32');
        renderPass.drawIndexed(3);
        renderPass.end();
        device.queue.submit([commandEncoder.finish()]);
        utils.dom.requestAnimationFrame(render);
    };
    utils.dom.requestAnimationFrame(render);
}

main()
    .then((): void => {
        console.log('Application started normally');
    })
    .catch((err: Error): void => {
        displayError(
            'Fatal Error',
            'A fatal error occurred during startup!',
            err
        );
        console.error('Fatal error during startup...');
        console.error(err);
    });
