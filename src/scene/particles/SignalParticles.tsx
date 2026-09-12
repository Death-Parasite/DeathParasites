import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '@/hooks/useExperienceStore';

interface SignalParticlesProps {
  count?: number;
}

export const SignalParticles: React.FC<SignalParticlesProps> = ({ count: propCount }) => {
  const meshRef = useRef<THREE.Points>(null);
  const qualityTier = useExperienceStore((s) => s.qualityTier);
  const count = propCount ?? (qualityTier === 'high' ? 200 : qualityTier === 'medium' ? 100 : 40);

  const { positions, speeds, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const phs = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
      spd[i] = 0.5 + Math.random() * 2;
      phs[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, speeds: spd, phases: phs };
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const posAttr = meshRef.current.geometry.attributes.position;
    const posArray = posAttr.array as Float32Array;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const origX = positions[i * 3];
      const origY = positions[i * 3 + 1];
      posArray[i * 3] = origX + Math.sin(t * speeds[i] * 0.3 + phases[i]) * 0.5;
      posArray[i * 3 + 1] = origY + Math.cos(t * speeds[i] * 0.2 + phases[i]) * 0.3;
    }
    posAttr.needsUpdate = true;

    const mat = meshRef.current.material as THREE.PointsMaterial;
    mat.opacity = 0.3 + Math.sin(t * 0.5) * 0.15;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={new Float32Array(positions)} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#5588bb" transparent opacity={0.4} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
};
