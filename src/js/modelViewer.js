/**
 * 3D Model Viewer — Cinematic Scroll-Driven Edition
 * Performance-optimized: no shadows, minimal lights, capped pixel ratio
 * The robot is a PERSISTENT element that travels with scroll
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let scene, camera, renderer, model, mixer;
let clock = new THREE.Clock();
let animationId = null;
let scrollProgress = 0;
let targetRotY = 0;
let currentRotY = 0;
let mouseX = 0, mouseY = 0;

/**
 * Initialize the cinematic 3D model viewer
 */
export async function initModelViewer() {
  const canvas = document.getElementById('modelCanvas');
  if (!canvas) {
    console.warn('Model canvas not found');
    showFallbackImage();
    return null;
  }

  try {
    // Scene — transparent background
    scene = new THREE.Scene();

    // Camera — tighter FOV for cinematic feel
    const aspect = canvas.clientWidth / canvas.clientHeight;
    camera = new THREE.PerspectiveCamera(35, aspect, 0.1, 100);
    camera.position.set(0, 0.3, 4.5);

    // Renderer — PERFORMANCE OPTIMIZED
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false, // Disable AA for perf
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Cap at 1.5x
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    // NO SHADOWS — biggest perf gain
    renderer.shadowMap.enabled = false;

    // Minimal lighting — 3 lights max
    setupLighting();

    // Load robot model
    await loadModel();

    // Make the canvas container persistent (follows scroll)
    makePersistent();

    // Setup scroll-driven animations
    setupScrollDrivenMotion();

    // Subtle mouse parallax on the model
    setupMouseParallax();

    // Handle resize
    window.addEventListener('resize', onWindowResize);

    // Start render loop
    animate();

    console.log('✅ 3D Model Viewer initialized (Cinematic Mode)');
    return { scene, camera, renderer };

  } catch (error) {
    console.error('Failed to initialize 3D viewer:', error);
    showFallbackImage();
  }
}

/**
 * Minimal lighting — 3 lights only
 */
function setupLighting() {
  // Soft ambient
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));

  // Main key light — no shadows
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
  keyLight.position.set(3, 4, 5);
  scene.add(keyLight);

  // White rim light for clean contour
  const rimLight = new THREE.PointLight(0xffffff, 1.5, 10);
  rimLight.position.set(-3, 2, -2);
  scene.add(rimLight);
}

/**
 * Load the robot model with auto-framing
 */
async function loadModel() {
  return new Promise((resolve, reject) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    const modelPath = '/assets/models/360_sphere_robot_no_glass.glb';

    loader.load(
      modelPath,
      (gltf) => {
        model = gltf.scene;

        // Auto-frame: center and scale
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        model.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.2 / maxDim;
        model.scale.setScalar(scale);

        // Optimize all meshes — NO shadows
        model.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = false;
            node.receiveShadow = false;
            node.frustumCulled = true;
            if (node.material) {
              node.material.needsUpdate = true;
              // Slight metallic sheen
              if (node.material.metalness !== undefined) {
                node.material.metalness = Math.max(node.material.metalness, 0.4);
                node.material.roughness = Math.min(node.material.roughness, 0.6);
              }
            }
          }
        });

        scene.add(model);

        // Setup built-in animations
        if (gltf.animations?.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }

        hideFallbackImage();
        console.log('✅ Robot model loaded');
        resolve(model);
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
        showFallbackImage();
        reject(error);
      }
    );
  });
}

/**
 * Make the canvas container fixed/persistent so it stays visible while scrolling
 */
function makePersistent() {
  const sceneDiv = document.querySelector('.scene');
  if (!sceneDiv) return;

  // The scene element will be positioned by GSAP ScrollTrigger
  // We keep it in the hero but animate it across sections
  sceneDiv.style.willChange = 'transform';
  sceneDiv.style.transformStyle = 'preserve-3d';
}

/**
 * THE CORE: Scroll-driven 3D robot motion
 * As user scrolls, the robot moves, rotates, and scales through "keyframes"
 */
