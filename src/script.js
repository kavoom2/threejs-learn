import Stats from "stats-js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "./style.css";
/**
 * Stats
 */
const stats = new Stats();
stats.showPanel(0);
document.body.append(stats.dom);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const displacementTexture = textureLoader.load("/textures/displacementMap.png");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  // ! Pixel Ratio: 디바이스의 픽셀 Ratio를 그대로 사용하지 말고, 상한서을 둘 것.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(2, 2, 6);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  // 특정 장치들은 GPU 사용량을 바꾸거나, GPU를 변경한다.
  // WebGLRenderer를 인스턴스화 할 때, 어느정도 사용할 것인지 HINT를 줄 수 있다.
  powerPreference: "high-performance",
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Test meshes
 */
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2, 2),
  new THREE.MeshStandardMaterial()
);
cube.castShadow = true;
cube.receiveShadow = true;
cube.position.set(-5, 0, 0);
// scene.add(cube);

const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 128, 32),
  new THREE.MeshStandardMaterial()
);
torusKnot.castShadow = true;
torusKnot.receiveShadow = true;
// scene.add(torusKnot);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial()
);
sphere.position.set(5, 0, 0);
sphere.castShadow = true;
sphere.receiveShadow = true;
// scene.add(sphere);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial()
);
floor.position.set(0, -2, 0);
floor.rotation.x = -Math.PI * 0.5;
floor.castShadow = true;
floor.receiveShadow = true;
// scene.add(floor);

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, 2.25);
scene.add(directionalLight);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  // ! Keep a performant native JS code especially in the *TICK* function
  stats.begin();

  const elapsedTime = clock.getElapsedTime();

  // Update test mesh
  torusKnot.rotation.y = elapsedTime * 0.1;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);

  stats.end();
};

tick();

/**
 * Tips
 */

// Tip 4
console.log(renderer.info);

// Tip 6
// * Scene에서 제거 -> Geometry | Material 제거
// scene.remove(cube);
// cube.geometry.dispose();
// cube.material.dispose();

// Tip 10
directionalLight.shadow.camera.top = 3;
directionalLight.shadow.camera.right = 6;
directionalLight.shadow.camera.left = -6;
directionalLight.shadow.camera.bottom = -3;
directionalLight.shadow.camera.far = 10;
directionalLight.shadow.mapSize.set(1024, 1024);

const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(cameraHelper);

// Tip 11
cube.castShadow = true;
cube.receiveShadow = false;

torusKnot.castShadow = true;
torusKnot.receiveShadow = false;

sphere.castShadow = true;
sphere.receiveShadow = false;

floor.castShadow = false;
floor.receiveShadow = true;

// Tip 12
renderer.shadowMap.autoUpdate = false;
renderer.shadowMap.needsUpdate = true; // 60FPS이 아닌, 20 ~ 30FPS 등, 특정 시점에서만 업데이트 하도록 할 수 있다. (해당 함수 호출)

// ! Tip 13
// => Textures take a lot of space in the GPU Memory expecially with the mipMaps
// 파일 용량의 문제가 아닙니다. *해상도: Resolution*의 문제입니다.
// 대충 최소한으로 줄이라는 뜻...
// 2의 제곱수로 줄이는거 잊지 말고...

// ! Tip 18
// 동일한 유형의 geometry를 mergedGeometry로 사용.
// const geometries = [];

// for (let i = 0; i < 50; i++) {
//   const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

//   geometry.translate(
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10
//   );

//   geometry.rotateX((Math.random() - 0.5) * Math.PI * 2);
//   geometry.rotateY((Math.random() - 0.5) * Math.PI * 2);

//   geometries.push(geometry);

//   // mesh.position.x = (Math.random() - 0.5) * 10;
//   // mesh.position.y = (Math.random() - 0.5) * 10;
//   // mesh.position.z = (Math.random() - 0.5) * 10;
//   // mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2;
//   // mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2;
// }

// const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries);
// const material = new THREE.MeshNormalMaterial();
// const mesh = new THREE.Mesh(mergedGeometry, material);
// scene.add(mesh);

// Tip 19
// for (let i = 0; i < 50; i++) {
//   const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

//   const material = new THREE.MeshNormalMaterial();

//   const mesh = new THREE.Mesh(geometry, material);
//   mesh.position.x = (Math.random() - 0.5) * 10;
//   mesh.position.y = (Math.random() - 0.5) * 10;
//   mesh.position.z = (Math.random() - 0.5) * 10;
//   mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2;
//   mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2;

//   scene.add(mesh);
// }

// Tip 20
// const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

