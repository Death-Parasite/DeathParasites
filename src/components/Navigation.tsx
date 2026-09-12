import React, { useEffect, useState } from 'react';
import { useExperienceStore } from '@/hooks/useExperienceStore';
import './Navigation.css';

const NAV_ITEMS = [
  { id: 'hero', label: 'NEXTGEN' },
  { id: 'story', label: 'STORY' },
  { id: 'characters', label: 'CHARACTERS' },
  { id: 'environments', label: 'ENVIRONMENTS' },
  { id: 'team', label: 'TEAM' },
  { id: 'contact', label: 'CONTACT' },
];

export const Navigation: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const introComplete = useExperienceStore((s) => s.introComplete);
  const navOpen = useExperienceStore((s) => s.navOpen);
  const toggleNav = useExperienceStore((s) => s.toggleNav);
  const setNavOpen = useExperienceStore((s) => s.setNavOpen);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setNavOpen(false);
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && navOpen) setNavOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [navOpen, setNavOpen]);

  if (!introComplete) return null;

  return (
    <>
      <nav
        className={`nav ${scrolled ? 'nav--scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="nav__inner">
          <div className="nav__brand">
            <img src="/assets/logo.jpg" alt="Death Parasites" style={{ height: '32px', mixBlendMode: 'screen' }} />
          </div>

          {/* Desktop nav */}
          <ul className="nav__links" role="menubar">
            {NAV_ITEMS.map((item) => (
              <li key={item.id} role="none">
                <button
                  className="nav__link font-mono"
                  onClick={() => scrollToSection(item.id)}
                  role="menuitem"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            className={`nav__hamburger ${navOpen ? 'nav__hamburger--open' : ''}`}
            onClick={toggleNav}
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={navOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {navOpen && (
        <div className="nav-overlay" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="nav-overlay__backdrop" onClick={() => setNavOpen(false)} />
          <div className="nav-overlay__content">
            <ul className="nav-overlay__links">
              {NAV_ITEMS.map((item, i) => (
                <li key={item.id} style={{ animationDelay: `${i * 80}ms` }}>
                  <button
                    className="nav-overlay__link font-display"
                    onClick={() => scrollToSection(item.id)}
                  >
                    <span className="nav-overlay__link-index font-mono">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};
