import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CinematicFrame } from '@/components/CinematicFrame';
import { SectionTitle } from '@/components/SectionTitle';
import { characters } from '@/data/characters';
import { useExperienceStore } from '@/hooks/useExperienceStore';
import './CharactersSection.css';

gsap.registerPlugin(ScrollTrigger);

export const CharactersSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const openDossier = useExperienceStore((s) => s.openDossier);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from('.character-card', {
        opacity: 0,
        y: 80,
        rotateX: 5,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 65%',
          toggleActions: 'play none none none',
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="characters" className="characters" aria-label="Characters">
      <div className="characters__inner">
        <SectionTitle
          title="Cast"
          subtitle="Operational personnel"
          label="CHARACTERS // DOSSIERS"
        />

        <div className="characters__grid">
          {characters.map((char) => (
            <button
              key={char.id}
              className="character-card"
              onClick={() => openDossier(char.id)}
              aria-label={`View dossier for ${char.name}`}
            >
              <CinematicFrame variant="dossier" label={`SUBJ-${String(char.index).padStart(2, '0')}`} metadata={`B. ${char.birthYear}`}>
                <div className="character-card__inner">
                  <span className="character-card__index font-display" aria-hidden="true">
                    {String(char.index).padStart(2, '0')}
                  </span>

                  <div className="character-card__portrait" style={{ background: 'transparent' }}>
                    {/* The 3D WebGL Portrait shows through this transparent window */}
                  </div>

                  <div className="character-card__info">
                    <h3 className="character-card__name font-display">{char.name}</h3>
                    <span className="character-card__role font-mono">{char.role}</span>
                  </div>

                  <div className="character-card__hint font-mono">
                    VIEW DOSSIER →
                  </div>
                </div>
              </CinematicFrame>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
