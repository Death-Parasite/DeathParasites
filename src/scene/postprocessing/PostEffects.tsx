import React from 'react';
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useExperienceStore } from '@/hooks/useExperienceStore';
import { getPerformanceConfig } from '@/utils/performance';

export const PostEffects: React.FC = () => {
  const qualityTier = useExperienceStore((s) => s.qualityTier);
  const config = getPerformanceConfig(qualityTier);

  if (!config.enablePostprocessing) return null;

  const chromaticOffset = new THREE.Vector2(0.0015, 0.0015);

  if (config.enableBloom) {
    return (
      <EffectComposer>
        <Bloom
          intensity={0.2}
          luminanceThreshold={0.5}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={chromaticOffset}
          radialModulation={true}
          modulationOffset={0.5}
        />
        <Vignette
          offset={0.3}
          darkness={0.7}
          blendFunction={BlendFunction.NORMAL}
        />
        <Noise
          premultiply
          blendFunction={BlendFunction.SOFT_LIGHT}
          opacity={0.12}
        />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer>
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={chromaticOffset}
        radialModulation={true}
        modulationOffset={0.5}
      />
      <Vignette
        offset={0.3}
        darkness={0.7}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise
        premultiply
        blendFunction={BlendFunction.SOFT_LIGHT}
        opacity={0.12}
      />
    </EffectComposer>
  );
};
