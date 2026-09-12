import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DepthFrameProps {
  position?: [number, number, number];
  size?: [number, number];
  borderWidth?: number;
  color?: string;
  opacity?: number;
  rotation?: [number, number, number];
}

export const DepthFrame: React.FC<DepthFrameProps> = ({
  position = [0, 0, 0],
  size = [4, 3],
  borderWidth = 0.02,
  color = '#333333',
  opacity = 0.6,
  rotation = [0, 0, 0],
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [w, h] = size;

  const edgeGeometries = React.useMemo(() => {
    return {
      top: { pos: [0, h / 2, 0] as [number, number, number], scale: [w, borderWidth, borderWidth] as [number, number, number] },
      bottom: { pos: [0, -h / 2, 0] as [number, number, number], scale: [w, borderWidth, borderWidth] as [number, number, number] },
      left: { pos: [-w / 2, 0, 0] as [number, number, number], scale: [borderWidth, h, borderWidth] as [number, number, number] },
      right: { pos: [w / 2, 0, 0] as [number, number, number], scale: [borderWidth, h, borderWidth] as [number, number, number] },
    };
  }, [w, h, borderWidth]);

  // Subtle idle animation
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.2) * 0.005;
  });

  return (
    <group ref={groupRef} position={position} rotation={[rotation[0], rotation[1], rotation[2]]}>
      {Object.values(edgeGeometries).map((edge, i) => (
        <mesh key={i} position={edge.pos}>
          <boxGeometry args={edge.scale} />
          <meshBasicMaterial color={color} transparent opacity={opacity} />
        </mesh>
      ))}
      {/* Corner markers */}
      {[[-1, 1], [1, 1], [-1, -1], [1, -1]].map(([sx, sy], i) => (
        <mesh key={`corner-${i}`} position={[sx * w / 2, sy * h / 2, 0]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color="#555555" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
};
