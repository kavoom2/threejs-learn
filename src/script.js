import * as THREE from "three";
import { EventDispatcher } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./style.css";

// Cursor

console.log(OrbitControls);
console.log(EventDispatcher);

// const cursor = {
//     x: 0,
//     y: 0,
//   };

// window.addEventListener("mousemove", (event) => {
//   // If you want to Cursor Coordinate range from -0.5 to 0.5...
//   cursor.x = event.clientX / sizes.width - 0.5;
//   cursor.y = -(event.clientY / sizes.height - 0.5);
// });

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Scene
const scene = new THREE.Scene();

// Object
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(mesh);

const aspectRatio = sizes.width / sizes.height;

// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   aspectRatio,
//   1,
//   -1,
//   0.1,
//   2000
// );

const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 2000);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// camera.position.x = 2;
// camera.position.y = 2;
camera.position.z = 3;

camera.lookAt(mesh.position);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update Camear
  // - 회전하는 사각형을 보고 싶다면, XZ평면에서 회전하도록 만들자.
  //   camera.lookAt(new THREE.Vector3(0, 0, 0));

  // Update objects
  //   mesh.rotation.y = elapsedTime;

  // Render

  // Update Controls
  controls.update();

  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

// Camera: Abstract Class,

// ArrayCamera: render the scene from multiple cameras on specific areas of render
// StereoCamera: render rthe scene through two cameras that mimic the eyes to create parallex effect. (use with devices like vr headset)
// CubeCamera: do 6 render, each one facing a different dircetion. can render the surrounding for thing like environmet map, reflection or shadow map.
// OrthogreaphicCamera: render the scene without perspective
