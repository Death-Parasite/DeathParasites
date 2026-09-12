import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useExperienceStore } from '@/hooks/useExperienceStore';
import { CinematicFrame } from '@/components/CinematicFrame';
import { siteConfig } from '@/data/siteConfig';
import './HeroSection.css';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const introComplete = useExperienceStore((s) => s.introComplete);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !introComplete) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set(el.querySelectorAll('.hero__animate'), { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // High-end cinematic reveal for text
      gsap.fromTo(
        '.hero__animate',
        { y: 60, opacity: 0, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
        {
          y: 0,
          opacity: 1,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          duration: 1.4,
          stagger: 0.15,
          ease: 'expo.out',
          delay: 0.2, // wait for intro to clear
        }
      );

      // Subtle continuous floating for the poster frame
      gsap.to('.hero__poster-frame', {
        y: -15,
        rotationZ: 1,
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
      
      // Parallax poster on scroll
      gsap.to('.hero__poster-frame', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [introComplete]);

  return (
    <section ref={sectionRef} id="hero" className="hero" aria-label="Hero">
      <div className="hero__content">
        <div className="hero__text">
          <span className="hero__label font-mono hero__animate">UPCOMING TITLE</span>
          
          <div className="hero__logo-wrapper hero__animate" style={{ display: 'none' }}>
            <img src="/assets/logo.jpg" alt="Death Parasites Logo" className="hero__logo" />
          </div>

          <h1 className="hero__title font-display hero__animate" style={{ color: 'white', fontSize: 'clamp(3rem, 12vw, 9rem)', letterSpacing: '0.05em' }}>
            DEATH PARASITES<span className="hero__tm">™</span>
          </h1>
          
          <p className="hero__chapter hero__animate" style={{ marginTop: '1rem' }}>{siteConfig.chapter}</p>

          <div className="hero__meta hero__animate">
            <div className="hero__meta-item">
              <span className="hero__meta-label font-mono">PRESENTED BY</span>
              <span className="hero__meta-value">{siteConfig.presentedBy}</span>
            </div>
            <div className="hero__meta-item">
              <span className="hero__meta-label font-mono">PRODUCED BY</span>
              <span className="hero__meta-value">{siteConfig.producedBy}</span>
            </div>
            <div className="hero__meta-item">
              <span className="hero__meta-label font-mono">RELEASE</span>
              <span className="hero__meta-value">{siteConfig.releaseDate}</span>
            </div>
          </div>
        </div>

        <div className="hero__poster-frame hero__animate">
          {/* We use an empty invisible frame here so the 3D WebGL floating poster can show through perfectly. */}
          <div style={{ width: '100%', height: '100%', border: '1px solid var(--color-border-subtle)', background: 'transparent' }} />
        </div>
      </div>

      <div className="hero__scroll-hint hero__animate" aria-hidden="true">
        <div className="hero__scroll-line" />
        <span className="hero__scroll-text font-mono">SCROLL</span>
      </div>
    </section>
  );
};
