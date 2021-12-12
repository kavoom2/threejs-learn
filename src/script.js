import * as dat from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "./style.css";

// * Shadows have always been challenges for real-time 3D rendering.
// => developers must find tricks to display *realistic shadows at reasonable frame rate*.

// * When do one render, Three.js will do a render for each light supporting shadows.
// => those lights renders will simulate what light sees as if it was a camera.
// => during these lights renders, a MeshDepthMaterial replaces all meshes materials.
// => The lights renders are stored as textures and we call those *Shadow Maps*.
// => they are used on every materials supposed to receive shadows and projected on the geometry.
// [Example] https://threejs.org/examples/webgl_shadowmap_viewer.html

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const bakedPlaneShadow = textureLoader.load("/textures/bakedShadow.jpg");
const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg");

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
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight.position.set(2, 2, -1);
gui.add(directionalLight, "intensity").min(0).max(1).step(0.001);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);
scene.add(directionalLight);

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);

// ! 1. Using Baked Shadow Method.
// const plane = new THREE.Mesh(
//   new THREE.PlaneGeometry(5, 5),
//   new THREE.MeshBasicMaterial({
//     map: bakedPlaneShadow,
//   })
// );

// ! 2. Using Alternative Baked Shadow or THREE.JS Shadow
const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;

scene.add(sphere, plane);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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

// * Activate the shadowMap on renderer
renderer.shadowMap.enabled = true;

// * Different Types of Algorithms can be applied to shadowMaps.
// BasicShadowMap | PCFShadowMap | PCFSoftShadowMap | VSMShadowMap
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// * Each Object can cast and receive shadows.
sphere.castShadow = true; // sphere can cast a shadow
plane.receiveShadow = true; // plane can receive shadows

// * Following types of lights only support shadows
// => Point Light, Directional Light, Spot Light
// => Shadow Map has *Width* and *Height
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024; // Must use power of 2 (because of min-mapping!)
directionalLight.shadow.mapSize.height = 1024;

// * to help us debug, we can use a cameraHelper with the camera used for shadowMap.
// => We can adjust Near | Far distance with helper
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;

// * Amplitude
// => with the camera helper, we can see that the amplitude is too large. because we are using a directional-light, three.js is using an orthographic camera.
// => we can controll how far on each side of the camera can see with *Top | Right | Left | Bottom*
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.bottom = -2;

// * Blur shadow [ CHEAP BLUR... :) ]
directionalLight.shadow.radius = 10;

const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);

scene.add(directionalLightCameraHelper);
directionalLightCameraHelper.visible = false;

// ! Spot Light
const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3);
spotLight.castShadow = true;
spotLight.position.set(0, 2, 2);

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

// * Because we are using a *SpotLight*, Three.js is using a *Perspective Camera*.
// => we must change the fov property to adapt the amplitude.
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;
spotLight.shadow.radius = 3;

scene.add(spotLight);
scene.add(spotLight.target);

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(spotLightCameraHelper);
spotLightCameraHelper.visible = false;

// ! Point Light
const pointLight = new THREE.PointLight(0xffffff, 0.3);
pointLight.castShadow = true;
pointLight.position.set(-1, 1, 0);

pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;

scene.add(pointLight);

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(pointLightCameraHelper);
pointLightCameraHelper.visible = false;

// ! Baking Shadows
// A good alternative to Three.js shadow is baked shadows.
// we intergrate shadows *in textures* that we apply on materials

// * Deactivate Renderer shadows
renderer.shadowMap.enabled = false;

// ! Baking Shadow Alternative (/textures/simpleShadow.jpg) <= basic shadow texture
// => Create a Alpha Shadow Plane slightly above the floor with an AlphaMap using the simpleshadow.
// => Because of "z-index fighting issue"
const sphereShadow = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: simpleShadow,
  })
);

// * The Example is a combination of Dynamic Shadow + Baked Shadow: https://bruno-simon.com
// Dynamic Shadow: 자동차에 사용됨
// Baked Shadow: 지형 지물 오브젝트(나무, 건물 등)에 사용됨

sphereShadow.rotation.x = -Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.001;

scene.add(sphereShadow);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update the sphere
  sphere.position.x = Math.cos(elapsedTime) * 1.5;
  sphere.position.z = Math.sin(elapsedTime) * 1.5;
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3.2)) * 3;

  sphereShadow.position.x = sphere.position.x;
  sphereShadow.position.z = sphere.position.z;
  sphereShadow.material.opacity =
    (1 - Math.abs(sphere.position.y) / 3 + 0.01) * 0.45;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
