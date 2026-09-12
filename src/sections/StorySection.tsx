import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '@/data/siteConfig';
import './StorySection.css';

gsap.registerPlugin(ScrollTrigger);

export const StorySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !textRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Background glow effect
      gsap.fromTo('.story__glow', 
        { opacity: 0, scale: 0.8 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 2, 
          ease: 'sine.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 60%',
          }
        }
      );

      // Text line reveal
      gsap.fromTo('.story__text span',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 75%',
          }
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  // Split text into words for staggered animation
  const words = siteConfig.story.split(' ');

  return (
    <section ref={sectionRef} id="story" className="story" aria-label="Story">
      <div className="story__inner">
        <div className="story__glow" aria-hidden="true" />
        
        <div className="story__header">
          <span className="story__tag font-mono">CASE FILE: 001</span>
          <div className="story__line" />
          <span className="story__status font-mono">CLASSIFIED</span>
        </div>

        <div className="story__content" ref={textRef}>
          <p className="story__text">
            {words.map((word, i) => (
              <span key={i}>{word} </span>
            ))}
          </p>
        </div>

        <div className="story__footer">
          <div className="story__box font-mono">AUTHORIZATION REQUIRED</div>
        </div>
      </div>
    </section>
  );
};
