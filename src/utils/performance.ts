export type QualityTier = 'high' | 'medium' | 'low';

interface PerformanceConfig {
  tier: QualityTier;
  dpr: [number, number];
  particleCount: number;
  enablePostprocessing: boolean;
  enableParticles: boolean;
  enableParallax: boolean;
  enableBloom: boolean;
  shadowMapSize: number;
}

const configs: Record<QualityTier, PerformanceConfig> = {
  high: {
    tier: 'high',
    dpr: [1, 2],
    particleCount: 800,
    enablePostprocessing: true,
    enableParticles: true,
    enableParallax: true,
    enableBloom: true,
    shadowMapSize: 1024,
  },
  medium: {
    tier: 'medium',
    dpr: [1, 1.5],
    particleCount: 400,
    enablePostprocessing: true,
    enableParticles: true,
    enableParallax: true,
    enableBloom: false,
    shadowMapSize: 512,
  },
  low: {
    tier: 'low',
    dpr: [1, 1],
    particleCount: 100,
    enablePostprocessing: false,
    enableParticles: true,
    enableParallax: false,
    enableBloom: false,
    shadowMapSize: 256,
  },
};

export function detectQualityTier(): QualityTier {
  if (typeof window === 'undefined') return 'medium';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return 'low';

  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) return 'low';

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    ('ontouchstart' in window && window.innerWidth < 768);

  const isLowEndGPU = /Intel|Mesa|SwiftShader|llvmpipe/i.test(renderer);
  const cores = navigator.hardwareConcurrency || 2;
  const memory = (navigator as { deviceMemory?: number }).deviceMemory || 4;

  canvas.remove();

  if (isMobile || isLowEndGPU || cores <= 2 || memory <= 2) return 'low';
  if (cores <= 4 || memory <= 4) return 'medium';
  return 'high';
}

export function getPerformanceConfig(tier?: QualityTier): PerformanceConfig {
  const resolvedTier = tier ?? detectQualityTier();
  return configs[resolvedTier];
}

export function supportsWebGPU(): Promise<boolean> {
  if (!('gpu' in navigator)) return Promise.resolve(false);
  return (navigator as { gpu: { requestAdapter: () => Promise<unknown> } }).gpu
    .requestAdapter()
    .then((adapter) => adapter !== null)
    .catch(() => false);
}
