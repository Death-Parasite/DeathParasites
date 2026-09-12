import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useExperienceStore } from '@/hooks/useExperienceStore';

gsap.registerPlugin(ScrollTrigger);

export const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const introComplete = useExperienceStore((s) => s.introComplete);
  const activeDossier = useExperienceStore((s) => s.activeDossier);
  const navOpen = useExperienceStore((s) => s.navOpen);

  useEffect(() => {
    // Only enable scrolling after intro is complete
    if (!introComplete) return;

    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Luxurious cinematic easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Pause scroll when modal or nav is open
    if (activeDossier || navOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
    };
  }, [introComplete, activeDossier, navOpen]);

  return <>{children}</>;
};
