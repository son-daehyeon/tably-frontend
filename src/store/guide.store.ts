import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface GuideStore {
  showGuide?: boolean;
  setShowGuide: (showGuide: boolean) => void;
}

export const useGuideStore = create(
  persist<GuideStore>(
    (set) => ({
      showGuide: false,
      setShowGuide: (showGuide) => set({ showGuide }),
    }),
    {
      name: 'guide',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
