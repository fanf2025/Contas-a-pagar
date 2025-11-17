import { useEffect } from 'react'
import { useSyncStore } from '@/stores/useSyncStore'

export const SyncHandler = () => {
  const { isOnline, setIsOnline, syncData, status } = useSyncStore()

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
    if (isOnline && status !== 'syncing') {
      // Trigger sync when coming online
      syncData().catch((err) => console.error(err))
    }
  }, [isOnline, syncData, status])

  return null // This is a side-effect component
}
