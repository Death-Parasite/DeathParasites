import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import './CustomCursor.css';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined') return;

    // We only want custom cursor on non-touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    document.documentElement.classList.add('custom-cursor-enabled');

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    // Set initial positions quickly
    gsap.set([cursor, follower], { xPercent: -50, yPercent: -50 });

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Immediate update for the tiny dot
      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: 'power2.out',
      });

      // Liquid trailing effect for the follower
      gsap.to(follower, {
        x: mouseX,
        y: mouseY,
        duration: 0.8,
        ease: 'expo.out',
      });
    };

    const onHoverEnter = () => {
      gsap.to(follower, { scale: 2.5, opacity: 0.1, backgroundColor: '#c4a35a', duration: 0.4, ease: 'back.out(1.5)' });
      gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.2 });
    };

    const onHoverLeave = () => {
      gsap.to(follower, { scale: 1, opacity: 0.3, backgroundColor: '#e8e6e3', duration: 0.4, ease: 'power3.out' });
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.2 });
    };

    const onMouseDown = () => {
      gsap.to(follower, { scale: 0.8, duration: 0.2, ease: 'power3.out' });
    };

    const onMouseUp = () => {
      gsap.to(follower, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Attach hover effects to interactive elements
    const attachHoverEvents = () => {
      const interactables = document.querySelectorAll('a, button, input, .interactive');
      interactables.forEach((el) => {
        el.addEventListener('mouseenter', onHoverEnter);
        el.addEventListener('mouseleave', onHoverLeave);
      });
    };

    attachHoverEvents();

    // Re-attach periodically for dynamically added elements (like dossiers)
    const interval = setInterval(attachHoverEvents, 1000);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      clearInterval(interval);
      document.documentElement.classList.remove('custom-cursor-enabled');
      const interactables = document.querySelectorAll('a, button, input, .interactive');
      interactables.forEach((el) => {
        el.removeEventListener('mouseenter', onHoverEnter);
        el.removeEventListener('mouseleave', onHoverLeave);
      });
    };
  }, [reducedMotion]);

  if (reducedMotion || ('ontouchstart' in window && window.innerWidth < 1024)) return null;

  return (
    <>
      <div ref={cursorRef} className="custom-cursor-dot" />
      <div ref={followerRef} className="custom-cursor-follower" />
    </>
  );
};
