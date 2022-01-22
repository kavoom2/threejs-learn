// * OpenGL: Types
// uniform: CPU에서 GPU로 넘겨주는 변수
// attribute: geometry attribute
// varying: vertexShader -> fragmentShader로 넘겨주는 변수


// uniform mat4 projectionMatrix; // Transform the coodinates into the clip space coordinates
// uniform mat4 viewMatrix; // Apply Transformations relative to camera(position, rotation ,field of view, near, far)
// uniform mat4 modelMatrix; // Apply transformations relative to Mesh (positon, rotation, scale)

// Custom Uniform Value
uniform vec2 uFrequency;
uniform float uTime;

// attribute vec3 position;
// attribute vec2 uv;

attribute float aRandom;

varying float vRandom;
varying vec2 vUv;
varying float vElevation;

void main()
{
    // 1. Model Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

    modelPosition.z = elevation;

    // 2. View Position
    vec4 viewPosition = viewMatrix * modelPosition;

    // 3. ProjectedPosition
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // 4. Pass params to fragment.glsl
    vRandom = aRandom;
    vUv = uv;
    vElevation = elevation;
}

// float loremIpsum(float a, float b)
// {
//     return a + b;
// }

// void main()
// {
//     float result = loremIpsum(2.0, 3.0);

//     float a = 1.0;
//     int b = 2;
//     float c = a * float(b);

//     vec2 cood2 = vec2(1.0, 2.0);
//     cood2.x = 1.5;
//     cood2.y = 1.5;
//     cood2 *= 2.0;

//     vec3 cood3 = vec3(0.0);
//     cood3.z = 4.0;

//     vec3 rgbColor = vec3(0.0);
//     rgbColor.r = 0.5;
//     rgbColor.b = 1.0;

//     vec3 foo = vec3(cood2, 3.0);
//     vec2 bar = foo.yx; // !== foo.xy *SWIZZLE*
    
//     vec4 cood4 = vec4(1.0, foo.zx, 0.5);

// }