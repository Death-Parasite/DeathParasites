import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '@/hooks/useExperienceStore';

interface BloodSporesProps {
  count?: number;
}

export const BloodSpores: React.FC<BloodSporesProps> = ({ count: propCount }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const qualityTier = useExperienceStore((s) => s.qualityTier);
  const count = propCount ?? (qualityTier === 'high' ? 150 : qualityTier === 'medium' ? 75 : 30);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 60
      ),
      rotation: new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ),
      speed: 0.1 + Math.random() * 0.2,
      rotSpeed: (Math.random() - 0.5) * 0.05,
      scale: 0.05 + Math.random() * 0.1,
    }));
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    particles.forEach((p, i) => {
      // Drift upwards and sway
      p.position.y += p.speed * 0.02;
      p.position.x += Math.sin(time * p.speed + i) * 0.01;
      
      // Wrap around vertically
      if (p.position.y > 15) p.position.y = -15;

      p.rotation.x += p.rotSpeed;
      p.rotation.y += p.rotSpeed;

      dummy.position.copy(p.position);
      dummy.rotation.copy(p.rotation);
      dummy.scale.setScalar(p.scale * (0.8 + Math.sin(time * 2 + i) * 0.2)); // Pulsing size
      dummy.updateMatrix();
      
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {/* Octahedron looks like a microscopic cell/spore */}
      <octahedronGeometry args={[1, 1]} />
      <meshStandardMaterial 
        color="#bf0808" 
        emissive="#5a0000"
        emissiveIntensity={0.5}
        roughness={0.2}
        metalness={0.8}
        transparent 
        opacity={0.8} 
        depthWrite={false}
      />
    </instancedMesh>
  );
};
