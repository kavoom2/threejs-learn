void main()
{
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = 0.1 / distanceToCenter - 0.1 * 2.0;

    gl_FragColor = vec4(0.85, 0.8, 1.0, strength);
}