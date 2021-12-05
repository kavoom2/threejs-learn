import * as THREE from "three";
import "./style.css";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */

// * Object with **GROUP**
const group = new THREE.Group();
// * 그룹 내의 Mesh Pos를 전체적으로 이동한다. (축이 이동하는 느낌으로 보자)
group.position.y = 1;
scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

group.add(cube1);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff00ff })
);

cube2.position.set(2, 1, 2);

group.add(cube2);

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const mesh = new THREE.Mesh(geometry, material);

// mesh.position.normalize();
// mesh.position.set(0.7, -0.6, 1);
// scene.add(mesh);

// mesh.scale.set(2, 0.3, 0.5);

// * Euler Angles: https://en.wikipedia.org/wiki/Euler_angles
// - 3차원 *강체*의 회전각은 x축 ~ X축 | y축 ~ Y축 | z축 ~ Z축의 변화량으로 정의할 수 있다.
// - 이러한 원리를 일상 생활에 구현한 것이 *짐벌*이다..
// - 하나의 축이 다른 축에 종속적이다.

// Alpha: z-축을 회전축으로 하여 회전된 x-y 좌표축의 각도
// Beta: 회전된 x축을 회전축으로 하여 회전된 z-y 좌표축의 각도
// Gamma: 회전된 z축을 회전축으로 하여 회전된 x-y 좌표축의 각도

// - Method를 쉽게 생각하면 각 축을 기준으로 해당하는 Radian 만큼 돌린다고 생각하면 된다.
// - [EX] mesh.rotation.x => mesh x축을 기준으로 {Radian} 만큼 회전한다.

// mesh.rotation.reorder("XYZ");
// mesh.rotation.x = Math.PI * 0.25;
// mesh.rotation.y = Math.PI * 0.25;
// mesh.rotation.z = Math.PI * 0.25;

// - Gimbal Lock => 두 개 또는 세 개의 축이 겹쳐, 하나 또는 두 개의 축이 자유도를 잃는 현상. 특정 방향으로 회전이 불가능해진다.
// - Quaternion을 사용하면 해결 가능.

const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(-1, 1, 5);

// - Camera: Vector3 Instace를 바라볼 수 있다.
camera.lookAt(new THREE.Vector3(3, 0, 0));
// camera.lookAt(mesh.position);

scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
