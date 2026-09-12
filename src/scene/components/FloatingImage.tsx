import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';
import { DistortionMaterial } from '../materials/DistortionMaterial';

// Register the custom material so R3F can use it as a JSX element
extend({ DistortionMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      distortionMaterial: any;
    }
  }
}

interface FloatingImageProps {
  url: string;
  position: [number, number, number];
  size: [number, number];
  scrollOffset?: number; // How much it moves based on global scroll
  scrollMultiplier?: number;
}

export const FloatingImage: React.FC<FloatingImageProps> = ({
  url,
  position,
  size,
  scrollOffset = 0,
  scrollMultiplier = 15,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  const texture = useTexture(url);
  texture.colorSpace = THREE.SRGBColorSpace;

  const [hovered, setHovered] = useState(false);
  const targetHover = useRef(0);

  // Floating physics base
  const randomOffset = useRef(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    const t = state.clock.elapsedTime;
    
    // Smooth hover interpolation
    targetHover.current = THREE.MathUtils.lerp(
      targetHover.current,
      hovered ? 1 : 0,
      delta * 5
    );

    // Apply uniforms
    materialRef.current.uTime = t;
    materialRef.current.uHover = targetHover.current;

    // Apply scroll parallax and floating motion
    const baseFloatY = Math.sin(t * 0.5 + randomOffset.current) * 0.1;
    const baseFloatX = Math.cos(t * 0.3 + randomOffset.current) * 0.05;
    
    // Position based on initial pos + scroll offset
    meshRef.current.position.y = position[1] + baseFloatY + (scrollOffset * scrollMultiplier);
    meshRef.current.position.x = position[0] + baseFloatX;
    
    // Tilt towards mouse slightly
    const targetRotX = (state.pointer.y * Math.PI) / 20;
    const targetRotY = (state.pointer.x * Math.PI) / 20;
    
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, hovered ? targetRotX : 0, delta * 3);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, hovered ? targetRotY : 0, delta * 3);
  });

  const handlePointerMove = (e: any) => {
    if (materialRef.current) {
      materialRef.current.uMouse = e.uv;
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerMove={handlePointerMove}
    >
      <planeGeometry args={[size[0], size[1], 32, 32]} />
      <distortionMaterial 
        ref={materialRef} 
        uTexture={texture} 
        transparent 
      />
    </mesh>
  );
};
