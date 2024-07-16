/**
 * The inputs to the vertex shader.
 */
struct VertexInputs {
    /**
     * The position of the vertex, in model space.
     */
    @location(0) position: vec3<f32>,
}

/**
 * The ouputs from the vertex shader.
 */
struct VertexOutputs {
    /**
     * The position of the vertex, in camera space.
     */
    @builtin(position) position: vec4<f32>,
}

/**
 * The MVP matrix.
 */
@group(0) @binding(0) var<uniform> mvpMatrix: mat4x4<f32>;

@vertex

/**
 * The entry point to the vertex shader.
 *
 * @param inputs - The inputs to the vertex shader.
 *
 * @returns The outputs from the vertex shader.
 */
fn vertex_main(inputs: VertexInputs) -> VertexOutputs {
    var outputs: VertexOutputs;
    outputs.position = mvpMatrix * vec4<f32>(inputs.position, 1.0);
    return outputs;
}

/**
 * The ouputs from the fragment shader.
 */
struct FragmentOutputs {
    /**
     * The color of the pixel.
     */
    @location(0) color: vec4<f32>,
}

@fragment

/**
 * The entry point to the fragment shader.
 *
 * @returns The outputs from the fragment shader.
 */
fn fragment_main() -> FragmentOutputs {
    var outputs: FragmentOutputs;
    outputs.color = vec4<f32>(1.0);
    return outputs;
}
