import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "./style.css";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", (event) => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update Camera
  // Update Camera Aspect Ratio
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update Renderer
  // - Update Canvas Size
  renderer.setSize(sizes.width, sizes.height);
  // - Update pixel ratio when device changed
  // - [ex] use dual monitors..
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Support a *Fullscreen Mode* => check double clicking anywhere
// FUCKING SAFARI DO ADDITIONAL THINGS(*webkit*).
window.addEventListener("dblclick", (event) => {
  // Support safari..
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    // * 1. If in fullscreen mode...
    if (canvas.requestFullscreen) canvas.requestFullscreen();
    else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
  } else {
    // * 2 If not in fullscreen mode...
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  }
});

// Few years ago, all screens had a pixel ratio of *1* and if you looked closely, you could see those pixels.
// Contructors like Apple saw an opportunity and started building screens with a pixel ratio of *2*
// Now some constructors are making even higher pixel ratio like *3* and even more.

// A pixel ratio of 2 means 4 times more pixels to render
// A pixel ratio of 3 means 9 times more pixels to render
// 3** == 2** == 1** == ONE UNIT PIXEL of screen

// * We can get Current device pixel ratio => window.devicePixelRatio

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
// * Limit pixel ratio upto 2. because it might be too much to handle for the device.
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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
