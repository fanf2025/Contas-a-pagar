import { useEffect } from 'react'
import { useSyncStore } from '@/stores/useSyncStore'
import { useOfflineStore } from '@/stores/useOfflineStore'

export const SyncHandler = () => {
  const { isOnline, setIsOnline, syncData, status } = useSyncStore()
  const { actionQueue } = useOfflineStore()

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setIsOnline])

  useEffect(() => {
    if (isOnline && actionQueue.length > 0 && status === 'idle') {
      syncData().catch((err) => console.error(err))
    }
  }, [isOnline, actionQueue.length, status, syncData])

  return null
}
