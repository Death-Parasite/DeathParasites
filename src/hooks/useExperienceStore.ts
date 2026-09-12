import { create } from 'zustand';
import type { QualityTier } from '@/utils/performance';

interface ExperienceState {
  // Intro
  introComplete: boolean;
  setIntroComplete: (v: boolean) => void;

  // Quality
  qualityTier: QualityTier;
  setQualityTier: (tier: QualityTier) => void;

  // Active section
  activeSection: string;
  setActiveSection: (section: string) => void;

  // Dossier
  activeDossier: string | null;
  openDossier: (id: string) => void;
  closeDossier: () => void;

  // Scroll
  scrollProgress: number;
  setScrollProgress: (p: number) => void;

  // Loading
  assetsLoaded: boolean;
  setAssetsLoaded: (v: boolean) => void;

  // Navigation
  navOpen: boolean;
  setNavOpen: (v: boolean) => void;
  toggleNav: () => void;
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  introComplete: false,
  setIntroComplete: (v) => set({ introComplete: v }),

  qualityTier: 'medium',
  setQualityTier: (tier) => set({ qualityTier: tier }),

  activeSection: 'intro',
  setActiveSection: (section) => set({ activeSection: section }),

  activeDossier: null,
  openDossier: (id) => set({ activeDossier: id }),
  closeDossier: () => set({ activeDossier: null }),

  scrollProgress: 0,
  setScrollProgress: (p) => set({ scrollProgress: p }),

  assetsLoaded: false,
  setAssetsLoaded: (v) => set({ assetsLoaded: v }),

  navOpen: false,
  setNavOpen: (v) => set({ navOpen: v }),
  toggleNav: () => set((s) => ({ navOpen: !s.navOpen })),
}));
