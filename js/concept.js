import * as THREE from 'three'; // main import
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'; // for loading the gltf model
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'; // for adding orbiting controls to the scene

// this creates webgl renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });

// changing the color space, this depends on the model we are working with. default is SRGBColorSpace
renderer.outputColorSpace = THREE.SRGBColorSpace;

// setting the size of the renderer and clearing the color
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);

// setting the pixel ratio of the renderer for different devices
renderer.setPixelRatio(window.devicePixelRatio);

// adding the renderer to the body of the document
document.body.appendChild(renderer.domElement);

// creating a scene
const scene = new THREE.Scene();

// creating a camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(4,5,11);
camera.lookAt(0, 0, 0);

// orbit controls for scene
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();


// for creating a ground
const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  side: THREE.DoubleSide
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.castShadow = false;
groundMesh.receiveShadow = true;
scene.add(groundMesh);


// for creating a light
const spotLight = new THREE.SpotLight(0xffffff, 3000, 100, 0.22, 1);
spotLight.position.set(0, 25, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

// adding a cube to the scene
const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshStandardMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 1, 0);
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);

// const loader = new GLTFLoader().setPath('G:\addr-website\website\models');
// loader.load('result.gltf', (gltf) => {
//     const mesh = gltf.scene;
//     mesh.position.set(0, 1.05, -1);
//     scene.add(mesh);
// });






// necessary animate functions
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  
animate();