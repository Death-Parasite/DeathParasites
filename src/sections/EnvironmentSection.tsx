import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionTitle } from '@/components/SectionTitle';
import './EnvironmentSection.css';

gsap.registerPlugin(ScrollTrigger);

const images = [
  { id: '1', src: '/assets/game_1.jpg', alt: 'Game Asset Block' },
  { id: '2', src: '/assets/game_2.jpg', alt: 'Pale Hand Asset' },
  { id: '3', src: '/assets/game_3.jpg', alt: 'Jerrycan Environment' },
  { id: '4', src: '/assets/game_4.jpg', alt: 'Gloved Arms Asset' },
];

export const EnvironmentSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    const track = trackRef.current;
    if (!el || !track) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Horizontal scroll magic
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth + window.innerWidth * 0.1),
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => `+=${track.scrollWidth - window.innerWidth + window.innerWidth * 0.1}`,
          scrub: 1, // Smooth scrub
          pin: true,
          invalidateOnRefresh: true,
        }
      });
      
      // Reveal animation for images
      gsap.from('.env__image-wrapper', {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 50%',
        }
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="environments" className="env" aria-label="Game Environments & Assets">
      <div className="env__header">
        <SectionTitle
          title="Assets"
          subtitle="In-engine development"
          label="ENV // ASSETS"
        />
      </div>
      
      <div className="env__viewport">
        <div className="env__track" ref={trackRef}>
          {images.map((img, i) => (
            <div key={img.id} className="env__image-wrapper">
              <div className="env__image-metadata font-mono">
                <span>ASSET_{String(i + 1).padStart(2, '0')}</span>
                <span>RAW_RENDER</span>
              </div>
              <img 
                src={img.src} 
                alt={img.alt} 
                className="env__image" 
                onLoad={() => ScrollTrigger.refresh()}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
