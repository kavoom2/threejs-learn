import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "./style.css";

/**
 * Textures
 */

// * 1. Native JS method
// const image = new Image();
// const texture = new THREE.Texture(image);

// image.onload = () => {
//   console.log("image loaded");
// };

// image.addEventListener("load", () => {
//   // ? Texture에게 업데이트가 필요 하다는 것을 알려준다.
//   texture.needsUpdate = true;
// });

// image.src = "/textures/door/color.jpg";

// * 2. THREE JS Method
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
  console.log("loading started");
};
loadingManager.onProgress = () => {
  console.log("loading in progress");
};
loadingManager.onLoad = () => {
  console.log("loading ended with success results");
};
loadingManager.onError = () => {
  console.log("loading ended with errors");
};

const textureLoader = new THREE.TextureLoader(loadingManager); // Class for loading textures, could load multiple textures!
const colorTexture = textureLoader.load("/textures/minecraft.png");
const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const heightTexture = textureLoader.load("/textures/door/height.jpg");
const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const normalTexture = textureLoader.load("/textures/door/normal.jpg");
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);

// ** repeat property => Vector2 Class (x, y)

// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 3;
// colorTexture.wrapS = THREE.RepeatWrapping;
// colorTexture.wrapT = THREE.RepeatWrapping;
// colorTexture.wrapS = THREE.MirroredRepeatWrapping;
// colorTexture.wrapT = THREE.MirroredRepeatWrapping;

// colorTexture.offset.x = 0.5;
// colorTexture.offset.y = 0.5;

colorTexture.center.x = 0.5;
colorTexture.center.y = 0.5;
colorTexture.rotation = Math.PI / 4;

// ** Mip-Mapping
// - a technic that consist of creating half a smaller version of a texture again and again until we get 1x1 texture.
// - All those texture variations are sent to the GPU, and the GPU will choose the most appropriate version of the texture.
// - All of this is already handled by THREE.js and GPU. but we can choose **Different Algorithms**.
// - The mip mapping will produce a half smaller version of the texture repeatedly until 1 x 1 => 512 * 512 | 1024 * 1024 | (width and height must be a power of 2)

// ** - Minification Filter => happens when the pixels of texture are smaller than the pixels of the render. (the texture is too big for the surface)
// ** - Magnification Filter => happens when the pixels of the texture are bigger than the pixels of the render. (the texture is too small for the surface)
colorTexture.generateMipmaps = false;

colorTexture.minFilter = THREE.NearestFilter;
colorTexture.magFilter = THREE.NearestFilter;

// * 2. [PS] use LoadingManager to handle file-load

// ! PBR Principle - Physically Based Rendering, 물리에 기반한 렌더링 기법
// - Physically Based Rendering
// - Many technics that tend to follow real-life directions to get realistic results
// - Becoming the standards for realistic renders
// - Many softwares, engines, and libraries are using it!

// ? Useful articles...
// - https://marmoset.co/posts/basic-theory-of-physically-based-rendering/
// - https://marmoset.co/posts/physically-based-rendering-and-you-can-too/

// ! BASIC
// ** 1. Base color | Albedo
// - 광학적 특성을 제외한 물체 고유의 색상만 표현 (질감 | 광원 등을 표현하지 않음)

// ** 2. Alpha
// - White is visible | Black is hidden

// ** 3. Normal
// - Add details according to **Lighting**
// - Doesnt need subvdivision -> 폴리곤으로 잘게 나누어 표현하지 않아도 됨
// - So, the vertices wont move (just visual effect)
// - Instead, lure the light about the face orientation
// - Better performance than adding a height of texture with a lot of subdivision ==> 기본적인 디테일 (폴리곤으로 표현하지 않아도 되는 것)

// ! 아래 이후로는 재질 등에 따른 강조 효과
// ** 4. Ambient Occlusion
// - Grayscale image
// - Add **FAKE Shadows** in crevices
// - Not physically accurate
// - Helps to craete contrast and see details ==> 명암 대조 + Sharpen

// ** 5. Metalness
// - Grayscale image
// - White is metallic | Black is non-metallic
// - Mostly for **Reflection** ==> 반사

// ** 6. Roughness
// - Grayscale image
// - In duo with the metalness
// - White is rough | Black is smooth
// - Mostly for **Light dissipation** => 광원 분산

// ...etc...!

// ! UV Mapping | UV UnMapping - 2차원 <==> 3차원
// - Each vertex will have a **2D Coordinate** on a **flat plane(Usually Box)**..!!

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
console.log(geometry.attributes.uv);
// UV => Float32BufferAttribute, array item size is *2*. this means [x, y] coordinates on uv texture position

const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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
camera.position.z = 1;
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
