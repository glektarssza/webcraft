/**
 * The model-view-projection matrix.
 */
@group(0) @binding(0) var<uniform> mvpMatrix: mat4x4<f32>;

/**
 * The inputs to the vertex shader.
 */
struct VertexInputs {
    /**
     * The position of the vertex.
     */
    @location(0) vertexPosition: vec3<f32>,

    /**
     * The color of the vertex.
     */
    @location(1) vertexColor: vec3<f32>,
}

/**
 * The outputs from the vertex shader.
 */
struct VertexOutputs {
    /**
     * The final position of the vertex.
     */
    @builtin(position) position: vec4<f32>,

    /**
     * The final color of the vertex.
     */
    @location(0) color: vec4<f32>,
}

@vertex

/**
 * The main function of the vertex stage of the shader.
 *
 * @param inputs - The inputs to the shader stage.
 *
 * @returns The outputs from the shader stage.
 */
fn vertex_main(inputs: VertexInputs) -> VertexOutputs {
    var outputs: VertexOutputs;
    outputs.position = mvpMatrix * vec4<f32>(inputs.vertexPosition, 1.0);
    outputs.color = vec4<f32>(inputs.vertexColor, 1.0);
    return outputs;
}

/**
 * The outputs from the fragment shader.
 */
struct FragmentOutputs {
    /**
     * The color of the fragment.
     */
    @location(0) color: vec4<f32>,
}

@fragment

/**
 * The main function of the fragment stage of the shader.
 *
 * @param inputs - The inputs to the shader stage.
 *
 * @returns The outputs from the shader stage.
 */
fn fragment_main(inputs: VertexOutputs) -> FragmentOutputs {
    var outputs: FragmentOutputs;
    outputs.color = inputs.color;
    return outputs;
}
