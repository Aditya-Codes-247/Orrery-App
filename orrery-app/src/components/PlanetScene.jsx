import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Define textures for each planet including diffuse and bump maps
const textures = {
  Mercury: {
    diffuse: './textures/mercury_diffuse.png',
    bump: './textures/mercury_bump.png',
  },
  Venus: {
    diffuse: './textures/venus_diffuse.png',
    bump: './textures/venus_bump.png',
  },
  Earth: {
    diffuse: './textures/earth_diffuse.png',
    bump: './textures/earth_bump.png',
  },
  Mars: {
    diffuse: './textures/mars_diffuse.png',
    bump: './textures/mars_bump.png',
  },
  Jupiter: {
    diffuse: './textures/jupiter_diffuse.png',
    bump: './textures/jupiter_bump.png',
  },
  Saturn: {
    diffuse: './textures/saturn_diffuse.png',
    bump: './textures/saturn_bump.png',
  },
  Uranus: {
    diffuse: './textures/uranus_diffuse.png',
    bump: './textures/uranus_bump.png',
  },
  Neptune: {
    diffuse: './textures/neptune_diffuse.png',
    bump: './textures/neptune_bump.png',
  }
};

const PlanetScene = ({ planet, onExplore, onExit }) => {
  const mountRef = useRef(null); // Reference to the DOM element for mounting the Three.js scene

  useEffect(() => {
    // Setup scene, camera, and renderer
    const w = mountRef.current.clientWidth;
    const h = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    mountRef.current.appendChild(renderer.domElement);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

    // Create Earth group
    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
    scene.add(earthGroup);

    // OrbitControls for camera interaction
    const controls = new OrbitControls(camera, renderer.domElement);

    const detail = 12;
    const loader = new THREE.TextureLoader();
    const geo = new THREE.IcosahedronGeometry(1, detail);
    
    // Load the diffuse and bump texture based on the selected planet
    const material = new THREE.MeshPhongMaterial({
      map: loader.load(textures[planet].diffuse), // Diffuse texture
      bumpMap: loader.load(textures[planet].bump), // Bump texture
      bumpScale: 0.04,
    });
    material.map.colorSpace = THREE.SRGBColorSpace;
    const earthMesh = new THREE.Mesh(geo, material);
    earthGroup.add(earthMesh);

    // Lights mesh (using the same texture for simplicity, adjust as needed)
    const lightsMat = new THREE.MeshBasicMaterial({
      map: loader.load('./textures/earth_lights.jpg'),
      blending: THREE.AdditiveBlending,
    });
    const lightsMesh = new THREE.Mesh(geo, lightsMat);
    earthGroup.add(lightsMesh);

    // Clouds mesh (using the same texture for simplicity, adjust as needed)
    const cloudsMat = new THREE.MeshStandardMaterial({
      map: loader.load('./textures/earth_clouds.jpg'),
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      alphaMap: loader.load('./textures/earth_clouds_trans.jpg'),
    });
    const cloudsMesh = new THREE.Mesh(geo, cloudsMat);
    cloudsMesh.scale.setScalar(1.003);
    earthGroup.add(cloudsMesh);

    // Add sun light
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
    sunLight.position.set(-2, 0.5, 1.5);
    scene.add(sunLight);

    // Animation function
    function animate() {
      requestAnimationFrame(animate);
      earthMesh.rotation.y += 0.002;
      lightsMesh.rotation.y += 0.002;
      cloudsMesh.rotation.y += 0.0025;
      renderer.render(scene, camera);
      controls.update();
    }
    animate();

    // Handle window resizing
    const handleWindowResize = () => {
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleWindowResize);

    // Clean up when the component unmounts
    return () => {
      if (mountRef.current) { // Check if mountRef exists before removing the child
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [planet]); // Include planet in dependencies to reload on change

  return (
    <div className="planet-scene">
      <h1>{planet}</h1>
      <div style={{ width: '100%', height: '500px' }} ref={mountRef}></div>
      <button onClick={onExplore}>Explore {planet}</button>
      <button onClick={onExit}>Return to Menu</button>
    </div>
  );
};

export default PlanetScene;
