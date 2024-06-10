@group(0) @binding(0) var<uniform> mvpMatrix: mat4x4<f32>;

struct VertexInputs {
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexColor: vec3<f32>,
}

struct VertexOutputs {
    @builtin(position) position: vec4<f32>,
    @location(0) color: vec4<f32>,
}

@vertex
fn vertex_main(inputs: VertexInputs) -> VertexOutputs {
    var outputs: VertexOutputs;
    outputs.position = mvpMatrix * vec4<f32>(inputs.vertexPosition, 1.0);
    outputs.color = vec4<f32>(inputs.vertexColor, 1.0);
    return outputs;
}

struct FragmentOutputs {
    @location(0) color: vec4<f32>,
}

@fragment
fn fragment_main(inputs: VertexOutputs) -> FragmentOutputs {
    var outputs: FragmentOutputs;
    outputs.color = inputs.color;
    return outputs;
}
