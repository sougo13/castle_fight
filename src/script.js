import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { MapControls } from "three/examples/jsm/controls/MapControls";
import Stats from "stats.js";
import * as dat from "lil-gui";
import "./style.css";

const scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper(500);
scene.add(axesHelper);
scene.background = new THREE.Color(0xcccccc);
scene.fog = new THREE.FogExp2(0xcccccc, 0.001);
const canvas = document.querySelector(".canvas");

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const orthographicCamer = new THREE.OrthographicCamera(-100, 100, 100, -100);
orthographicCamer.position.set(0, 100, 250);

scene.add(orthographicCamer);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(1500, 700),
  new THREE.MeshStandardMaterial({
    color: "darkgreen",
    metalness: 0,
    roughness: 0.5,
  })
);

floor.receiveShadow = true;

floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);


const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, orthographicCamer);

const controls = new MapControls(orthographicCamer, renderer.domElement);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;

controls.screenSpacePanning = false;

controls.minDistance = 100;
controls.maxDistance = 500;

controls.maxPolarAngle = Math.PI / 2;

const clock = new THREE.Clock();
const tick = () => {
  stats.begin();
  const delta = clock.getDelta();
  // mesh.rotation.y += delta * 0.2;

  controls.update();
  renderer.render(scene, orthographicCamer);

  stats.end();
  window.requestAnimationFrame(tick);
};

tick();

window.addEventListener("resize", () => {
  // Обновляем размеры
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Обновляем соотношение сторон камеры
  // orthographicCamer.aspect = sizes.width / sizes.height;
  // orthographicCamer.updateProjectionMatrix();

  // Обновляем renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.render(scene, orthographicCamer);
});
