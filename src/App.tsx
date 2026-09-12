import React, { useEffect, Suspense, lazy } from 'react';
import { useExperienceStore } from '@/hooks/useExperienceStore';
import { IntroSection } from '@/sections/IntroSection';
import { HeroSection } from '@/sections/HeroSection';
import { StorySection } from '@/sections/StorySection';
import { CharactersSection } from '@/sections/CharactersSection';
import { EnvironmentSection } from '@/sections/EnvironmentSection';
import { TeamSection } from '@/sections/TeamSection';
import { ContactSection } from '@/sections/ContactSection';
import { Navigation } from '@/components/Navigation';
import { CharacterDossier } from '@/components/CharacterDossier';
import { Footer } from '@/components/Footer';
import { detectQualityTier } from '@/utils/performance';
import { SmoothScroll } from '@/components/SmoothScroll';

// Lazy load the 3D scene - it's heavy
const SceneSetup = lazy(() =>
  import('@/scene/core/SceneSetup').then((m) => ({ default: m.SceneSetup }))
);

export const App: React.FC = () => {
  const introComplete = useExperienceStore((s) => s.introComplete);
  const setQualityTier = useExperienceStore((s) => s.setQualityTier);
  const setScrollProgress = useExperienceStore((s) => s.setScrollProgress);

  // Detect quality tier on mount
  useEffect(() => {
    const tier = detectQualityTier();
    setQualityTier(tier);
  }, [setQualityTier]);

  // Track scroll progress for 3D camera
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      setScrollProgress(progress);
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [setScrollProgress]);

  // Pause animations when tab is hidden
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        document.body.classList.add('page-hidden');
      } else {
        document.body.classList.remove('page-hidden');
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return (
    <SmoothScroll>
      {/* Film grain overlay */}
      <div className="film-grain" aria-hidden="true" />

      {/* 3D Background Scene */}
      <Suspense fallback={null}>
        <SceneSetup />
      </Suspense>

      {/* Cinematic Intro */}
      <IntroSection />

      {/* Navigation */}
      <Navigation />

      {/* Character Dossier Modal */}
      <CharacterDossier />

      {/* Main Content */}
      <main>
        {/* Spacer for visual breathing room after intro */}
        <div style={{ height: introComplete ? 0 : '100vh' }} aria-hidden="true" />

        <HeroSection />

        {/* Black pause between sections */}
        <div className="section-pause" aria-hidden="true" />

        <StorySection />

        <div className="section-pause" aria-hidden="true" />

        <CharactersSection />

        <EnvironmentSection />

        <div className="section-pause section-pause--short" aria-hidden="true" />

        <TeamSection />

        <div className="section-pause section-pause--short" aria-hidden="true" />

        <ContactSection />
      </main>

      <Footer />
    </SmoothScroll>
  );
};
