import { useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface ParallaxValues {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

export function useMouseParallax(intensity: number = 0.02): React.RefObject<ParallaxValues> {
  const values = useRef<ParallaxValues>({ x: 0, y: 0, normalizedX: 0, normalizedY: 0 });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      values.current.normalizedX = nx;
      values.current.normalizedY = ny;
      values.current.x = nx * intensity;
      values.current.y = ny * intensity;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [intensity, reducedMotion]);

  return values;
}
