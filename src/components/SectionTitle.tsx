import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './SectionTitle.css';

gsap.registerPlugin(ScrollTrigger);

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  label?: string;
  align?: 'left' | 'center';
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  label,
  align = 'left',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.section-title__label'), {
        opacity: 0,
        y: 10,
        duration: 0.6,
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      });

      gsap.from(el.querySelectorAll('.section-title__text'), {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.15,
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      });

      if (subtitle) {
        gsap.from(el.querySelectorAll('.section-title__subtitle'), {
          opacity: 0,
          y: 20,
          duration: 0.7,
          delay: 0.3,
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        });
      }
    }, el);

    return () => ctx.revert();
  }, [subtitle]);

  return (
    <div ref={containerRef} className={`section-title section-title--${align}`}>
      {label && (
        <span className="section-title__label font-mono">{label}</span>
      )}
      <h2 className="section-title__text font-display">{title}</h2>
      {subtitle && (
        <p className="section-title__subtitle">{subtitle}</p>
      )}
      <div className="section-title__line" aria-hidden="true" />
    </div>
  );
};
