import * as THREE from 'three'; // main import
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'; // for loading the gltf model
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'; // for adding orbiting controls to the scene
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'; // for fbx model loading

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
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000);
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

// adding a light to the scene, still experimental
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 10, 0);
light.castShadow = true;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.top = 15;
light.shadow.camera.right = 15;
light.shadow.camera.bottom = -15;
light.shadow.camera.left = -15;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 40;
scene.add(light);

// adding a cube to the scene, this is placeholder
// const cubeGeometry = new THREE.BoxGeometry();
// const cubeMaterial = new THREE.MeshStandardMaterial({color: 0x70A1D7});
// const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// cube.position.set(0, 1, 0);
// cube.castShadow = true;
// cube.receiveShadow = true;
// scene.add(cube);


// if we need to load a gltf model, should use this format cause it is more opptimized for web
// const loader = new GLTFLoader().setPath('G:\addr-website\website\models');
// loader.load('result.gltf', (gltf) => {
//     const mesh = gltf.scene;
//     mesh.position.set(0, 1.05, -1);
//     scene.add(mesh);
// });

// adding the fbx model to the scene
const fbxLoader = new FBXLoader();
fbxLoader.load('../models/drone-M30.fbx', (fbx) => {
  fbx.position.set(0, 2, 0);
  fbx.scale.set(0.04, 0.04, 0.04);
  fbx.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(fbx);
});


// necessary animate functions for the scene
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  
animate();



// JAVASCRIPT CODE FOR SCENE 
// const zoomInButton = document.getElementById('zoom_in');
// const zoomOutButton = document.getElementById('zoom_out');
const scrollToTopButton = document.getElementById('scrollToTopButton');

// Listener for window resize
window.addEventListener('resize', () => {
  // camera aspect ratio and projection matrix
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // updating renderer size
  renderer.setSize(window.innerWidth, window.innerHeight);
});


// function for smooth zoom 
const smoothZoom = (targetZoom) => {
  const zoomStep = (targetZoom - camera.zoom) / 20; // can change the speed
  const animateZoom = () => {
    if (Math.abs(targetZoom - camera.zoom) > Math.abs(zoomStep)) {
      camera.zoom += zoomStep;
      camera.updateProjectionMatrix();
      requestAnimationFrame(animateZoom);
    } else {
      camera.zoom = targetZoom;
      camera.updateProjectionMatrix();
    }
  };
  animateZoom();
};

// zoomInButton.addEventListener('click', () => {
//   smoothZoom(camera.zoom + 0.3);
// });

// zoomOutButton.addEventListener('click', () => {
//   smoothZoom(camera.zoom - 0.3);
// });

document.querySelectorAll('#parts_list li').forEach(item => {
  item.addEventListener('click', () => {
    const isExpanded = item.classList.toggle('expanded');
    document.querySelectorAll('#parts_list li').forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.style.display = isExpanded ? 'none' : 'inline-block';
      }
    });
  });
});

const toggleScrollToTopButton = () => {
  if (window.scrollY > 70) { // Show button after scrolling down 70px, as safety 
      scrollToTopButton.style.display = 'block';
  } else {
      scrollToTopButton.style.display = 'none';
  }
};

// Initial check
toggleScrollToTopButton();

// Add scroll event listener
window.addEventListener('scroll', toggleScrollToTopButton);

scrollToTopButton.addEventListener('click', () => {
  window.scrollTo({
      top: 0,
      behavior: 'smooth'
  });
});
