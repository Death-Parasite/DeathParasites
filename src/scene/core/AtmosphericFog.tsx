import React from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '@/hooks/useExperienceStore';

export const AtmosphericFog: React.FC = () => {
  const qualityTier = useExperienceStore((s) => s.qualityTier);
  const density = qualityTier === 'high' ? 0.03 : 0.04;

  return <fogExp2 attach="fog" color="#040101" density={density} />;
};
