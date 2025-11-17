import { useEffect, useRef } from 'react'
import { useSyncStore } from '@/stores/useSyncStore'
import { useOfflineStore } from '@/stores/useOfflineStore'

const showNotification = (title: string, options?: NotificationOptions) => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notification')
    return
  }

  if (Notification.permission === 'granted') {
    new Notification(title, {
      ...options,
      icon: '/favicon.ico',
      lang: 'pt-BR',
      silent: true,
    })
  }
}

export const useSyncNotifications = () => {
  const syncStatus = useSyncStore((state) => state.status)
  const prevSyncStatus = useRef<typeof syncStatus>()
  const wasOfflineQueuePopulated = useRef(false)

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      if (Notification.permission !== 'denied') {
        Notification.requestPermission()
      }
    }
  }, [])

  useEffect(() => {
    if (syncStatus === prevSyncStatus.current) {
      return
    }
    prevSyncStatus.current = syncStatus

    const offlineQueue = useOfflineStore.getState().actionQueue
    if (offlineQueue.length > 0) {
      wasOfflineQueuePopulated.current = true
    }

    switch (syncStatus) {
      case 'success': {
        const title = 'Sincronização Concluída'
        let body = 'Seus dados foram salvos na nuvem com sucesso.'
        if (wasOfflineQueuePopulated.current) {
          body = 'As alterações feitas offline foram sincronizadas com sucesso.'
          wasOfflineQueuePopulated.current = false
        }
        showNotification(title, { body })
        break
      }
      case 'error':
        showNotification('Falha na Sincronização', {
          body: 'Não foi possível salvar seus dados. Verifique sua conexão.',
        })
        break
      case 'conflict':
        showNotification('Conflito de Sincronização', {
          body: 'Resolva o conflito para continuar a sincronização.',
        })
        break
      default:
        break
    }
  }, [syncStatus])
}
