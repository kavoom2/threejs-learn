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

// Object
// - Geometry is composed of *vertices (point coordinates of 3D spaces)* and *faces(triangles that join those vertices to create a surface)*
// - Geometry is used for meshes but also for particles
// - store more datas such as positions | UV coordinates | normals | colors and so on.. (anything we want)

// Geometry inherit from *BufferGeometry*
// - Geometry => Segments => Vertices

// Before creating the geometry, need to understand how to store *buffer* geometry data
// - We are goint to use *Float32Array*
// - Typed array | Can only store floats | Fixed Length | Easier to handle for computer
const geometry = new THREE.BufferGeometry();

// Convert Float32Array to *BufferAttribute*
const count = 100;
const positionArray = new Float32Array(count * 3 * 3);

for (let i = 0; i < count * 3 * 3; i++) {
  positionArray[i] = Math.random() - 0.5;
}

const positionAttribute = new THREE.BufferAttribute(positionArray, 3);

// const positionArray = new Float32Array([
//   // 1st vertice [x, y, z]
//   0, 0, 0,
//   // 2nd vertice [x, y, z]
//   0, 1, 0,
//   // 3rd vertice [x, y, z]
//   1, 0, 0,
// ]);

// - item size: 3, because we use an item as a vertice[x, y, z].
// - item size depends on purpose of floatArray (uv, and so on...)
// const positionAttribute = new THREE.BufferAttribute(positionArray, 3);

geometry.setAttribute("position", positionAttribute);

// const geometry = new THREE.BoxGeometry(1, 1, 1, 4, 4, 4);
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
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

// Camera
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

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
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
