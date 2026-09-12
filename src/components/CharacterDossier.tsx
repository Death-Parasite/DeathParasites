import React, { useEffect, useRef } from 'react';
import { characters } from '@/data/characters';
import { useExperienceStore } from '@/hooks/useExperienceStore';
import { CinematicFrame } from './CinematicFrame';
import './CharacterDossier.css';

export const CharacterDossier: React.FC = () => {
  const activeDossier = useExperienceStore((s) => s.activeDossier);
  const closeDossier = useExperienceStore((s) => s.closeDossier);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const character = characters.find((c) => c.id === activeDossier);

  // Focus trap and body scroll lock
  useEffect(() => {
    if (!activeDossier) return;

    previousFocusRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';

    // Focus the modal
    requestAnimationFrame(() => {
      modalRef.current?.focus();
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDossier();
        return;
      }

      // Focus trap
      if (e.key === 'Tab') {
        const modal = modalRef.current;
        if (!modal) return;
        const focusable = modal.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [activeDossier, closeDossier]);

  if (!character || !activeDossier) return null;

  return (
    <div
      className="dossier-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Dossier: ${character.name}`}
    >
      <div className="dossier-overlay__backdrop" onClick={closeDossier} aria-hidden="true" />

      <div className="dossier" ref={modalRef} tabIndex={-1}>
        <button
          className="dossier__close"
          onClick={closeDossier}
          aria-label="Close dossier"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <line x1="4" y1="4" x2="20" y2="20" />
            <line x1="20" y1="4" x2="4" y2="20" />
          </svg>
        </button>

        <div className="dossier__content">
          <div className="dossier__header">
            <span className="dossier__index font-display" aria-hidden="true">
              {String(character.index).padStart(2, '0')}
            </span>
            <div className="dossier__classification font-mono" aria-hidden="true">
              PERSONNEL FILE // RESTRICTED ACCESS
            </div>
          </div>

          <div className="dossier__body">
            <div className="dossier__portrait-area">
              <CinematicFrame variant="dossier" label="VISUAL REF" metadata={`ID-${character.id.toUpperCase()}`}>
                {character.image ? (
                  <img src={character.image} alt={character.name} className="dossier__portrait-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className="dossier__portrait-fallback">
                    <span className="dossier__portrait-initial font-display">
                      {character.name[0]}
                    </span>
                    <div className="dossier__portrait-scanlines" aria-hidden="true" />
                  </div>
                )}
              </CinematicFrame>
            </div>

            <div className="dossier__info">
              <h2 className="dossier__name font-display">{character.name}</h2>
              <span className="dossier__role font-mono">{character.role}</span>

              <div className="dossier__stats">
                <div className="dossier__stat">
                  <span className="dossier__stat-label font-mono">HEIGHT</span>
                  <span className="dossier__stat-value">{character.height.display}</span>
                </div>
                <div className="dossier__stat">
                  <span className="dossier__stat-label font-mono">WEIGHT</span>
                  <span className="dossier__stat-value">{character.weight.display}</span>
                </div>
                <div className="dossier__stat">
                  <span className="dossier__stat-label font-mono">BIRTH YEAR</span>
                  <span className="dossier__stat-value">{character.birthYear}</span>
                </div>
              </div>

              <div className="dossier__bio">
                <span className="dossier__bio-label font-mono">PROFILE</span>
                <p className="dossier__bio-text">{character.bio}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
