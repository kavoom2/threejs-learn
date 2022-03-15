import * as dat from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
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
const portalLightMaterial = new THREE.MeshBasicMaterial({
  color: 0xcad0e4,
  //   side: THREE.DoubleSide,
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
renderer.setClearColor(0x2a2933);
renderer.outputEncoding = THREE.sRGBEncoding; // ! Texture's Input Encoding == Renderer's Output Encoding

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
