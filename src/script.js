import * as dat from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "./style.css";

// * Particles can be used to create stars, smoke, rain, dust, fire, etc..
// can have thousands of them with a reasonable frame rate.
// Each particle is composed of a plane always facing the camera.

// Buffer Geometry + Points Material + Point Instance(Mesh)

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/textures/particles/2.png");

/**
 * Particles
 */

// const particlesGeometry = new THREE.SphereBufferGeometry(1, 32, 32);
const particlesGeometry = new THREE.BufferGeometry();
const count = 20000;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const particleMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  //   color: "#aa88ff",
  map: particleTexture,
  transparent: true,
  alphaMap: particleTexture,
  //   alphaTest: 0.4,
  //   depthTest: false,
  depthWrite: false,
  blending: THREE.AdditiveBlending,

  // Depth Test Issue
  // => https://stackoverflow.com/questions/37647853/three-js-depthwrite-vs-depthtest-for-transparent-canvas-texture-map-on-three-p
  // 간단하게 정리하면, 이슈는 깊이 + 투명도가 같이 동작하지 않는다는 것 + 먼저 그려진 물체보다 나중에 그려진 물체가 더 앞으로 온다느 것 (Depth Test가 있는 이유)

  // 1. Alpha render => 0 ~ 1 사이의 값.
  // WebGL이 Render 여부를 결정하는 값.
  // Default = 0, alpha = 0도 렌더링한다는 것. 0.001로 변경하자.

  // 2. Depth Test: WebGl tests if what's being drawn is close than what's already drawn.
  // can be activated with alphaTest.
  // Deactivating the depth test => create bugs if you have other objects...

  // 3. Depth Write => the depth of waht's being drawn is being stored in what we call a *depth buffer*
  // we can call the WebGl not to write particles in that depth buffer with depthTest.

  vertexColors: true,
});

// ! => Vertex에 Particle이 위치하게 됨. 마치 우주같네..?

/**
 * Points
 */
const particles = new THREE.Points(particlesGeometry, particleMaterial);
scene.add(particles);

/**
 * Test cube
 */
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial()
);
// scene.add(cube);

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
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //   particles.rotation.y = elapsedTime * 0.2;
  //   particles.position.y = elapsedTime * 0.5;
  //   particles.rotation.z = -elapsedTime * 0.12;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    const x = particlesGeometry.attributes.position.array[i3];
    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
      elapsedTime + x
    );
  }
  particlesGeometry.attributes.position.needsUpdate = true;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
