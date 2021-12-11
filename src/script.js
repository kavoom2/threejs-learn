import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "./style.css";

/**
 * Debug GUI
 */
const gui = new GUI();

// * Material used to put a color on each visible pixels of geometries. The algorithms are written in programs called **Shaders**.

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexutre = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const matcapTexture = textureLoader.load("/textures/matcaps/7.png");
const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");

const environmentMapTexture = cubeTextureLoader.load([
  // Convention is... Positive | Negative -> p{coordinate} | n{coordinate}
  "/textures/environmentMaps/3/px.jpg",
  "/textures/environmentMaps/3/nx.jpg",
  "/textures/environmentMaps/3/py.jpg",
  "/textures/environmentMaps/3/ny.jpg",
  "/textures/environmentMaps/3/pz.jpg",
  "/textures/environmentMaps/3/nz.jpg",
]);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
// * Apply Texture
// const material = new THREE.MeshBasicMaterial();
// material.map = doorColorTexture;
// // material.color.set(0xff00ff);
// // material.wireframe = true;

// // * Apply Transparent |  Alpha
// material.transparent = true;
// // material.opacity = 0.5;
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.FrontSide;

// const material = new MeshNormalMaterial();
// * Normals: information that contains the direction of the outside of the face (maps the normal vector to RGB colors)
// => Normal can be used for lightning | reflectin | refraction, etc..
// => Usually used to debug normals, but colors looks so great! :)
// material.flatShading = true;

// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;
// * MeshMatcapMaterial display a color by using the normals as a reference to pick the right color on texture taht looks like a sphere!
// => MatCaps Opensource: https://github.com/nidorx/matcaps

// const material = new THREE.MeshDepthMaterial();
// * MeshDepthMaterial simply color the geometry in white if its close to the near and in black if its close to the far value of the camera
// => [EX] Silent Hills (horror games)

// const material = new THREE.MeshLambertMaterial();
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color(0x00ffff); // -> color of reflection parts
// * MeshLambertMaterial, MeshPhongMaterial react to light
// => MeshPhongMaterial is similar to MeshLambertMaterial, the strange patterns are less visible and can see light reflections.

// const material = new THREE.MeshToonMaterial();
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;
// material.gradientMap = gradientTexture;
// * MeshToonMaterial
// => To add more steps to coloration , use gradientMap.

const material = new THREE.MeshStandardMaterial(); // 여기에, Clear coat effect가 추가된 것이 MeshPhysicalMaterial
// material.metalness = 0.5;
// material.roughness = 0.5;
// material.map = doorColorTexture;
// * MeshStandardMaterial uses *PBR* (Physical based rendering)
// => it support lights like LambertMaterial and PhongMaterial, but with a *more realistic algorightm* and *better parameters* like roughness and metalness.

const materialGui = gui.addFolder("Material");

materialGui.add(material, "metalness", 0, 1, 0.0001);
materialGui.add(material, "roughness", 0, 1, 0.0001);
materialGui.add(material, "wireframe");

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);

// * aoMap(*Ambient Occlusion Map) will add shadows where the textrue is dark.
// => have to add attribute *uv2* first
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.05;

// => When use metalMap and roughnessMap, recomment to disable metalness, roughness attributes
// material.metalnessMap = doorMetalnessTexutre;
// material.roughnessMap = doorRoughnessTexture;
// materialGui.add(material, "aoMapIntensity", -10, 10, 0.0001);
// materialGui.add(material, "displacementScale", -1, 1, 0.0001);

// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = doorAlphaTexture; // must transparent = true

// * MeshPointsMaterial => use this with *Particles*
// * RawShaderMaterial | ShaderMaterial => make your own material

// * EnvironmentMap => surrounding the scene
// ! HDRIHaven => High Dynamic Range Imaging Stocks!!
// ! To convert HDRIs to CubeMap, use this online tools: https://matheowis.github.io/HDRI-to-CubeMap/
material.metalness = 0.7;
material.roughness = 0.2;
material.envMap = environmentMapTexture;

sphere.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);
plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);
torus.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);

console.log(sphere.geometry.attributes);

sphere.position.x = -1.5;
torus.position.x = 1.5;

scene.add(sphere);
scene.add(plane);
scene.add(torus);

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

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update Objects
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
