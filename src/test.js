import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { MapControls } from "three/addons/controls/MapControls.js";
import "./style.css";

let camera, controls, scene, renderer;

const leftUnits = [];
const rightUnits = [];
const clock = new THREE.Clock();
const selectedObjects = [];

const init = () => {
  scene = new THREE.Scene();
  const axesHelper = new THREE.AxesHelper(500);
  scene.add(axesHelper);
  scene.background = new THREE.Color(0xcccccc);
  scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

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

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(0, 200, 400);

  // controls

  controls = new MapControls(camera, renderer.domElement);

  //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;

  controls.screenSpacePanning = false;

  controls.minDistance = 100;
  controls.maxDistance = 500;

  controls.maxPolarAngle = Math.PI / 2;

  // world

  const geometry = new THREE.BoxGeometry();
  geometry.translate(0, 0.5, 0);
  const material = new THREE.MeshPhongMaterial({
    color: 0xeeeeee,
    flatShading: true,
  });

  const throne1 = new THREE.Mesh(geometry, material);
  throne1.position.set(-550, 0, 0);
  throne1.scale.set(70, 70, 70);
  scene.add(throne1);

  const throne2 = new THREE.Mesh(geometry, material);
  throne2.position.set(550, 0, 0);
  throne2.scale.set(70, 70, 70);
  scene.add(throne2);

  const unitGeo = new THREE.DodecahedronGeometry(5, 5);

  for (let index = 0; index < 10; index++) {
    const material = new THREE.MeshPhongMaterial({
      color: 0xeeeeee,
      flatShading: true,
    });
    const newUnit = new THREE.Mesh(unitGeo, material);
    newUnit.position.set(550, 10, 0);
    //newUnit.scale.set(2, 2, 2);
    scene.add(newUnit);
    setTimeout(() => {
      rightUnits.push(newUnit);
    }, 1000 * index);
  }

  for (let index = 0; index < 10; index++) {
    const material = new THREE.MeshPhongMaterial({
      color: 0xeeeeee,
      flatShading: true,
    });
    const newUnit = new THREE.Mesh(unitGeo, material);
    newUnit.position.set(-550, 10, 0);
    //newUnit.scale.set(2, 2, 2);
    scene.add(newUnit);
    setTimeout(() => {
      leftUnits.push(newUnit);
    }, 1000 * index);
  }

  // lights

  const dirLight1 = new THREE.DirectionalLight(0xffffff, 3);
  dirLight1.position.set(1, 1, 1);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x002288, 3);
  dirLight2.position.set(-1, -1, -1);
  scene.add(dirLight2);

  const ambientLight = new THREE.AmbientLight(0x555555);
  scene.add(ambientLight);

  //

  window.addEventListener("resize", onWindowResize);

  const raycaster = new THREE.Raycaster();

  const handleClick = (event) => {
    selectedObjects.forEach((obj) => {
      obj.object.material.color.set(0xeeeeee);
    });
    selectedObjects.length = 0;
    const pointer = new THREE.Vector2();
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const intersections = raycaster.intersectObjects([
      throne1,
      throne2,
      ...leftUnits,
      ...rightUnits,
    ]);

    intersections.forEach((intersectObject) => {
      selectedObjects.push(intersectObject);
      intersectObject.object.material.color.set("darkgreen");
    });
  };

  window.addEventListener("click", handleClick);
};

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

const animate = () => {
  const delta = clock.getDelta();
  leftUnits.forEach((unit, i) => {
    unit.position.x = unit.position.x + delta * 20;
  });
  rightUnits.forEach((unit, i) => {
    unit.position.x = unit.position.x - delta * 20;
  });
  requestAnimationFrame(animate);

  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

  renderer.render(scene, camera);
};

init();
animate();
