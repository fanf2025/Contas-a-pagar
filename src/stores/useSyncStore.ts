import { create } from 'zustand'
import { toast } from 'sonner'
import { useAppStore } from '@/data/store'
import { useOfflineStore } from './useOfflineStore'
import { DataConflict, Lancamento } from '@/types'

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error' | 'conflict'

interface SyncState {
  isOnline: boolean
  status: SyncStatus
  lastSync: Date | null
  conflict: DataConflict | null
  setIsOnline: (isOnline: boolean) => void
  syncData: () => Promise<void>
  resolveConflict: (resolution: 'local' | 'server') => void
}

const mockServerData = {
  lancamentos: useAppStore
    .getState()
    .lancamentos.map((l) => ({ ...l, valor: l.valor + 10 })),
}

export const useSyncStore = create<SyncState>((set, get) => ({
  isOnline: navigator.onLine,
  status: 'idle',
  lastSync: null,
  conflict: null,
  setIsOnline: (isOnline: boolean) => set({ isOnline }),
  syncData: async () => {
    if (get().status === 'syncing') return
    set({ status: 'syncing' })
    toast.info('Sincronização iniciada...', {
      description: 'Seus dados estão sendo enviados para a nuvem.',
    })

    try {
      const { actionQueue, removeAction } = useOfflineStore.getState()

      for (const action of actionQueue) {
        await new Promise((res) => setTimeout(res, 200))

        if (action.type === 'UPDATE_LANCAMENTO') {
          const localLancamento = action.payload as Lancamento
          const serverLancamento = mockServerData.lancamentos.find(
            (l) => l.id === localLancamento.id,
          )

          if (
            serverLancamento &&
            serverLancamento.valor !== localLancamento.valor
          ) {
            set({
              status: 'conflict',
              conflict: {
                type: 'LANCAMENTO',
                local: localLancamento,
                server: serverLancamento,
                resolve: (resolution) => get().resolveConflict(resolution),
              },
            })
            toast.warning('Conflito de dados detectado!', {
              description:
                'Por favor, resolva o conflito para continuar a sincronização.',
            })
            return
          } else {
            console.log('Syncing update for:', localLancamento.id)
            removeAction(action.id)
          }
        }
      }

      // Simulate final network request
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          const shouldSucceed = Math.random() > 0.1
          if (shouldSucceed) {
            resolve()
          } else {
            reject(new Error('Simulated sync failure'))
          }
        }, 1000)
      })

      // If we reach here, it means success
      set({ status: 'success', lastSync: new Date() })
      toast.success('Sincronização concluída!', {
        description: 'Seus dados foram salvos na nuvem com sucesso.',
      })
    } catch (error) {
      console.error('Sync failed:', error)
      set({ status: 'error' })
      toast.error('Falha na sincronização', {
        description:
          'Não foi possível salvar seus dados. Tentaremos novamente mais tarde.',
      })
    }
  },
  resolveConflict: (resolution) => {
    const { conflict } = get()
    if (!conflict) return

    const { updateLancamento } = useAppStore.getState()
    const { removeAction } = useOfflineStore.getState()

    if (conflict.type === 'LANCAMENTO') {
      const resolvedLancamento =
        resolution === 'local' ? conflict.local : conflict.server
      updateLancamento(resolvedLancamento)

      const actionInQueue = useOfflineStore
        .getState()
        .actionQueue.find((a) => a.payload.id === conflict.local.id)
      if (actionInQueue) {
        removeAction(actionInQueue.id)
      }
    }

    set({ conflict: null, status: 'idle' })
    toast.success('Conflito resolvido.', {
      description: 'A sincronização continuará automaticamente.',
    })
    get().syncData()
  },
}))
