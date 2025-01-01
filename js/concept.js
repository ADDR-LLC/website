import * as THREE from 'three'; // main import
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'; // for loading the gltf model
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'; // for adding orbiting controls to the scene

// this creates webgl renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });

// changing the color space, this depends on the model we are working with. default is SRGBColorSpace
renderer.outputColorSpace = THREE.SRGBColorSpace;

// setting the size of the renderer and clearing the color
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);

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
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI; 
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

// ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true;
scene.add(directionalLight);


// adding a cube to the scene
const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshStandardMaterial({color: 0x70A1D7});
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



// Listener for window resize
window.addEventListener('resize', () => {
  // camera aspect ratio and projection matrix
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // updating renderer size
  renderer.setSize(window.innerWidth, window.innerHeight);
});