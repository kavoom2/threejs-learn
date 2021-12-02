const canvasEl = document.querySelector("#webgl-viewer");

// * 1. SCENE
// - like a container
// - could put objects, models, lights and so on...
// - could ask to Three.js to render that scene

const scene = new THREE.Scene();

// * 2. Objcets
// - Primitive geometries
// - Imported models
// - Particle, Lights and so on..

// ** ==> We need to create a *MESH*
// - which is combination of a Geometry[shape] + a Material[how it looks]
// - start with a BoxGeometry and a MeshBasicMaterial
// - Docs: https://threejs.org/docs/#api/en/objects/Mesh

const geometry = new THREE.BoxGeometry(1, 2, 4);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

// * 3. Camera
// - Not visible
// - Serva as point of view when doing a render
// - Could have multiple and swith between them
// - Different types
// - in ThreeJS, we use PerspectiveCamera

// ** FOV[field of view]
// - vertical vision angle
// - in degrees
``;
// ** Aspect Ratio: width / height

const sizes = {
  width: 600,
  height: 400,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

// ! Mova the camera backward before doing render (get out of a box)
camera.position.x = 1 + 0.5;
camera.position.y = 2 + 1;
camera.position.z = 4 + 2;
scene.add(camera);

// * 4. Renderer
// - Docs: https://threejs.org/docs/?q=renderer#api/en/renderers/WebGLRenderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvasEl,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
