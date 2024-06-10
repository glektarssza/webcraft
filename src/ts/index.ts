//-- Project Code
import {requestAnimationFrame, waitForDOMLoaded} from './dom';
import {createHTMLCanvasContext, loadShader} from './webgpu';

//-- Assets
import defaultShaderURL from '@shaders/default.wgsl?url';

/**
 * The program entry point.
 */
async function main(): Promise<void> {
    await waitForDOMLoaded();
    const context = await createHTMLCanvasContext({
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
    const shader = await loadShader(context, defaultShaderURL, {
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
    const render = (): void => {
        if (
            canvas.width !== canvas.clientWidth ||
            canvas.height !== canvas.clientHeight
        ) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }
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
        renderPass.setPipeline(renderPipeline);
        renderPass.setBindGroup(0, bindGroup);
        renderPass.end();
        device.queue.submit([encoder.finish()]);
        requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
}

main()
    .then((): void => {
        console.info('Application started normally');
    })
    .catch((err: Error): void => {
        console.error('Fatal error during startup');
        console.error(err);
    });
