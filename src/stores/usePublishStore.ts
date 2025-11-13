import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type DomainStatus = 'idle' | 'pending' | 'active' | 'error'

interface PublishState {
  domain: string | null
  status: DomainStatus
  setDomain: (domain: string) => void
  verifyDomain: () => Promise<void>
  removeDomain: () => void
}

export const usePublishStore = create<PublishState>()(
  persist(
    (set, get) => ({
      domain: null,
      status: 'idle',
      setDomain: (domain: string) => {
        set({ domain, status: 'pending' })
      },
      verifyDomain: async () => {
        return new Promise((resolve) => {
          set({ status: 'pending' }) // Show pending state during verification
          setTimeout(() => {
            // Simulate a 50/50 chance of success or failure for demonstration
            const isSuccess = Math.random() > 0.5
            if (isSuccess) {
              set({ status: 'active' })
            } else {
              set({ status: 'error' })
            }
            resolve()
          }, 2500)
        })
      },
      removeDomain: () => {
        set({ domain: null, status: 'idle' })
      },
    }),
    {
      name: 'publish-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
