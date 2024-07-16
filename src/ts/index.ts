//-- NPM Packages
import {mat4, utils as matrixUtils} from 'wgpu-matrix';

//-- Project Code
import {waitForDocument} from './utils/dom';
import {
    createBuffer,
    createBufferWithData,
    createCubeGeometry,
    createHTMLContext,
    loadShader,
    packVertexArray,
    uploadDataToBuffer
} from './webgpu';
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
    const mvpData = mat4.create();
    const mvpBuffer = createBuffer(
        context,
        mvpData.byteLength,
        GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM
    );
    const bindGroupLayout = device.createBindGroupLayout({
        entries: [
            // MVP matrix
            {
                binding: 0,
                visibility: GPUShaderStage.VERTEX,
                buffer: {
                    type: 'uniform'
                }
            }
        ]
    });
    const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: mvpBuffer.native
                }
            }
        ]
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
        depthStencil: {
            format: 'depth24plus',
            depthCompare: 'less',
            depthWriteEnabled: true
        },
        primitive: {
            topology: 'triangle-list'
        }
    });
    const geom = createCubeGeometry();
    // prettier-ignore
    const vertexData = packVertexArray(geom.vertices);
    const vertexBuffer = createBufferWithData(
        context,
        vertexData,
        GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX
    );
    // prettier-ignore
    const colorData = new Float32Array([
        255, 0,   0,
        0,   255, 0,
        0,   0,   255,
        255, 255, 0,
        255, 0,   255,
        0,   255, 255,
        255, 255, 255,
        0,   0,   0
    ].map((e) => e / 255));
    const colorBuffer = createBufferWithData(
        context,
        colorData,
        GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX
    );
    const indexBuffer = geom.indices
        ? createBufferWithData(
              context,
              new Uint16Array(geom.indices),
              GPUBufferUsage.COPY_DST | GPUBufferUsage.INDEX
          )
        : null;
    const render = (): void => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        //-- Setup matrices
        const modelMatrix = mat4.create();
        const viewMatrix = mat4.create();
        const projectionMatrix = mat4.create();

        //-- Compute model matrix
        mat4.identity(modelMatrix);

        //-- Compute view matrix
        mat4.identity(viewMatrix);
        mat4.lookAt([3, 3, 3], [0, 0, 0], [0, 1, 0], viewMatrix);

        //-- Compute projection matrix
        mat4.identity(projectionMatrix);
        mat4.perspective(
            matrixUtils.degToRad(45),
            canvas.width / canvas.height,
            0.001,
            1000,
            projectionMatrix
        );

        //-- Update MVP matrix
        mat4.identity(mvpData);
        mat4.multiply(mvpData, projectionMatrix, mvpData);
        mat4.multiply(mvpData, viewMatrix, mvpData);
        mat4.multiply(mvpData, modelMatrix, mvpData);
        uploadDataToBuffer(mvpBuffer, mvpData);

        //-- Create depth buffer texture
        const depthTexture = device.createTexture({
            format: 'depth24plus',
            size: {
                width: canvas.width,
                height: canvas.height
            },
            usage: GPUTextureUsage.RENDER_ATTACHMENT
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
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
                view: depthTexture.createView(),
                depthClearValue: 1
            }
        });
        renderPass.setPipeline(pipeline);
        renderPass.setBindGroup(0, bindGroup);
        renderPass.setViewport(0, 0, canvas.width, canvas.height, 0, 1);
        renderPass.setVertexBuffer(0, vertexBuffer.native);
        renderPass.setVertexBuffer(1, colorBuffer.native);
        if (indexBuffer && geom.indices) {
            renderPass.setIndexBuffer(indexBuffer.native, 'uint16');
            renderPass.drawIndexed(geom.indices.length);
        } else {
            renderPass.draw(geom.vertices.length);
        }
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
