import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import spline from './spline.js'; // Make sure to have spline.js with your curve logic

extend({ EffectComposer, RenderPass, UnrealBloomPass });

const WormholeScene = ({ onWormholeEnd }) => {
  const [timeLeft, setTimeLeft] = useState(90); // Timer for wormhole duration

  // Timer countdown logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    const timer = setTimeout(() => {
      clearInterval(interval);
      onWormholeEnd(); // Trigger the end of the wormhole after 90 seconds
    }, 90000); // 90 seconds

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onWormholeEnd]);

  return (
    <>
      <div className="timer">Time Left: {timeLeft} seconds</div>
      <Canvas
        camera={{ fov: 75, position: [0, 0, 5], near: 0.1, far: 1000 }}
        style={{ height: '100vh', width: '100vw' }}
      >
        <Wormhole />
      </Canvas>
    </>
  );
};

function Wormhole() {
  const { scene, camera, gl } = useThree();
  const composerRef = useRef();

  // Initialize Orbit Controls
  const controlsRef = useRef();
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enableDamping = true;
      controlsRef.current.dampingFactor = 0.03;
    }
  }, []);

  // Setup post-processing (bloom effect)
  useEffect(() => {
    const composer = new EffectComposer(gl);
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 100);
    bloomPass.threshold = 0.002;
    bloomPass.strength = 3.5;
    bloomPass.radius = 0;

    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    composerRef.current = composer;

    const onResize = () => {
      const { innerWidth, innerHeight } = window;
      composer.setSize(innerWidth, innerHeight);
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      gl.setSize(innerWidth, innerHeight);
    };

    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, [scene, camera, gl]);

  // Tube geometry and box creation (wormhole)
  const tubeRef = useRef();
  useEffect(() => {
    const tubeGeo = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);
    const edges = new THREE.EdgesGeometry(tubeGeo, 0.2);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const tubeLines = new THREE.LineSegments(edges, lineMat);
    scene.add(tubeLines);

    const numBoxes = 55;
    const size = 0.075;
    const boxGeo = new THREE.BoxGeometry(size, size, size);
    for (let i = 0; i < numBoxes; i += 1) {
      const boxMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true
      });
      const box = new THREE.Mesh(boxGeo, boxMat);
      const p = (i / numBoxes + Math.random() * 0.1) % 1;
      const pos = tubeGeo.parameters.path.getPointAt(p);
      pos.x += Math.random() - 0.4;
      pos.z += Math.random() - 0.4;
      box.position.copy(pos);
      const rote = new THREE.Vector3(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      box.rotation.set(rote.x, rote.y, rote.z);
      const edges = new THREE.EdgesGeometry(boxGeo, 0.2);
      const color = new THREE.Color().setHSL(0.7 - p, 1, 0.5);
      const lineMat = new THREE.LineBasicMaterial({ color });
      const boxLines = new THREE.LineSegments(edges, lineMat);
      boxLines.position.copy(pos);
      boxLines.rotation.set(rote.x, rote.y, rote.z);
      scene.add(boxLines);
    }

    tubeRef.current = tubeGeo;
  }, [scene]);

  // Animate the camera moving along the wormhole
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * 0.1;
    const looptime = 10 * 1000;
    const p = (time % looptime) / looptime;
    const pos = tubeRef.current?.parameters.path.getPointAt(p);
    const lookAt = tubeRef.current?.parameters.path.getPointAt((p + 0.03) % 1);

    if (pos && lookAt) {
      camera.position.copy(pos);
      camera.lookAt(lookAt);
    }

    composerRef.current?.render();
  });

  return <OrbitControls ref={controlsRef} />;
}

export default WormholeScene;
