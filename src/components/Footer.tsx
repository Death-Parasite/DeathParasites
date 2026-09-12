import React from 'react';
import { siteConfig } from '@/data/siteConfig';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__brand-name font-display">NEXTGEN</span>
          <span className="footer__brand-sub font-mono">GAME STUDIOS</span>
        </div>

        <div className="footer__links">
          <a href="#" className="footer__link font-mono">Terms of Use</a>
          <span className="footer__divider" aria-hidden="true">/</span>
          <a href="#" className="footer__link font-mono">Privacy Policy</a>
          <span className="footer__divider" aria-hidden="true">/</span>
          <a href="#contact" className="footer__link font-mono">Contact</a>
        </div>

        <div className="footer__copyright font-mono">
          {siteConfig.copyright}
        </div>

        <div className="footer__line" aria-hidden="true" />
      </div>
    </footer>
  );
};
