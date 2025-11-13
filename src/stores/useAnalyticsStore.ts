import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AnalyticsState {
  gaMeasurementId: string | null
  isAnalyticsEnabled: boolean
  setGaMeasurementId: (id: string | null) => void
  setIsAnalyticsEnabled: (enabled: boolean) => void
}

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set) => ({
      gaMeasurementId: null,
      isAnalyticsEnabled: false,
      setGaMeasurementId: (id) => set({ gaMeasurementId: id }),
      setIsAnalyticsEnabled: (enabled) => set({ isAnalyticsEnabled: enabled }),
    }),
    {
      name: 'analytics-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
