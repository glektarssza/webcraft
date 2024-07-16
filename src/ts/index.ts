//-- Project Code
import {waitForDocument} from './utils/dom';
import {createBufferWithData, createHTMLContext, loadShader} from './webgpu';
import shaderUrl from '../shaders/colored.wgsl?url';

/**
 * The application entry point.
 *
 * @returns A promise that resolves once the application has started or rejects
 * if any errors occur during startup.
 */
async function main(): Promise<void> {
    await waitForDocument(globalThis.document);

    //-- Setup WebGPU
    const context = await createHTMLContext({
        adapter: {
            powerPreference: 'high-performance'
        },
        canvasContext: {
            alphaMode: 'premultiplied'
        }
    });
    const {canvas, canvasContext, device} = context;
    canvas.id = 'gameCanvas';
    canvas.classList.add('game-canvas');
    globalThis.document.body.appendChild(canvas);

    //-- Prepare WebGPU
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
    const shader = await loadShader(context, shaderUrl, {
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
    const pipeline = await device.createRenderPipelineAsync({
        layout: pipelineLayout,
        vertex: {
            module: shader.native,
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
                },
                {
                    arrayStride: 12,
                    attributes: [
                        {
                            shaderLocation: 1,
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
            module: shader.native,
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
    // prettier-ignore
    const vertexData = new Float32Array([
        -1, -1, 0,
         1, -1, 0,
         0,  1, 0
    ].map((e) => e / 2));
    const vertexBuffer = createBufferWithData(
        context,
        vertexData,
        GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX
    );
    // prettier-ignore
    const colorData = new Float32Array([
        255, 0,   0,
        0,   255, 0,
        0,   0,   255
    ].map((e) => e / 255));
    const colorBuffer = createBufferWithData(
        context,
        colorData,
        GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX
    );
    const render = (): void => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        const commandEncoder = device.createCommandEncoder();
        const renderPass = commandEncoder.beginRenderPass({
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
        renderPass.setPipeline(pipeline);
        renderPass.setBindGroup(0, bindGroup);
        renderPass.setViewport(0, 0, canvas.width, canvas.height, 0, 1);
        renderPass.setVertexBuffer(0, vertexBuffer.native);
        renderPass.setVertexBuffer(1, colorBuffer.native);
        renderPass.draw(3);
        renderPass.end();
        device.queue.submit([commandEncoder.finish()]);
        requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
}

main()
    .then((): void => {
        console.info('Application started normally');
    })
    .catch((err: Error): void => {
        console.error('Fatal error during startup!');
        console.error(err);
    });
