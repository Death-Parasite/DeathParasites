import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionTitle } from '@/components/SectionTitle';
import { siteConfig } from '@/data/siteConfig';
import './ContactSection.css';

gsap.registerPlugin(ScrollTrigger);

const SocialIcon: React.FC<{ icon: string }> = ({ icon }) => {
  const icons: Record<string, React.ReactNode> = {
    instagram: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
    whatsapp: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
        <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1zM14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1z" />
      </svg>
    ),
    facebook: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
    youtube: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.6C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75,15.02 15.5,12 9.75,8.98" />
      </svg>
    ),
  };
  return <>{icons[icon] || null}</>;
};

export const ContactSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from('.contact__item', {
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="contact" aria-label="Contact">
      <div className="contact__inner">
        <SectionTitle
          title="Contact"
          label="GET IN TOUCH"
        />

        <div className="contact__content">
          <div className="contact__email contact__item">
            <span className="contact__label font-mono">EMAIL</span>
            <a href={`mailto:${siteConfig.email}`} className="contact__email-link">
              {siteConfig.email}
            </a>
          </div>

          <div className="contact__socials contact__item">
            <span className="contact__label font-mono">FOLLOW</span>
            <div className="contact__social-grid">
              {siteConfig.socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="contact__social-link"
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SocialIcon icon={social.icon} />
                  <span className="contact__social-name font-mono">{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
