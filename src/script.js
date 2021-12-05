import gsap from "gsap";
import * as THREE from "three";
import "./style.css";

console.log(gsap);

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// * RequestAnimationFrame
// - Purpose of Raq is *to call the function provided on the next frame*.
// - call the same function on each new frame.

// * Clock (THREE JS)
// const clock = new THREE.Clock();

// * GSAP (JS MOTION LIBRARY, has own clock inside)
// We can choose either gsap or clock
gsap.to(mesh.position, {
  duration: 1,
  delay: 1,
  x: 2,
});
gsap.to(mesh.position, {
  duration: 1,
  delay: 2,
  x: 0,
});

// Animations
const tick = () => {
  // Have to check frame rates
  //   const elapsedTime = clock.getElapsedTime();

  // Update Objects
  //   camera.position.y = Math.sin(elapsedTime);
  //   camera.position.x = Math.cos(elapsedTime);
  //   camera.lookAt(mesh.position);

  // Render scene with camera
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
