//-- Project Code
import {createWebGPUContextWithCanvas} from './lib/webgpu/context';
import {waitForDOMReady} from './utils';

/**
 * The program entry point.
 *
 * @returns A promise that resolves once the application is started or rejects
 * if any errors occur.
 */
async function main(): Promise<void> {
    await waitForDOMReady();
    const context = await createWebGPUContextWithCanvas();
    if (context.canvas instanceof HTMLCanvasElement) {
        document.body.appendChild(context.canvas);
    }
    const {device} = context;
    // prettier-ignore
    const vertexData = new Float32Array([
        -0.5, -0.5, 0,
         0.5, -0.5, 0,
         0,    0.5, 0
    ]);
    const vertexBuffer = device.createBuffer({
        label: 'Vertex buffer',
        size: vertexData.byteLength,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX
    });
    device.queue.writeBuffer(vertexBuffer, 0, vertexData);

    // prettier-ignore
    const colorData = new Float32Array([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
    ]);
    const colorBuffer = device.createBuffer({
        label: 'Color buffer',
        size: colorData.byteLength,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX
    });
    device.queue.writeBuffer(colorBuffer, 0, colorData);

    const bindGroupLayout = device.createBindGroupLayout({
        entries: []
    });
    const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: []
    });
    const pipelineLayout = device.createPipelineLayout({
        bindGroupLayouts: [bindGroupLayout]
    });

    const shaderModule = device.createShaderModule({
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
        ],
        code: `
struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(1) color: vec3<f32>,
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) color: vec4<f32>,
}

@vertex
fn vertex_main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    output.position = vec4<f32>(input.position, 1.0);
    output.color = vec4<f32>(input.color, 1.0);
    return output;
}

struct FragmentOutput {
    @location(0) color: vec4<f32>,
}

@fragment
fn fragment_main(input: VertexOutput) -> FragmentOutput {
    var output: FragmentOutput;
    output.color = input.color;
    return output;
}
`
    });

    const pipeline = device.createRenderPipeline({
        label: 'Default WebGPU render pipeline',
        layout: pipelineLayout,
        vertex: {
            module: shaderModule,
            entryPoint: 'vertex_main',
            buffers: [
                {
                    arrayStride: 12,
                    attributes: [
                        {
                            format: 'float32x3',
                            offset: 0,
                            shaderLocation: 0
                        }
                    ]
                },
                {
                    arrayStride: 12,
                    attributes: [
                        {
                            format: 'float32x3',
                            offset: 0,
                            shaderLocation: 1
                        }
                    ]
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
    const render = (): void => {
        if (context.canvas instanceof HTMLCanvasElement) {
            context.canvas.width = context.canvas.clientWidth;
            context.canvas.height = context.canvas.clientHeight;
        }
        const canvasTextureView = context.canvasContext
            .getCurrentTexture()
            .createView();
        const commandEncoder = device.createCommandEncoder({
            label: 'Default WebGPU command encoder'
        });
        const renderPass = commandEncoder.beginRenderPass({
            label: 'Default WebGPU render pass',
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
        renderPass.setViewport(
            0,
            0,
            context.canvas.width,
            context.canvas.height,
            0,
            1
        );
        renderPass.setBindGroup(0, bindGroup);
        renderPass.setPipeline(pipeline);
        renderPass.setVertexBuffer(0, vertexBuffer);
        renderPass.setVertexBuffer(1, colorBuffer);
        renderPass.draw(3);
        renderPass.end();
        device.queue.submit([commandEncoder.finish()]);
        requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
}

main()
    .then((): void => {
        console.log('Application started normally');
    })
    .catch((err: Error): void => {
        console.error('Fatal error');
        console.error(err);
    });
