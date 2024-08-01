struct VertexInputs {
    @location(0) position: vec3<f32>,
}

struct VertexOutputs {
    @builtin(position) position: vec4<f32>,
}

@vertex
fn vertex_main(inputs: VertexInputs) -> VertexOutputs {
    var output: VertexOutputs;
    output.position = vec4<f32>(inputs.position, 1.0);
    return output;
}

struct FragmentOutputs {
    @location(0) color: vec4<f32>,
}

@fragment
fn fragment_main() -> FragmentOutputs {
    var output: FragmentOutputs;
    output.color = vec4<f32>(1.0);
    return output;
}
