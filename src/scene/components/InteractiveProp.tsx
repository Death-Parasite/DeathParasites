import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll, PresentationControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useExperienceStore } from '@/hooks/useExperienceStore';

// Preload the model
useGLTF.preload('./assets/model/pipe_wrench_2k.gltf');

export const InteractiveProp: React.FC = () => {
  const meshRef = useRef<THREE.Group>(null);
  const scrollProgress = useExperienceStore((s) => s.scrollProgress);
  const [hovered, setHovered] = useState(false);
  const { viewport } = useThree();

  const { scene } = useGLTF('./assets/model/pipe_wrench_2k.gltf');

  // Animation logic: 
  // It starts hanging in the air (Y = high up)
  // As scrollProgress crosses a threshold (like passing the Characters section), 
  // it rapidly falls to the ground.
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Threshold where the prop falls (e.g. 0.45 means after characters)
    const fallThreshold = 0.45;
    
    // Target Y position based on scroll
    let targetY = 10; // High up (hanging)
    let targetRotZ = Math.sin(state.clock.elapsedTime) * 0.1; // Swinging gently

    if (scrollProgress > fallThreshold) {
      // It falls down!
      targetY = -35 + (scrollProgress * 40); // Matches the parallax of the floor
      targetRotZ = Math.PI / 2; // Lies flat on the ground
    }

    // Smooth physics interpolation
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, delta * 4);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRotZ, delta * 3);
    
    // Also add a little floating if not fallen
    if (scrollProgress <= fallThreshold) {
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group position={[0, 10, -8]} ref={meshRef}>
      {/* PresentationControls allows the user to grab and spin it */}
      <PresentationControls
        global={false} 
        cursor={true}
        snap={true} // Snaps back to original rotation when released
        speed={2}
        zoom={1.5}
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 4, Math.PI / 4]} // Vertical limits
        azimuth={[-Math.PI / 4, Math.PI / 4]} // Horizontal limits
      >
        <primitive 
          object={scene} 
          scale={15} 
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        />
      </PresentationControls>
    </group>
  );
};
