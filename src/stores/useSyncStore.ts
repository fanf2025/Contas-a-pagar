import { create } from 'zustand'
import { toast } from 'sonner'
import { useAppStore } from '@/data/store'

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error'

interface SyncState {
  isOnline: boolean
  status: SyncStatus
  lastSync: Date | null
  setIsOnline: (isOnline: boolean) => void
  syncData: () => Promise<void>
}

export const useSyncStore = create<SyncState>((set, get) => ({
  isOnline: navigator.onLine,
  status: 'idle',
  lastSync: null,
  setIsOnline: (isOnline: boolean) => set({ isOnline }),
  syncData: async () => {
    if (get().status === 'syncing') return
    set({ status: 'syncing' })
    toast.info('Sincronização iniciada...', {
      description: 'Seus dados estão sendo enviados para a nuvem.',
    })

    // Mock API call to "sync" data
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const shouldSucceed = Math.random() > 0.1 // 90% success rate
        if (shouldSucceed) {
          // In a real app, you would send the state to the backend
          const stateToSync = useAppStore.getState()
          console.log('Syncing data with backend:', {
            lancamentos: stateToSync.lancamentos.length,
            metas: stateToSync.financialGoals.length,
          })

          set({ status: 'success', lastSync: new Date() })
          toast.success('Sincronização concluída!', {
            description: 'Seus dados foram salvos na nuvem com sucesso.',
          })
          resolve()
        } else {
          set({ status: 'error' })
          toast.error('Falha na sincronização', {
            description:
              'Não foi possível salvar seus dados. Tentaremos novamente mais tarde.',
          })
          reject(new Error('Sync failed'))
        }
      }, 2500) // Simulate network latency
    })
  },
}))
