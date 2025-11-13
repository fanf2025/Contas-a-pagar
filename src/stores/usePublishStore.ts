import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type DomainStatus = 'idle' | 'pending' | 'active' | 'error'
type SslStatus = 'idle' | 'provisioning' | 'active' | 'error'

interface PublishState {
  domain: string | null
  status: DomainStatus
  sslStatus: SslStatus
  setDomain: (domain: string) => void
  verifyDomain: () => Promise<void>
  removeDomain: () => void
}

export const usePublishStore = create<PublishState>()(
  persist(
    (set) => ({
      domain: null,
      status: 'idle',
      sslStatus: 'idle',
      setDomain: (domain: string) => {
        set({ domain, status: 'pending', sslStatus: 'idle' })
      },
      verifyDomain: async () => {
        return new Promise((resolve) => {
          set({ status: 'pending', sslStatus: 'idle' })
          setTimeout(() => {
            const isDomainSuccess = Math.random() > 0.2
            if (isDomainSuccess) {
              set({ status: 'active', sslStatus: 'provisioning' })

              setTimeout(() => {
                const isSslSuccess = Math.random() > 0.2
                if (isSslSuccess) {
                  set({ sslStatus: 'active' })
                } else {
                  set({ sslStatus: 'error' })
                }
                resolve()
              }, 3000)
            } else {
              set({ status: 'error', sslStatus: 'idle' })
              resolve()
            }
          }, 2500)
        })
      },
      removeDomain: () => {
        set({ domain: null, status: 'idle', sslStatus: 'idle' })
      },
    }),
    {
      name: 'publish-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
