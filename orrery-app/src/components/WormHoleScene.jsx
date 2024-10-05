import React, { useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';

const WormholeScene = ({ onWormholeEnd }) => {
  const asteroid = useLoader(GLTFLoader, '/asteroid.glb');
  const [timeLeft, setTimeLeft] = useState(90);  // 90 seconds for 1.5 minutes

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      onWormholeEnd();  // Call to move to planet scene
    }, 90000); // 90 seconds

    return () => clearInterval(interval);
  }, [onWormholeEnd]);

  useFrame(() => {
    // Animate asteroids flying through the wormhole
  });

  return (
    <div>
      <div className="timer">Time Left: {timeLeft} seconds</div>
      <Canvas>
        {[...Array(50)].map((_, i) => (
          <mesh key={i} position={[Math.random() * 10, Math.random() * 10, -i * 5]}>
            <primitive object={asteroid.scene.clone()} scale={0.05} />
          </mesh>
        ))}
      </Canvas>
    </div>
  );
};

export default WormholeScene;