function setupScrollDrivenMotion() {
  const sceneDiv = document.querySelector('.scene');
  if (!sceneDiv || !model) return;

  // ===== HERO → ABOUT transition =====
  // Robot slides to the left and gets smaller, making room for About content
  gsap.to(model.position, {
    x: -1.5,
    y: 0.3,
    z: 0.5,
    ease: 'none',
    scrollTrigger: {
      trigger: '#about',
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
    },
  });

  gsap.to(model.scale, {
    x: model.scale.x * 0.7,
    y: model.scale.y * 0.7,
    z: model.scale.z * 0.7,
    ease: 'none',
    scrollTrigger: {
      trigger: '#about',
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
    },
  });

  // Robot rotates to "look" at the About content
  gsap.to(model.rotation, {
    y: Math.PI * 0.3,
    ease: 'none',
    scrollTrigger: {
      trigger: '#about',
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
    },
  });

  // ===== ABOUT → PROJECTS transition =====
  // Robot zooms in dramatically and tilts forward
  gsap.to(model.position, {
    x: 0,
    y: -0.2,
    z: 1.5,
    ease: 'none',
    scrollTrigger: {
      trigger: '#projects',
      start: 'top 90%',
      end: 'top 30%',
      scrub: 1.5,
    },
  });

  gsap.to(model.rotation, {
    y: -Math.PI * 0.5,
    x: 0.15,
    ease: 'none',
    scrollTrigger: {
      trigger: '#projects',
      start: 'top 90%',
      end: 'top 30%',
      scrub: 1.5,
    },
  });

  gsap.to(model.scale, {
    x: model.scale.x * 1.3 / 0.7,
    y: model.scale.y * 1.3 / 0.7,
    z: model.scale.z * 1.3 / 0.7,
    ease: 'none',
    scrollTrigger: {
      trigger: '#projects',
      start: 'top 90%',
      end: 'top 30%',
      scrub: 1.5,
    },
  });

  // ===== PROJECTS → CONTACT transition =====
  // Robot sweeps to the right, facing the contact form
  gsap.to(model.position, {
    x: 2,
    y: 0.5,
    z: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 90%',
      end: 'top 30%',
      scrub: 1.5,
    },
  });

  gsap.to(model.rotation, {
    y: Math.PI * 1.2,
    x: -0.1,
    ease: 'none',
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 90%',
      end: 'top 30%',
      scrub: 1.5,
    },
  });

  // Global scroll progress tracker for floating effect
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      scrollProgress = self.progress;
    },
  });
}

/**
 * Mouse parallax — model subtly follows cursor
 */
function setupMouseParallax() {
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });
}

/**
 * Optimized render loop
 */
function animate() {
  animationId = requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  if (mixer) mixer.update(delta);

  if (model) {
    // Gentle floating bob synced to elapsed time
    model.position.y += Math.sin(elapsed * 0.8) * 0.001;

    // Subtle mouse parallax (lerped for smoothness)
    const parallaxStrength = 0.08;
    camera.position.x += (mouseX * parallaxStrength - camera.position.x) * 0.02;
    camera.position.y += (0.3 + mouseY * parallaxStrength * 0.5 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  }

  renderer.render(scene, camera);
}

/**
 * Handle resize
 */
function onWindowResize() {
  if (!camera || !renderer) return;
  const canvas = document.getElementById('modelCanvas');
  if (!canvas) return;

  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

function showFallbackImage() {
  const canvas = document.getElementById('modelCanvas');
  const fallback = document.getElementById('fallbackImage');
  const loading = document.getElementById('loading');
  if (canvas) canvas.style.display = 'none';
  if (fallback) fallback.style.display = 'block';
  if (loading) loading.style.display = 'none';
}

function hideFallbackImage() {
  const fallback = document.getElementById('fallbackImage');
  const loading = document.getElementById('loading');
  if (fallback) fallback.style.display = 'none';
  if (loading) loading.style.display = 'none';
}

/**
 * Cleanup
 */
export function disposeViewer() {
  if (animationId) cancelAnimationFrame(animationId);
  if (renderer) {
    renderer.dispose();
    renderer.forceContextLoss();
    renderer = null;
  }
  if (model) {
    scene.remove(model);
    model = null;
  }
  scene = null;
  camera = null;
  mixer = null;
}
