import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '@/hooks/useExperienceStore';

interface DustParticlesProps {
  count?: number;
  area?: [number, number, number];
  speed?: number;
  opacity?: number;
  size?: number;
}

export const DustParticles: React.FC<DustParticlesProps> = ({
  count: propCount,
  area = [20, 15, 30],
  speed = 0.15,
  opacity = 0.4,
  size = 0.02,
}) => {
  const meshRef = useRef<THREE.Points>(null);
  const qualityTier = useExperienceStore((s) => s.qualityTier);
  
  const count = propCount ?? (qualityTier === 'high' ? 600 : qualityTier === 'medium' ? 300 : 100);

  const { positions, velocities, opacities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const opa = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * area[0];
      pos[i * 3 + 1] = (Math.random() - 0.5) * area[1];
      pos[i * 3 + 2] = (Math.random() - 0.5) * area[2];

      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = Math.random() * 0.005 + 0.002;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;

      opa[i] = Math.random() * 0.5 + 0.2;
    }
    return { positions: pos, velocities: vel, opacities: opa };
  }, [count, area]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const posAttr = meshRef.current.geometry.attributes.position;
    const posArray = posAttr.array as Float32Array;

    const dt = Math.min(delta, 0.05);
    const s = speed * dt * 60;

    for (let i = 0; i < count; i++) {
      posArray[i * 3] += velocities[i * 3] * s;
      posArray[i * 3 + 1] += velocities[i * 3 + 1] * s;
      posArray[i * 3 + 2] += velocities[i * 3 + 2] * s;

      // Wrap around
      if (posArray[i * 3 + 1] > area[1] / 2) {
        posArray[i * 3 + 1] = -area[1] / 2;
        posArray[i * 3] = (Math.random() - 0.5) * area[0];
        posArray[i * 3 + 2] = (Math.random() - 0.5) * area[2];
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-opacity"
          count={count}
          array={opacities}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color="#c8c0b0"
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
