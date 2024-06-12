/**
 * The inputs to the vertex shader.
 */
struct VertexInputs {
    /**
     * The position of the vertex.
     */
    @location(0) vertexPosition: vec3<f32>,
}

/**
 * The outputs from the vertex shader.
 */
struct VertexOutputs {
    /**
     * The final position of the vertex.
     */
    @builtin(position) position: vec4<f32>,
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
    outputs.position = vec4<f32>(inputs.vertexPosition, 1.0);
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
    outputs.color = vec4<f32>(1.0);
    return outputs;
}
