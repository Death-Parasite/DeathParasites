import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionTitle } from '@/components/SectionTitle';
import { siteConfig } from '@/data/siteConfig';
import './TeamSection.css';

gsap.registerPlugin(ScrollTrigger);

export const TeamSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from('.team__card', {
        opacity: 0,
        y: 40,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 75%',
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="team" className="team" aria-label="Team">
      <div className="team__inner">
        <SectionTitle
          title="Founders"
          label="THE ARCHITECTS"
        />

        <div className="team__grid">
          {siteConfig.team.map((member, i) => (
            <div key={i} className="team__card">
              <div className="team__card-glow" aria-hidden="true" />
              <div className="team__card-content">
                <span className="team__card-index font-mono">0{i + 1}</span>
                <div className="team__card-info">
                  <h3 className="team__card-name font-display">{member.name}</h3>
                  <div className="team__card-role font-mono">{member.role}</div>
                </div>
                <div className="team__card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
