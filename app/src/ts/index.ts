/// <reference types="@webgpu/types" />

//-- Project Code
import {domReady} from '@webcraft/common';
import {createBuffer, createHTMLContext, uploadData} from '@webcraft/webgpu';

/**
 * Create DOM to represent an error.
 *
 * @param titleText - The text to display as the title.
 * @param bodyText - The text to display as the body.
 * @param error - The error to use as a source for a stack trace.
 *
 * @returns A DOM which can be used to display an error.
 */
function createErrorDOM(
    titleText: string,
    bodyText: string,
    error?: Error
): HTMLDivElement {
    const r = document.createElement('div');
    r.classList.add('error-container');
    const dialog = document.createElement('div');
    dialog.classList.add('error-dialog');
    r.appendChild(dialog);
    const title = document.createElement('h1');
    title.classList.add('error-title');
    title.innerText = titleText;
    dialog.appendChild(title);
    const body = document.createElement('p');
    body.classList.add('error-body');
    body.innerText = bodyText;
    dialog.appendChild(body);
    const details = document.createElement('div');
    details.classList.add('error-details');
    dialog.appendChild(details);
    const stack = document.createElement('code');
    if (error?.stack !== undefined) {
        stack.innerHTML = `<p>${error.stack.replaceAll('\n', '<br/>').replaceAll(' ', '&nbsp;')}</p>`;
    } else {
        details.classList.add('display-none');
    }
    details.appendChild(stack);
    return r;
}

/**
 * The program entry point.
 *
 * @returns A promise that resolves once the program has started or rejects if
 * a fatal error occurs during startup.
 */
async function main(): Promise<void> {
    await domReady();
    const context = await createHTMLContext({
        adapter: {
            powerPreference: 'high-performance'
        },
        canvasContext: {
            alphaMode: 'premultiplied'
        }
    });
    const {device, canvas, canvasContext} = context;
    document.body.appendChild(canvas);
    const bindGroupLayout = device.createBindGroupLayout({
        entries: []
    });
    const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: []
    });
    const vertexBuffer = createBuffer(
        context,
        12 * 3,
        GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX
    );
    // prettier-ignore
    uploadData(vertexBuffer, new Float32Array([
        -0.5, -0.5, 0,
         0.5, -0.5, 0,
         0,    0.5, 0
    ]));
    const pipelineLayout = device.createPipelineLayout({
        bindGroupLayouts: [bindGroupLayout]
    });
    const shaderModule = device.createShaderModule({
        code: `
struct VertexInputs {
    @location(0) position: vec3<f32>
}

struct VertexOutput {
    @builtin(position) position: vec4<f32>
}

@vertex
fn vertex_main(inputs: VertexInputs) -> VertexOutput {
    var output: VertexOutput;
    output.position = vec4<f32>(inputs.position, 1.0);
    return output;
}

struct FragmentOutput {
    @location(0) color: vec4<f32>
}

@fragment
fn fragment_main(inputs: VertexOutput) -> FragmentOutput {
    var output: FragmentOutput;
    output.color = vec4<f32>(1.0);
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
    const renderPipeline = await device.createRenderPipelineAsync({
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
        depthStencil: {
            format: 'depth32float',
            depthCompare: 'less',
            depthWriteEnabled: true
        },
        primitive: {
            topology: 'triangle-list'
        }
    });
    const render = (): void => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        const depthTexture = device.createTexture({
            format: 'depth32float',
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
            size: {
                width: canvas.width,
                height: canvas.height
            }
        });
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
            ],
            depthStencilAttachment: {
                view: depthTexture.createView(),
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
                depthClearValue: 1
            }
        });
        renderPass.setViewport(0, 0, canvas.width, canvas.height, 0, 1);
        renderPass.setPipeline(renderPipeline);
        renderPass.setBindGroup(0, bindGroup);
        renderPass.setVertexBuffer(0, vertexBuffer.native);
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
        console.error('Fatal error during startup');
        console.error(err);
        const elem = createErrorDOM(
            'Fatal Error',
            'A fatal error occurred during startup!',
            err
        );
        document.body.appendChild(elem);
    });
