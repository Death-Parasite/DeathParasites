import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, Preload } from '@react-three/drei';
import { useExperienceStore } from '@/hooks/useExperienceStore';
import { detectQualityTier, getPerformanceConfig } from '@/utils/performance';
import { BloodSpores } from '@/scene/particles/BloodSpores';
import { CinematicCamera } from '@/scene/core/CinematicCamera';
import { AtmosphericFog } from '@/scene/core/AtmosphericFog';
import { DepthFrame } from '@/scene/frames/DepthFrame';
import { LightBeam, GlowSphere, VolumetricRays } from '@/scene/core/Atmosphere';
import { PostEffects } from '@/scene/postprocessing/PostEffects';
import { SceneErrorBoundary } from '@/scene/core/SceneErrorBoundary';
import { FloatingImage } from '@/scene/components/FloatingImage';
import { InteractiveProp } from '@/scene/components/InteractiveProp';

const SceneContent: React.FC = () => {
  const qualityTier = useExperienceStore((s) => s.qualityTier);
  const config = getPerformanceConfig(qualityTier);
  const scrollProgress = useExperienceStore((s) => s.scrollProgress);

  return (
    <>
      <CinematicCamera />
      <AtmosphericFog />

      {/* Cinematic Lighting rig */}
      <ambientLight intensity={0.05} color="#2a0b0b" />
      <directionalLight position={[5, 10, 5]} intensity={0.4} color="#ff1e1e" />
      <directionalLight position={[-3, 5, -8]} intensity={0.2} color="#8a9bb4" />
      <pointLight position={[0, 2, 0]} intensity={0.8} color="#bf0808" distance={15} decay={2} />
      <pointLight position={[-4, 1, -10]} intensity={0.5} color="#ff3333" distance={15} decay={2} />
      
      {/* 3D Images - The $10k Premium Upgrade */}
      {/* Hero Poster - Starts roughly around Z=0, moves up as you scroll */}
      <FloatingImage 
        url="./assets/dp01poster.jpg" 
        position={[2.5, 0, -2]} 
        size={[3, 4.5]} 
        scrollOffset={scrollProgress}
        scrollMultiplier={20}
      />
      
      {/* Character Portraits - positioned further back in Z, waiting to be scrolled up */}
      <FloatingImage 
        url="./assets/IMG-20260619-WA0027.jpg" 
        position={[-3.5, -25, -5]} 
        size={[2.5, 3.5]} 
        scrollOffset={scrollProgress}
        scrollMultiplier={35} // They move up faster for parallax
      />
      
      <FloatingImage 
        url="./assets/IMG-20260620-WA0005(1).jpg" 
        position={[0, -28, -6]} 
        size={[2.5, 3.5]} 
        scrollOffset={scrollProgress}
        scrollMultiplier={37} 
      />

      <FloatingImage 
        url="./assets/Cpauter.1" 
        position={[3.5, -30, -7]} 
        size={[2.5, 3.5]} 
        scrollOffset={scrollProgress}
        scrollMultiplier={39} 
      />

      {/* The 3D Prop that hangs and falls */}
      <InteractiveProp />

      {/* Frame corridor — primary spatial structure */}
      <DepthFrame position={[0, 0, 2]} size={[7, 4.5]} color="#3a1010" opacity={0.6} />
      <DepthFrame position={[0, 0, -4]} size={[5.5, 3.8]} color="#2a0b0b" opacity={0.5} />
      <DepthFrame position={[0.3, -0.1, -10]} size={[5, 3.5]} color="#1c0505" opacity={0.4} />
      <DepthFrame position={[-0.2, 0.1, -16]} size={[4.5, 3]} color="#150303" opacity={0.3} />
      <DepthFrame position={[0, 0, -22]} size={[5.5, 3.5]} color="#0d0202" opacity={0.25} />
      <DepthFrame position={[0.4, -0.2, -28]} size={[4, 2.8]} color="#0a0101" opacity={0.2} />

      {/* Vertical light beams (optimized count) */}
      <LightBeam position={[-2.5, 1, -5]} width={0.02} height={10} opacity={0.08} color="#bf0808" />
      <LightBeam position={[2.8, 0.5, -11]} width={0.015} height={12} opacity={0.06} color="#8b9bb4" />

      {/* Volumetric rays from above */}
      {qualityTier !== 'low' && <VolumetricRays count={5} spread={10} position={[0, 5, -15]} />}

      {/* Glow points — marker/signal lights */}
      <GlowSphere position={[-3, 2, -3]} radius={0.04} color="#bf0808" intensity={0.6} />
      <GlowSphere position={[3.2, -1, -8]} radius={0.03} color="#8b9bb4" intensity={0.5} />
      <GlowSphere position={[0, 3, -14]} radius={0.05} color="#ff1e1e" intensity={0.4} />

      {/* Blood Spores (Instanced mesh for extremely high performance) */}
      {config.enableParticles && <BloodSpores />}

      {/* Post-processing */}
      <PostEffects />

      <Preload all />
    </>
  );
};

export const SceneSetup: React.FC = () => {
  const setQualityTier = useExperienceStore((s) => s.setQualityTier);
  const qualityTier = useExperienceStore((s) => s.qualityTier);
  const config = getPerformanceConfig(qualityTier);

  useEffect(() => {
    const tier = detectQualityTier();
    setQualityTier(tier);
  }, [setQualityTier]);

  return (
    <SceneErrorBoundary>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <Canvas
          dpr={config.dpr}
          camera={{ position: [0, 0, 5], fov: 55, near: 0.1, far: 100 }}
          gl={{
            antialias: qualityTier !== 'low',
            alpha: false,
            powerPreference: 'high-performance',
            stencil: false,
          }}
          style={{ background: '#040101' }}
        >
          <Suspense fallback={null}>
            <SceneContent />
          </Suspense>
          <AdaptiveDpr pixelated />
        </Canvas>
      </div>
    </SceneErrorBoundary>
  );
};
