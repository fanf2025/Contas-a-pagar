import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { OfflineAction } from '@/types'

interface OfflineState {
  actionQueue: OfflineAction[]
  addAction: (action: Omit<OfflineAction, 'id' | 'timestamp'>) => void
  removeAction: (id: string) => void
  clearQueue: () => void
}

export const useOfflineStore = create<OfflineState>()(
  persist(
    (set) => ({
      actionQueue: [],
      addAction: (action) =>
        set((state) => ({
          actionQueue: [
            ...state.actionQueue,
            {
              ...action,
              id: new Date().toISOString() + Math.random(),
              timestamp: new Date().toISOString(),
            },
          ],
        })),
      removeAction: (id) =>
        set((state) => ({
          actionQueue: state.actionQueue.filter((a) => a.id !== id),
        })),
      clearQueue: () => set({ actionQueue: [] }),
    }),
    {
      name: 'offline-queue-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
