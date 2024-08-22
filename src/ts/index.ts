//-- Project Code
import {dom, webgpu} from './lib';

/**
 * The application entry point.
 */
async function main(): Promise<void> {
    await dom.waitForDocumentReady();
    const {canvas, canvasContext, device} = await webgpu.createHTMLContext();
    canvas.id = 'gameCanvas';
    canvas.classList.add('game-canvas');
    globalThis.document.body.appendChild(canvas);
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    //-- Setup bind groups
    const bindGroupLayout = device.createBindGroupLayout({
        entries: []
    });
    const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: []
    });

    //-- Setup render pipeline layout
    const pipelineLayout = device.createPipelineLayout({
        bindGroupLayouts: [bindGroupLayout]
    });

    //-- Create the shader module
    const shaderModule = device.createShaderModule({
        code: `
struct VertexInputs {
    @location(0) position: vec3<f32>,
}

struct VertexOutputs {
    @builtin(position) position: vec4<f32>,
}

@vertex
fn vertex_main(inputs: VertexInputs) -> VertexOutputs {
    var outputs: VertexOutputs;
    outputs.position = vec4<f32>(inputs.position, 1.0);
    return outputs;
}

struct FragmentOutputs {
    @location(0) color: vec4<f32>,
}

@fragment
fn fragment_main() -> FragmentOutputs {
    var outputs: FragmentOutputs;
    outputs.color = vec4<f32>(1.0);
    return outputs;
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

    //-- Create buffers
    // prettier-ignore
    const vertexData = new Float32Array([
        -1, -1, 0,
         1, -1, 0,
         0,  1, 0
    ].map((e) => e / 2));
    const vertexBuffer = device.createBuffer({
        size: vertexData.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(vertexBuffer, 0, vertexData);

    //-- Create the render pipeline
    const pipeline = await device.createRenderPipelineAsync({
        layout: pipelineLayout,
        vertex: {
            module: shaderModule,
            entryPoint: 'vertex_main',
            buffers: [
                {
                    arrayStride: 12,
                    attributes: [
                        {
                            shaderLocation: 0,
                            format: 'float32x3',
                            offset: 0
                        }
                    ],
                    stepMode: 'vertex'
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
        primitive: {
            topology: 'triangle-list'
        }
    });

    const render = (): void => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        const commandEncoder = device.createCommandEncoder();
        const renderPassEncoder = commandEncoder.beginRenderPass({
            colorAttachments: [
                {
                    loadOp: 'clear',
                    storeOp: 'store',
                    view: canvasContext.getCurrentTexture().createView(),
                    clearValue: {
                        r: 100 / 255,
                        g: 149 / 255,
                        b: 237 / 255,
                        a: 1
                    }
                }
            ]
        });
        renderPassEncoder.setPipeline(pipeline);
        renderPassEncoder.setViewport(0, 0, canvas.width, canvas.height, 0, 1);
        renderPassEncoder.setBindGroup(0, bindGroup);
        renderPassEncoder.setVertexBuffer(0, vertexBuffer);
        renderPassEncoder.draw(3);
        renderPassEncoder.end();
        device.queue.submit([commandEncoder.finish()]);
        globalThis.requestAnimationFrame(render);
    };
    globalThis.requestAnimationFrame(render);
}

main()
    .then((): void => {
        console.info('Application started normally');
    })
    .catch((err: Error): void => {
        console.error('Fatal error during startup');
        console.error(err);
    });
