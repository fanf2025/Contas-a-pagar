import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useAppStore } from '@/data/store'
import { toast } from 'sonner'
import { format } from 'date-fns'

type BackupFrequency = 'daily' | 'weekly' | 'manual' | 'custom'
type Backup = {
  timestamp: string
  filename: string
  data: string
}

interface BackupState {
  frequency: BackupFrequency
  lastBackup: string | null
  backups: Backup[]
  backupTime: string // HH:mm format
  backupDays: number[] // 0 for Sunday, 1 for Monday, etc.
  setFrequency: (frequency: BackupFrequency) => void
  setBackupTime: (time: string) => void
  setBackupDays: (days: number[]) => void
  createBackup: () => Promise<void>
  restoreFromBackup: (timestamp: string) => Promise<void>
  deleteBackup: (timestamp: string) => void
  exportBackup: (timestamp: string) => Promise<void>
}

export const useBackupStore = create<BackupState>()(
  persist(
    (set, get) => ({
      frequency: 'daily',
      lastBackup: null,
      backups: [],
      backupTime: '02:00',
      backupDays: [1, 2, 3, 4, 5], // Mon-Fri
      setFrequency: (frequency) => set({ frequency }),
      setBackupTime: (time) => set({ backupTime: time }),
      setBackupDays: (days) => set({ backupDays: days }),
      createBackup: async () => {
        try {
          const appState = useAppStore.getState()
          const dataString = JSON.stringify(appState)
          const timestamp = new Date().toISOString()
          const filename = `backup-${format(
            new Date(),
            'yyyy-MM-dd-HH-mm-ss',
          )}.json`

          const newBackup: Backup = {
            timestamp,
            filename,
            data: dataString,
          }

          set((state) => ({
            backups: [...state.backups, newBackup].slice(-10), // Keep last 10 backups
            lastBackup: timestamp,
          }))

          toast.success('Backup local criado com sucesso!', {
            description: `Arquivo: ${filename}`,
          })
        } catch (error) {
          console.error('Backup failed:', error)
          toast.error('Falha ao criar backup local.')
        }
      },
      restoreFromBackup: async (timestamp) => {
        const backup = get().backups.find((b) => b.timestamp === timestamp)
        if (!backup) {
          toast.error('Arquivo de backup não encontrado.')
          return
        }
        try {
          const restoredState = JSON.parse(backup.data)
          useAppStore.setState(restoredState, true)
          toast.success('Dados restaurados com sucesso!', {
            description: `Restaurado a partir de ${backup.filename}`,
          })
        } catch (error) {
          console.error('Restore failed:', error)
          toast.error('Falha ao restaurar o backup.')
        }
      },
      deleteBackup: (timestamp) => {
        set((state) => ({
          backups: state.backups.filter((b) => b.timestamp !== timestamp),
        }))
        toast.info('Backup excluído.')
      },
      exportBackup: async (timestamp: string) => {
        const backup = get().backups.find((b) => b.timestamp === timestamp)
        if (!backup) {
          toast.error('Arquivo de backup não encontrado.')
          return
        }
        try {
          const blob = new Blob([backup.data], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = backup.filename
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
          toast.success('Download do backup iniciado.', {
            description: `Arquivo: ${backup.filename}`,
          })
        } catch (error) {
          console.error('Export failed:', error)
          toast.error('Falha ao exportar o backup.')
        }
      },
    }),
    {
      name: 'backup-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
