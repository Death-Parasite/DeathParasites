import React from 'react';
import './CinematicFrame.css';

interface CinematicFrameProps {
  children: React.ReactNode;
  label?: string;
  metadata?: string;
  className?: string;
  variant?: 'default' | 'dossier' | 'poster' | 'archive';
  corners?: boolean;
  measurements?: boolean;
}

export const CinematicFrame: React.FC<CinematicFrameProps> = ({
  children,
  label,
  metadata,
  className = '',
  variant = 'default',
  corners = true,
  measurements = false,
}) => {
  return (
    <div className={`cinematic-frame cinematic-frame--${variant} ${className}`}>
      {corners && (
        <>
          <span className="cinematic-frame__corner cinematic-frame__corner--tl" aria-hidden="true" />
          <span className="cinematic-frame__corner cinematic-frame__corner--tr" aria-hidden="true" />
          <span className="cinematic-frame__corner cinematic-frame__corner--bl" aria-hidden="true" />
          <span className="cinematic-frame__corner cinematic-frame__corner--br" aria-hidden="true" />
        </>
      )}
      {measurements && (
        <div className="cinematic-frame__measurements" aria-hidden="true">
          <span className="cinematic-frame__measure-h" />
          <span className="cinematic-frame__measure-v" />
        </div>
      )}
      {label && (
        <span className="cinematic-frame__label font-mono" aria-hidden="true">{label}</span>
      )}
      <div className="cinematic-frame__content">
        {children}
      </div>
      {metadata && (
        <span className="cinematic-frame__metadata font-mono" aria-hidden="true">{metadata}</span>
      )}
    </div>
  );
};
