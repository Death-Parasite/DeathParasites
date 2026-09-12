import React, { useEffect, useRef, useState } from 'react';
import { useExperienceStore } from '@/hooks/useExperienceStore';
import './IntroSection.css';

export const IntroSection: React.FC = () => {
  const setIntroComplete = useExperienceStore((s) => s.setIntroComplete);
  const introComplete = useExperienceStore((s) => s.introComplete);
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'black' | 'reveal' | 'studio' | 'title' | 'done'>('black');

  useEffect(() => {
    // Check for repeat visit
    const visited = sessionStorage.getItem('dp-visited');
    if (visited) {
      setPhase('done');
      setIntroComplete(true);
      return;
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setPhase('done');
      setIntroComplete(true);
      sessionStorage.setItem('dp-visited', '1');
      return;
    }

    // Timeline
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase('reveal'), 1800));
    timers.push(setTimeout(() => setPhase('studio'), 3200));
    timers.push(setTimeout(() => setPhase('title'), 5000));
    timers.push(setTimeout(() => {
      setPhase('done');
      setIntroComplete(true);
      sessionStorage.setItem('dp-visited', '1');
    }, 7000));

    return () => timers.forEach(clearTimeout);
  }, [setIntroComplete]);

  // Allow skip on click/key
  const skipIntro = () => {
    if (phase !== 'done') {
      setPhase('done');
      setIntroComplete(true);
      sessionStorage.setItem('dp-visited', '1');
    }
  };

  if (introComplete && phase === 'done') return null;

  return (
    <div
      ref={containerRef}
      className={`intro ${phase === 'done' ? 'intro--exit' : ''}`}
      onClick={skipIntro}
      onKeyDown={(e) => e.key === 'Enter' && skipIntro()}
      role="button"
      tabIndex={0}
      aria-label="Skip intro"
    >
      <div className="intro__vignette" aria-hidden="true" />

      {/* Phase: Reveal - subtle light */}
      <div className={`intro__reveal ${phase === 'reveal' || phase === 'studio' || phase === 'title' ? 'intro__reveal--active' : ''}`}>
        <div className="intro__reveal-line" aria-hidden="true" />
      </div>

      {/* Phase: Studio name */}
      <div className={`intro__studio ${phase === 'studio' || phase === 'title' ? 'intro__studio--active' : ''}`}>
        <span className="intro__studio-label font-mono">PRESENTED BY</span>
        <span className="intro__studio-name font-display">NEXTGENGAMESTUDIOS</span>
      </div>

      {/* Phase: Title */}
      <div className={`intro__title ${phase === 'title' ? 'intro__title--active' : ''}`}>
        <img src="/assets/logo.jpg" alt="Death Parasites" className="intro__logo" />
      </div>

      {/* Skip hint */}
      <div className={`intro__skip font-mono ${phase !== 'black' ? 'intro__skip--visible' : ''}`}>
        CLICK TO SKIP
      </div>
    </div>
  );
};
