//-- NPM Packages
import chunk from 'lodash/chunk';
import flatten from 'lodash/flatten';
import zip from 'lodash/zip';
import {mat4, vec3} from 'wgpu-matrix';

//-- Project Code
import {getRootElement, ready} from './utils';

/**
 * The entrypoint for the application.
 */
async function main(): Promise<void> {
    await ready();
    const rootElem = getRootElement();
    //-- Setup canvas
    const canvas = document.createElement('canvas');
    rootElem.appendChild(canvas);
    canvas.classList.add('game-canvas');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    //-- Setup WebGPU
    if (!navigator.gpu) {
        throw new Error('WebGPU is not supported in this browser');
    }
    const canvasContext = canvas.getContext('webgpu');
    if (!canvasContext) {
        throw new Error('Failed to get WebGPU canvas context');
    }
    const adapter = await navigator.gpu.requestAdapter({
        powerPreference: 'high-performance'
    });
    if (!adapter) {
        throw new Error('Failed to get WebGPU adapter');
    }
    const device = await adapter.requestDevice({
        label: 'Default WebGPU high performance device',
        defaultQueue: {
            label: 'Default WebGPU device queue'
        }
    });
    if (!device) {
        throw new Error('Failed to get WebGPU device');
    }
    canvasContext.configure({
        device,
        format: navigator.gpu.getPreferredCanvasFormat(),
        alphaMode: 'premultiplied',
        colorSpace: 'srgb'
    });
    //-- Initialize WebGPU resources
    //-- Initialize cube geometry
    // prettier-ignore
    const cubeGeometry = [
        //-- Front face
        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,

        -0.5, -0.5, 0.5,
        -0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,

        //-- Back face
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, 0.5, -0.5,

        -0.5, -0.5, -0.5,
        -0.5, 0.5, -0.5,
        0.5, 0.5, -0.5,

        //-- Right face
        0.5, -0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, 0.5, 0.5,

        0.5, -0.5, -0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,

        //-- Left face
        -0.5, -0.5, -0.5,
        -0.5, 0.5, -0.5,
        -0.5, 0.5, 0.5,

        -0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,
        -0.5, 0.5, 0.5,

        //-- Top face
        -0.5, 0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, 0.5, 0.5,

        -0.5, 0.5, -0.5,
        -0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,

        //-- Bottom face
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, -0.5, 0.5,

        -0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5
    ];
    //-- Initialize cube geometry colors
    // prettier-ignore
    const cubeGeometryColors = [
        //-- Front face
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        //-- Back face
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        //-- Right face
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        //-- Left face
        0, 1, 1,
        0, 1, 1,
        0, 1, 1,

        0, 1, 1,
        0, 1, 1,
        0, 1, 1,

        //-- Top face
        1, 0, 1,
        1, 0, 1,
        1, 0, 1,

        1, 0, 1,
        1, 0, 1,
        1, 0, 1,

        //-- Bottom face
        1, 1, 0,
        1, 1, 0,
        1, 1, 0,

        1, 1, 0,
        1, 1, 0,
        1, 1, 0
    ];
    //-- Initialize cube geometry buffer
    const cubeVertexData = flatten(
        flatten(
            zip(chunk(cubeGeometry, 3), chunk(cubeGeometryColors, 3)) as [
                number[],
                number[]
            ][]
        )
    );
    const cubeGeometryArrayBuffer = new Float32Array(cubeVertexData);
    const cubeGeometryBuffer = device.createBuffer({
        label: 'Cube Geometry Buffer',
        size: cubeGeometryArrayBuffer.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(
        cubeGeometryBuffer,
        0,
        cubeGeometryArrayBuffer,
        0,
        cubeGeometryArrayBuffer.length
    );
    //-- Initialize camera buffer
    const cameraUniformArrayBuffer = new Float32Array(32);
    const cameraUniformBuffer = device.createBuffer({
        label: 'Camera Uniform Buffer',
        size: cameraUniformArrayBuffer.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    //-- Initialize model position uniform buffer
    const modelUniformArrayBuffer = new Float32Array(16);
    const modelUniformBuffer = device.createBuffer({
        label: 'Model Uniform Buffer',
        size: modelUniformArrayBuffer.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    //-- Initialize colored cube shader module
    const cubeShader = device.createShaderModule({
        label: 'Colored Cube Shader Module',
        code: `
        struct VertexOutput {
            @builtin(position) position: vec4f,
            @location(0) color: vec4f
        }

        struct Camera {
            view: mat4x4f,
            projection: mat4x4f
        }

        @group(0) @binding(0)
        var<uniform> camera: Camera;

        @group(0) @binding(1)
        var<uniform> model_matrix: mat4x4f;

        @vertex
        fn vertex_main(@location(0) vertex_position: vec3f, @location(1) vertex_color: vec3f) -> VertexOutput {
            var output: VertexOutput;
            var mvp: mat4x4f = camera.projection * camera.view * model_matrix;
            output.position = mvp * vec4f(vertex_position, 1);
            output.color = vec4f(vertex_color, 1);
            return output;
        }

        @fragment
        fn fragment_main(fragData: VertexOutput) -> @location(0) vec4f {
            return fragData.color;
        }`
    });
    //-- Initialize binding group layout
    const bindingGroupLayout = device.createBindGroupLayout({
        label: 'Colored Cube Shader Module Bind Group Layout',
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.VERTEX,
                buffer: {
                    type: 'uniform',
                    minBindingSize: 128
                }
            },
            {
                binding: 1,
                visibility: GPUShaderStage.VERTEX,
                buffer: {
                    type: 'uniform',
                    minBindingSize: 64
                }
            }
        ]
    });
    //-- Initialize render pipeline layout
    const renderPipelineLayout = device.createPipelineLayout({
        label: 'Default WebGPU render pipeline layout',
        bindGroupLayouts: [bindingGroupLayout]
    });
    //-- Initialize render pipeline
    const renderPipeline = device.createRenderPipeline({
        label: 'Default WebGPU render pipeline',
        layout: renderPipelineLayout,
        primitive: {
            topology: 'triangle-list'
        },
        vertex: {
            module: cubeShader,
            entryPoint: 'vertex_main',
            buffers: [
                {
                    attributes: [
                        {
                            format: 'float32x3',
                            offset: 0,
                            shaderLocation: 0
                        },
                        {
                            format: 'float32x3',
                            offset: 12,
                            shaderLocation: 1
                        }
                    ],
                    arrayStride: 24,
                    stepMode: 'vertex'
                }
            ]
        },
        fragment: {
            module: cubeShader,
            entryPoint: 'fragment_main',
            targets: [
                {
                    format: navigator.gpu.getPreferredCanvasFormat()
                }
            ]
        },
        depthStencil: {
            format: 'depth32float',
            depthWriteEnabled: true,
            depthCompare: 'less'
        }
    });
    //-- Initialize depth texture
    let depthTexture = device.createTexture({
        label: 'Default WebGPU Depth Texture',
        format: 'depth32float',
        usage:
            GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
        size: {
            width: canvas.width,
            height: canvas.height
        },
        dimension: '2d'
    });
    //-- Initialize frame delta trackers
    let lastFrameTimestamp = performance.now();
    let rotation = 0;
    //-- Initialize matrices
    let modelMatrix = mat4.create();
    let viewMatrix = mat4.create();
    let projectionMatrix = mat4.create();

    modelMatrix = mat4.identity(modelMatrix);
    viewMatrix = mat4.identity(viewMatrix);
    projectionMatrix = mat4.identity(projectionMatrix);
    //-- Initialize render function
    const render = () => {
        const delta = (performance.now() - lastFrameTimestamp) / 1000;
        lastFrameTimestamp = performance.now();
        rotation += (Math.PI / 2) * delta;
        if (rotation >= Math.PI * 2) {
            rotation -= Math.PI * 2;
        }
        //-- Check for viewport resize
        if (
            canvas.width !== canvas.clientWidth ||
            canvas.height !== canvas.clientHeight
        ) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            depthTexture = device.createTexture({
                label: 'Default WebGPU Depth Texture',
                format: 'depth32float',
                usage:
                    GPUTextureUsage.RENDER_ATTACHMENT |
                    GPUTextureUsage.TEXTURE_BINDING,
                size: {
                    width: canvas.width,
                    height: canvas.height
                },
                dimension: '2d'
            });
        }

        //-- Write matrix data to buffers
        modelMatrix = mat4.identity(modelMatrix);
        viewMatrix = mat4.identity(viewMatrix);
        projectionMatrix = mat4.identity(projectionMatrix);

        modelMatrix = mat4.rotateX(modelMatrix, rotation, modelMatrix);

        viewMatrix = mat4.lookAt(
            vec3.create(1, 0, 1),
            vec3.create(0, 0, 0),
            vec3.create(0, 1, 0)
        );
        projectionMatrix = mat4.perspective(
            Math.PI / 2,
            canvas.width / canvas.height,
            0.001,
            1000,
            projectionMatrix
        );
        cameraUniformArrayBuffer.set(viewMatrix, 0);
        cameraUniformArrayBuffer.set(projectionMatrix, 16);
        modelUniformArrayBuffer.set(modelMatrix);

        device.queue.writeBuffer(
            cameraUniformBuffer,
            0,
            cameraUniformArrayBuffer
        );
        device.queue.writeBuffer(
            modelUniformBuffer,
            0,
            modelUniformArrayBuffer
        );
        //-- Initialize bind group
        const bindingGroup = device.createBindGroup({
            label: 'Colored Cube Shader Module Bind Group',
            layout: bindingGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: cameraUniformBuffer,
                        offset: 0,
                        size: 128
                    }
                },
                {
                    binding: 1,
                    resource: {
                        buffer: modelUniformBuffer,
                        offset: 0,
                        size: 64
                    }
                }
            ]
        });
        //-- Initialize render pass
        const commandEncoder = device.createCommandEncoder({
            label: 'Default WebGPU Command Encoder'
        });
        const passEncoder = commandEncoder.beginRenderPass({
            label: 'Default WebGPU Render Pass Encoder',
            colorAttachments: [
                {
                    loadOp: 'clear',
                    storeOp: 'store',
                    view: canvasContext.getCurrentTexture().createView(),
                    clearValue: {
                        r: 0,
                        g: 0,
                        b: 0,
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
        //-- Prepare to render
        passEncoder.setPipeline(renderPipeline);
        passEncoder.setViewport(0, 0, canvas.width, canvas.height, 0, 1);
        passEncoder.setBindGroup(0, bindingGroup);
        passEncoder.setVertexBuffer(0, cubeGeometryBuffer);
        //-- Render
        passEncoder.draw(36);
        //-- Post-render
        passEncoder.end();
        device.queue.submit([commandEncoder.finish()]);
        requestAnimationFrame(render);
    };
    //-- Start render loop
    requestAnimationFrame(render);
}

main()
    .then(() => {
        console.log('Application started normally');
    })
    .catch((err: Error) => {
        console.error('Fatal error during startup');
        console.error(err);
        // TODO: Display in DOM
    });
