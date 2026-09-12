import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GridFloorProps {
  size?: number;
  divisions?: number;
  position?: [number, number, number];
  opacity?: number;
  color?: string;
}

export const GridFloor: React.FC<GridFloorProps> = ({
  size = 40,
  divisions = 40,
  position = [0, -3, -15],
  opacity = 0.12,
  color = '#1a1a2e',
}) => {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (!gridRef.current) return;
    gridRef.current.position.z = position[2] + Math.sin(state.clock.elapsedTime * 0.1) * 0.5;
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[size, divisions, color, color]}
      position={position}
      rotation={[0, 0, 0]}
      material-transparent
      material-opacity={opacity}
    />
  );
};

interface LightBeamProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  color?: string;
  opacity?: number;
}

export const LightBeam: React.FC<LightBeamProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 0.02,
  height = 8,
  color = '#c4a35a',
  opacity = 0.08,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = opacity * (0.7 + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.3);
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
};

interface FloatingPlaneProps {
  position: [number, number, number];
  size: [number, number];
  color?: string;
  opacity?: number;
  speed?: number;
  amplitude?: number;
}

export const FloatingPlane: React.FC<FloatingPlaneProps> = ({
  position,
  size,
  color = '#111118',
  opacity = 0.4,
  speed = 0.3,
  amplitude = 0.15,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = initialY + Math.sin(state.clock.elapsedTime * speed) * amplitude;
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.02;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={size} />
      <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
};

interface GlowSphereProps {
  position: [number, number, number];
  radius?: number;
  color?: string;
  intensity?: number;
}

export const GlowSphere: React.FC<GlowSphereProps> = ({
  position,
  radius = 0.05,
  color = '#c4a35a',
  intensity = 0.6,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + position[0] * 10) * 0.3;
    meshRef.current.scale.setScalar(scale);
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = intensity * (0.5 + Math.sin(state.clock.elapsedTime * 1.5) * 0.5);
  });

  return (
    <>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[radius, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={intensity} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <pointLight position={position} color={color} intensity={0.3} distance={5} />
    </>
  );
};

interface VolumetricRaysProps {
  count?: number;
  spread?: number;
  position?: [number, number, number];
}

export const VolumetricRays: React.FC<VolumetricRaysProps> = ({
  count = 5,
  spread = 8,
  position = [0, 4, -10],
}) => {
  const raysData = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: (i - count / 2) * (spread / count) + (Math.random() - 0.5) * 2,
      z: position[2] + (Math.random() - 0.5) * 10,
      rotZ: (Math.random() - 0.5) * 0.3,
      width: 0.015 + Math.random() * 0.02,
      height: 6 + Math.random() * 6,
      opacity: 0.03 + Math.random() * 0.05,
    }));
  }, [count, spread, position]);

  return (
    <group>
      {raysData.map((ray, i) => (
        <LightBeam
          key={i}
          position={[ray.x, position[1], ray.z]}
          rotation={[0, 0, ray.rotZ]}
          width={ray.width}
          height={ray.height}
          opacity={ray.opacity}
          color="#8888aa"
        />
      ))}
    </group>
  );
};