// for(let i = 0; i < 50; i++)
// {
//     const material = new THREE.MeshNormalMaterial()

//     const mesh = new THREE.Mesh(geometry, material)
//     mesh.position.x = (Math.random() - 0.5) * 10
//     mesh.position.y = (Math.random() - 0.5) * 10
//     mesh.position.z = (Math.random() - 0.5) * 10
//     mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2
//     mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2

//     scene.add(mesh)
// }

// ! Tip 22
// InstancedMesh를 사용하기.
// 각각의 Instance에 대한 변형이 자유롭다. (v.s. Merged)

const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

const material = new THREE.MeshNormalMaterial();

const mesh = new THREE.InstancedMesh(geometry, material, 50);
mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
// scene.add(mesh);

for (let i = 0; i < 50; i++) {
  const matrix = new THREE.Matrix4();

  const position = new THREE.Vector3(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10
  );

  const quaternion = new THREE.Quaternion();
  quaternion.setFromEuler(
    new THREE.Euler(
      (Math.random() - 0.5) * Math.PI * 2,
      (Math.random() - 0.5) * Math.PI * 2,
      0
    )
  );

  matrix.makeRotationFromQuaternion(quaternion);
  matrix.setPosition(position);

  mesh.setMatrixAt(i, matrix);
}

// // Tip 29
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// ! Tip 31, 32, 34 and 35
const shaderGeometry = new THREE.PlaneGeometry(10, 10, 256, 256);

const shaderMaterial = new THREE.ShaderMaterial({
  precision: "lowp", // 쉐이더의 정확도를 설정할 수 있다. -> 성능 개선
  uniforms: {
    // ! 지형의 Randomness를 Perlin 함수를 사용하여 구현할 수 있지만,
    // ! Texture를 사용하여 Texture의 RGB 값을 이용하여 계산할 수도 있다. (R: 0% ~ 100%)
    uDisplacementTexture: { value: displacementTexture },
    uDisplacementStrength: { value: 1.5 },
  },
  defines: {
    // ! 고정 값은 Define으로 선언해서 사용하는 것이 적절하다. (디버깅이 필요하지 않다면,)
    DISPLACEMENT_STRENGTH: 1.5,
  },
  vertexShader: `

        uniform sampler2D uDisplacementTexture;
        // uniform float uDisplacementStrength;

        varying vec2 vUv;
        varying vec3 vColor;

        void main()
        {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);

            float elevation = texture2D(uDisplacementTexture, uv).r;

            // Position
            modelPosition.y += max(elevation, 0.5) * DISPLACEMENT_STRENGTH;
            // if(elevation < 0.5)
            // {
            //     elevation = 0.5;
            // }

            modelPosition.y += elevation * DISPLACEMENT_STRENGTH;
            gl_Position = projectionMatrix * viewMatrix * modelPosition;

            // Color
            float colorElevation = max(elevation, 0.25);
            vec3 color = mix(vec3(1.0, 0.1, 0.1), vec3(0.1, 0.0, 0.5), colorElevation);
            
            // Varying
            vUv = uv;
            vColor = color;
        }
    `,
  // * Shader에서 IF문을 가급적 사용하지 말 것. 내부 유틸 함수로 충분히 해결 가능.
  fragmentShader: `
            // uniform sampler2D uDisplacementTexture;

            // varying vec2 vUv;
        varying vec3 vColor;

        void main()
        {
                // float elevation = texture2D(uDisplacementTexture, vUv).r;

                // elevation = max(elevation, 0.25);

                // elevation = clamp(elevation, 0.5, 1.0);
                
                // if(elevation < 0.25)
                // {
                //     elevation = 0.25;
                // }


                // 색상 부분의 최적화를 하고 싶다면 depthColor | surfaceColor 변수를 사용하지 않고, 그대로 finalColor에 전달한다.
                // vec3 depthColor = vec3(1.0, 0.1, 0.1);
                // vec3 surfaceColor = vec3(0.1, 0.0, 0.5);
                
                    // vec3 finalColor = vec3(0.0);
                    // finalColor.r += depthColor.r + (surfaceColor.r - depthColor.r) * elevation;
                    // finalColor.g += depthColor.g + (surfaceColor.g - depthColor.g) * elevation;
                    // finalColor.b += depthColor.b + (surfaceColor.b - depthColor.b) * elevation;
                // vec3 finalColor = mix(depthColor, surfaceColor, elevation);

                // gl_FragColor = vec4(finalColor, 1.0);
            gl_FragColor = vec4(vColor, 1.0);
        }
    `,
});

const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial);
shaderMesh.rotation.x = -Math.PI * 0.5;
scene.add(shaderMesh);
