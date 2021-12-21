import * as dat from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "./style.css";

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
 * Galaxy
 */
const galaxyParameters = {
  count: 100000,
  size: 0.01,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 1,
};

let geometry = null;
let material = null;
let points = null;

const generateGalaxy = () => {
  //나선은 아르키메데스 나선을 사용합니다.
  // => theta^2 = (theta * sin(theta))^2 + (theta * cos(theta))^2
  // => 원점 ~ 아르키메데스 나선상의 한점까지 반지름 길이 R = theta
  // => https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=yh6613&logNo=220577837688

  /**
   * Destory old galaxy
   */
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(galaxyParameters.count * 3);

  for (let i = 0; i < galaxyParameters.count; i++) {
    const i3 = i * 3;

    const radius = galaxyParameters.radius * Math.random();
    const spinAngle = radius * galaxyParameters.spin;
    const branchAngle =
      ((i % galaxyParameters.branches) / galaxyParameters.branches) *
      Math.PI *
      2;

    const randomX =
      (Math.random() - 0.5) * galaxyParameters.randomness * radius;
    const randomY =
      (Math.random() - 0.5) * galaxyParameters.randomness * radius;
    const randomZ =
      (Math.random() - 0.5) * galaxyParameters.randomness * radius;

    positions[i3 + 0] = Math.cos(spinAngle + branchAngle) * radius + randomX;
    positions[i3 + 1] = 0 + randomY;
    positions[i3 + 2] = Math.sin(spinAngle + branchAngle) * radius + randomZ;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  material = new THREE.PointsMaterial({
    size: galaxyParameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  points = new THREE.Points(geometry, material);
  scene.add(points);
};

generateGalaxy();

gui
  .add(galaxyParameters, "count", 100, 1000000, 100)
  .onFinishChange(generateGalaxy);
gui
  .add(galaxyParameters, "size", 0.001, 0.1, 0.001)
  .onFinishChange(generateGalaxy);

gui
  .add(galaxyParameters, "radius", 0.01, 20, 0.01)
  .onFinishChange(generateGalaxy);

gui.add(galaxyParameters, "branches", 2, 20, 1).onFinishChange(generateGalaxy);

gui.add(galaxyParameters, "spin", -5, 5, 0.001).onFinishChange(generateGalaxy);

gui
  .add(galaxyParameters, "randomness", 0, 2, 0.001)
  .onFinishChange(generateGalaxy);

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
camera.position.x = 3;
camera.position.y = 3;
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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
