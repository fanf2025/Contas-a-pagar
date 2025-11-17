import { useEffect } from 'react'
import { useBackupStore } from '@/stores/useBackupStore'
import { differenceInHours, getDay, format } from 'date-fns'

export const BackupHandler = () => {
  const { frequency, lastBackup, createBackup, backupTime, backupDays } =
    useBackupStore()

  useEffect(() => {
    const checkAndRunBackup = () => {
      if (frequency === 'manual') return

      const now = new Date()
      const lastBackupDate = lastBackup ? new Date(lastBackup) : null

      const hoursSinceLastBackup = lastBackupDate
        ? differenceInHours(now, lastBackupDate)
        : Infinity
      if (hoursSinceLastBackup < 23) {
        return
      }

      let shouldBackup = false
      const currentTime = format(now, 'HH:mm')
      const currentDay = getDay(now)

      if (currentTime !== backupTime) return

      switch (frequency) {
        case 'daily':
          shouldBackup = true
          break
        case 'weekly':
        case 'custom':
          if (backupDays.includes(currentDay)) {
            shouldBackup = true
          }
          break
      }

      if (shouldBackup) {
        createBackup()
      }
    }

    const intervalId = setInterval(checkAndRunBackup, 1000 * 60)

    return () => clearInterval(intervalId)
  }, [frequency, lastBackup, createBackup, backupTime, backupDays])

  return null
}
