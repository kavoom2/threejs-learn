#define PI 3.1415926535897932384626433832795

varying vec2 vUv;

float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x) {return mod(((x*34.0)+1.0)*x, 289.0);}

vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main()
{
    // gl_FragColor = vec4(0.5, 0.0, 1.0, 1.0);

    // * Pattern 1. Gradient
    // gl_FragColor= vec4(vUv.x, vUv.y, 1.0, 1.0);
    gl_FragColor = vec4(vUv, 1.0, 1.0);

    // * Pattern 2. Gradient #2
    gl_FragColor = vec4(vUv.x, vUv.y, 0.0, 1.0);

    // * Pattern 3. Gradient #3
    float strengthX = vUv.x;

    gl_FragColor = vec4(vec3(strengthX), 1.0);

    // * Pattern 4. Gradient #4
    float strengthY = vUv.y;

    gl_FragColor = vec4(vec3(strengthY), 1.0);

    // * Pattern 5. Gradient #5
    float invertStengthY = 1.0 - vUv.y;
    gl_FragColor = vec4(vec3(invertStengthY), 1.0);

    // * Pattern 6. Gradient #6
    float gradientStrengthY = min(vUv.y * 10.0, 1.0);
    gl_FragColor = vec4(vec3(gradientStrengthY), 1.0);

    // * Pattern 7.
    float moddedStrengthY = mod(vUv.y * 10.0, 1.0);
    gl_FragColor = vec4(vec3(moddedStrengthY), 1.0);

    // * Pattern 8 + 9.
    float evenStrengthY = mod(vUv.y * 10.0, 1.0);
    // evenStrengthY = evenStrengthY < 0.5 ? 0.0 : 1.0;
    // => 조건문은 사용하지 않는 것이 좋습니다. (성능 이슈)
    // evenStrengthY = step(0.5, evenStrengthY);
    evenStrengthY = step(0.8, evenStrengthY);
    
    gl_FragColor = vec4(vec3(evenStrengthY), 1.0);

    // * Pattern 10 ~ 11.
    float evenStrengthX = mod(vUv.x * 10.0, 1.0);
    evenStrengthX = step(0.8, evenStrengthX);

    gl_FragColor = vec4(vec3(evenStrengthX), 1.0);
    
    // * Pattern 12.
    float evenStrengthGrid = min(step(0.8, mod(vUv.x * 10.0, 1.0)) + step(0.8, mod(vUv.y * 10.0, 1.0)), 1.0);

    gl_FragColor = vec4(vec3(evenStrengthGrid), 1.0);

    // * Pattern 13.
    float dotGridStrength = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0, 1.0));

    gl_FragColor = vec4(vec3(dotGridStrength), 1.0);

    // * Pattern 14.
    float barX = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0, 1.0));
    float barY = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    float mergedBars = min(barX + barY, 1.0);

    gl_FragColor = vec4(vec3(mergedBars), 1.0);

    // * Pattern 15.
    float barXCrossed = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0)) * step(0.4, mod(vUv.y * 10.0, 1.0));
    float barYCrossed = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));
    float crossedBars = min(barXCrossed + barYCrossed, 1.0);

    gl_FragColor = vec4(vec3(crossedBars), 1.0);

    // * Pattern 16.
    // float asideRightStrength = max(min(vUv.x - 0.5, 1.0), 0.0);
    // float asideLeftStrength = max(min(0.5 - vUv.x, 1.0), 0.0);    
    // float symmetryGradient = asideLeftStrength + asideRightStrength;
    float symmetryGradient = abs(vUv.x - 0.5);

    gl_FragColor = vec4(vec3(symmetryGradient), 1.0);

    // * Pattern 17.
    // 합연산 | 곱연산 | Min / Max일 때 경계 형태를 살펴보자.
    float minSymmetricalGradient = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    gl_FragColor = vec4(vec3(minSymmetricalGradient), 1.0);

    // * Pattern 18.
    float maxSymmetricalGradient = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    gl_FragColor = vec4(vec3(maxSymmetricalGradient), 1.0);

    // * Pattern 19.
    // float steppedGradient = 1.0 - step(abs(vUv.x - 0.5) , 0.20) * step(abs(vUv.y - 0.5), 0.20);
    float steppedGradient = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    gl_FragColor = vec4(vec3(steppedGradient), 1.0);

    // * Pattern 20.
    float square1 = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    float square2 = 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    float steppedGradient2 = square1 * square2;

    gl_FragColor = vec4(vec3(steppedGradient2), 1.0);
    
    // * Pattern 21.
    float horizontalPalette = ceil((vUv.x * 10.0)) / 10.0;
    gl_FragColor = vec4(vec3(horizontalPalette), 1.0);

    // * Pattern 22.
    float gridPalette = (ceil((vUv.x * 10.0)) / 10.0) * (ceil((vUv.y * 10.0)) / 10.0);
    gl_FragColor = vec4(vec3(gridPalette), 1.0);

    // * Pattern 23.
    float randomStrength = random(vUv);

    gl_FragColor = vec4(vec3(randomStrength), 1.0);

    // * Pattern 24.
    vec2 gridUv = vec2(
        ceil((vUv.x * 10.0)) / 10.0,
        ceil((vUv.y * 10.0)) / 10.0
    );
    float randomGridPalette = random(gridUv);
    gl_FragColor = vec4(vec3(randomGridPalette), 1.0);

    // * Pattern 25.
        vec2 rotatedGridUv = vec2(
        ceil((vUv.x * 10.0)) / 10.0,
        ceil(((vUv.y + vUv.x * 0.5) * 10.0)) / 10.0
    );
    float randomGridRatoatedPalette = random(rotatedGridUv);
    gl_FragColor = vec4(vec3(randomGridRatoatedPalette), 1.0);

    // * Pattern 26.
    float vectorLength = length(vUv);

    gl_FragColor = vec4(vec3(vectorLength), 1.0);

    // * Pattern 27.
    // float vectorLength2 = length(vUv - 0.5);
    float vectorLength2 = distance(vUv, vec2(0.5));

    gl_FragColor = vec4(vec3(vectorLength2), 1.0);

    // * Pattern 28.
    float vectorLength3 = 1.0 - distance(vUv, vec2(0.5));

    gl_FragColor = vec4(vec3(vectorLength3), 1.0);

    // * Pattern 29.
    float vectorLength4 = 0.015 / distance(vUv, vec2(0.5));

    gl_FragColor = vec4(vec3(vectorLength4), 1.0);

    // * Pattern 30.
    vec2 lightUv = vec2(vUv.x * 0.5 + 0.25, vUv.y);
    float vectorLength5 = 0.015 / distance(lightUv, vec2(0.5));

    gl_FragColor = vec4(vec3(vectorLength5), 1.0);

    // * Pattern 31.
    vec2 startLightUvX = vec2(vUv.x * 0.1 + 0.45, vUv.y);
    float starLightX = 0.015 / distance(startLightUvX, vec2(0.5));

    vec2 startLightUvY = vec2(vUv.y * 0.1 + 0.45, vUv.x);
    float starLightY = 0.015 / distance(startLightUvY, vec2(0.5));

    float startLight = starLightX * starLightY;

    gl_FragColor = vec4(vec3(startLight), 1.0);

    // * Pattern 32.
    vec2 rotatedUv = rotate(vUv, PI / 4.0, vec2(0.5));
    vec2 rotatedStartLightUvX = vec2(rotatedUv.x * 0.1 + 0.45, rotatedUv.y);
    vec2 rotatedStartLightUvY = vec2(rotatedUv.y * 0.1 + 0.45, rotatedUv.x);

    float rotatedStartLightX = 0.015 / distance(rotatedStartLightUvX, vec2(0.5));
    float rotatedStartLightY = 0.015 / distance(rotatedStartLightUvY, vec2(0.5));

    float rotatedStarLight = rotatedStartLightX * rotatedStartLightY;

    gl_FragColor = vec4(vec3(rotatedStarLight), 1.0);

    // * Pattern 33.
    float circle = step(0.25, distance(vUv, vec2(0.5)));

    gl_FragColor = vec4(vec3(circle), 1.0);

    // * Pattern 34.
    float donut =  abs(distance(vUv, vec2(0.5)) - 0.25);

    gl_FragColor = vec4(vec3(donut), 1.0);

    // * Pattern 35.
    float steppedDonut = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

    gl_FragColor = vec4(vec3(steppedDonut), 1.0);

    // * Pattern 36.
    float invertedSteppedDonut = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

    gl_FragColor = vec4(vec3(invertedSteppedDonut), 1.0);

    // * Pattern 37.
    // vec2 waveUv = vec2(vUv.x, vUv.y + sin(vUv.x * 100.0) * 0.1);
    // vec2 waveUv = vec2(vUv.x + cos(vUv.y * 30.0) * 0.1, vUv.y + sin(vUv.x * 30.0) * 0.1);
    vec2 waveUv = vec2(vUv.x + cos(vUv.y * 100.0) * 0.1, vUv.y + sin(vUv.x * 100.0) * 0.1);
    float waveStrength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));

    gl_FragColor = vec4(vec3(waveStrength), 1.0);

    // * Pattern 40.
    // float angle = atan(vUv.x , vUv.y);
    float angle = atan(vUv.x - 0.5 , vUv.y - 0.5);

    gl_FragColor = vec4(vec3(angle), 1.0);

    // * Pattern 42.
    float rotatedAngle = atan(vUv.x - 0.5 , vUv.y - 0.5);
    rotatedAngle /= PI * 2.0;
    rotatedAngle += 0.5;

    gl_FragColor = vec4(vec3(rotatedAngle), 1.0);

    // * Pattern 43.
    float rotatedAngleWithSteps = atan(vUv.x - 0.5 , vUv.y - 0.5);
    rotatedAngleWithSteps /= PI * 2.0;
    rotatedAngleWithSteps += 0.5;
    rotatedAngleWithSteps *= 20.0;
    rotatedAngleWithSteps = mod(rotatedAngleWithSteps, 1.0);

    gl_FragColor = vec4(vec3(rotatedAngleWithSteps), 1.0);

    // * Pattern 44.
    float simpleRotatedAngle = atan(vUv.x - 0.5 , vUv.y - 0.5);
    simpleRotatedAngle /= PI * 2.0;
    simpleRotatedAngle += 0.5;

    float simpleRotatedAngleStrength = sin(simpleRotatedAngle * 50.0);

    gl_FragColor = vec4(vec3(simpleRotatedAngleStrength), 1.0);

    // * Pattern 45.
    float sinusoid = sin(simpleRotatedAngle * 100.0);
    float amplitudeRadius = 0.25 + sinusoid * 0.01;
    float borderCircle = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - amplitudeRadius));

    gl_FragColor = vec4(vec3(borderCircle), 1.0);

    // * Pattern 46.
    float perlinNoiseStrength = cnoise(vUv * 10.0);

    gl_FragColor = vec4(vec3(perlinNoiseStrength), 1.0);

    // * Pattern 47.
    float steppedPerlinNoise = step(0.0, perlinNoiseStrength);

    gl_FragColor = vec4(vec3(steppedPerlinNoise), 1.0);

    // * Pattern 48.
    float stripePerlinNoise = 1.0 - abs(perlinNoiseStrength);

    gl_FragColor = vec4(vec3(stripePerlinNoise), 1.0);

    // * Pattern 49.
    float naturalStripe = sin(cnoise(vUv * 10.0) * 20.0);

    gl_FragColor = vec4(vec3(naturalStripe), 1.0);

    // * 49 - 2
    float stppedNaturalStripe = step(0.5, naturalStripe);

    gl_FragColor = vec4(vec3(stppedNaturalStripe), 1.0);

    // * 50
    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(vUv, 1.0);

    vec3 mixedColor = mix(blackColor, uvColor, naturalStripe);

    gl_FragColor = vec4(mixedColor, 1.0);

    // * 51
    // Clamp Strength
    float clampedStrength = clamp(evenStrengthGrid, 0.0, 1.0);
    vec3 mixedColor2 = mix(blackColor, uvColor, clampedStrength);

    gl_FragColor = vec4(mixedColor2, 1.0);


}