export const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(1500, 700),
  new THREE.MeshStandardMaterial({
    color: "darkgreen",
    metalness: 0,
    roughness: 0.5,
  })
);

floor.receiveShadow = true;

floor.rotation.x = -Math.PI * 0.5;
