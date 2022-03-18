import * as dat from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import fireFliesFragmentShader from "./shaders/fireflies/fragment.glsl";
import fireFliesVertexShader from "./shaders/fireflies/vertex.glsl";
import portalFragmentShader from "./shaders/portal/fragment.glsl";
import portalVertexShader from "./shaders/portal/vertex.glsl";
import "./style.css";

/**
 * Performance Debugger: Spector JS Fallback
 */
// const SPECTOR = require("spectorjs");
// const spector = new SPECTOR.Spector();
// spector.displayUI();

/**
 * Base
 */
// Debug
const debugObject = {};

const gui = new dat.GUI({
  width: 400,
});

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader();

// Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("draco/");

// GLTF loader
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Textures
 */
const bakedTexture = textureLoader.load(`baked.jpg`, (texture) => {
  console.log("loaded", texture);
});

bakedTexture.flipY = false;
bakedTexture.encoding = THREE.sRGBEncoding;

/**
 * Materials
 */

// Baked Material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });

// Pole light Material
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xe5beb0 });

// Portal light Material
debugObject.portalColorStart = "#01071e";
debugObject.portalColorEnd = "#c8c4d4";

const portalLightMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColorStart: { value: new THREE.Color(debugObject.portalColorStart) },
    uColorEnd: { value: new THREE.Color(debugObject.portalColorEnd) },
  },
  vertexShader: portalVertexShader,
  fragmentShader: portalFragmentShader,
});

gui.addColor(debugObject, "portalColorStart").onChange(() => {
  portalLightMaterial.uniforms.uColorStart.value.set(
    debugObject.portalColorStart
  );
});

gui.addColor(debugObject, "portalColorEnd").onChange(() => {
  portalLightMaterial.uniforms.uColorEnd.value.set(debugObject.portalColorEnd);
});

/**
 * Model
 */
gltfLoader.load(`portal.glb`, (gltf) => {
  console.log("loaded", gltf);

  //   gltf.scene.traverse((child) => {
  //     child.material = bakedMaterial;
  //   });

  const bakedMesh = gltf.scene.children.find((child) => child.name === "baked");

  const portalLightMesh = gltf.scene.children.find(
    (child) => child.name === "PortalLight"
  );

  const poleLightAMesh = gltf.scene.children.find(
    (child) => child.name === "poleLight001"
  );

  const poleLightBMesh = gltf.scene.children.find(
    (child) => child.name === "poleLight002"
  );

  bakedMesh.traverse((child, index) => (child.material = bakedMaterial));

  portalLightMesh.material = portalLightMaterial;
  poleLightAMesh.material = poleLightMaterial;
  poleLightBMesh.material = poleLightMaterial;

  scene.add(gltf.scene);
});

/**
 * Fireflies
 */
const fireFliesGeometry = new THREE.BufferGeometry();
const fireFliesCounts = 30;
const positionArray = new Float32Array(fireFliesCounts * 3);
const scaleArray = new Float32Array(fireFliesCounts * 1);

for (let i = 0; i < fireFliesCounts; i++) {
  positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4;
  positionArray[i * 3 + 1] = Math.random() * 1.5;
  positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4;
}

for (let i = 0; i < fireFliesCounts; i++) {
  scaleArray[i] = Math.random();
}

fireFliesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);

fireFliesGeometry.setAttribute(
  "aScale",
  new THREE.BufferAttribute(scaleArray, 1)
);

const fireFliesMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uSize: { value: 100 },
  },
  vertexShader: fireFliesVertexShader,
  fragmentShader: fireFliesFragmentShader,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

gui
  .add(fireFliesMaterial.uniforms.uSize, "value")
  .name("fireFliesSize")
  .min(0)
  .max(500)
  .step(1);

const fireFlies = new THREE.Points(fireFliesGeometry, fireFliesMaterial);
scene.add(fireFlies);

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

  // Update FireFlies
  fireFliesMaterial.uniforms.uPixelRatio.value = Math.min(
    widnow.devicePixelRatio,
    2
  );
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding; // ! Texture's Input Encoding == Renderer's Output Encoding

debugObject.clearColor = "#222130";
renderer.setClearColor(debugObject.clearColor);
gui
  .addColor(debugObject, "clearColor")
  .onChange(() => renderer.setClearColor(debugObject.clearColor));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update Materials
  fireFliesMaterial.uniforms.uTime.value = elapsedTime;
  portalLightMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
