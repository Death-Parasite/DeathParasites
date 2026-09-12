import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '@/hooks/useExperienceStore';

interface CinematicCameraProps {
  mouseInfluence?: number;
}

export const CinematicCamera: React.FC<CinematicCameraProps> = ({
  mouseInfluence = 0.3,
}) => {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef(new THREE.Vector3(0, 0, 5));
  const scrollProgress = useExperienceStore((s) => s.scrollProgress);
  const qualityTier = useExperienceStore((s) => s.qualityTier);

  useFrame(() => {
    if (qualityTier === 'low') return;

    // Smooth mouse following
    const targetX = mouseRef.current.x * mouseInfluence;
    const targetY = mouseRef.current.y * mouseInfluence;

    // Scroll-driven Z movement through the corridor
    const scrollZ = 5 - scrollProgress * 45;
    targetRef.current.set(targetX, targetY, scrollZ);

    camera.position.lerp(targetRef.current, 0.03);
    camera.lookAt(0, 0, scrollZ - 10);
  });

  React.useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouse, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return null;
};
