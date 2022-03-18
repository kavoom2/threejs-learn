// https://sungjjinkang.github.io/opengl/2021/02/25/openglCoordinate.html
uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;

varying vec2 vUv;

attribute float aScale;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vUv = uv;
}