import { useEffect } from 'react'
import { useBackupStore } from '@/stores/useBackupStore'
import { differenceInHours } from 'date-fns'

export const BackupHandler = () => {
  const { frequency, lastBackup, createBackup } = useBackupStore()

  useEffect(() => {
    const checkAndRunBackup = () => {
      if (frequency === 'manual') return

      const now = new Date()
      if (!lastBackup) {
        createBackup()
        return
      }

      const lastBackupDate = new Date(lastBackup)
      const hoursSinceLastBackup = differenceInHours(now, lastBackupDate)

      const shouldBackup =
        (frequency === 'daily' && hoursSinceLastBackup >= 24) ||
        (frequency === 'weekly' && hoursSinceLastBackup >= 24 * 7)

      if (shouldBackup) {
        createBackup()
      }
    }

    checkAndRunBackup()

    const intervalId = setInterval(checkAndRunBackup, 1000 * 60 * 60)

    return () => clearInterval(intervalId)
  }, [frequency, lastBackup, createBackup])

  return null
}
