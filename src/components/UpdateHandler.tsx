import { useEffect } from 'react'
import {
  checkUpdate,
  installUpdate,
  onUpdaterEvent,
} from '@tauri-apps/api/updater'
import { relaunch } from '@tauri-apps/api/process'
import { toast } from 'sonner'

export const UpdateHandler = () => {
  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const { shouldUpdate, manifest } = await checkUpdate()

        if (shouldUpdate) {
          toast.info('Nova atualização disponível!', {
            description: `Versão ${manifest?.version} está sendo baixada em segundo plano.`,
            duration: 10000,
          })

          // This will start the download in the background
          await installUpdate()

          // The 'update-downloaded' event will be handled by the listener below
        }
      } catch (error) {
        console.error('Update check failed:', error)
        // Do not bother the user with failed checks in the background
      }
    }

    checkForUpdates()

    const unlisten = onUpdaterEvent(({ error, status }) => {
      if (status === 'DOWNLOADED') {
        toast.success('Atualização pronta para instalar!', {
          description: 'Reinicie a aplicação para aplicar a nova versão.',
          action: {
            label: 'Reiniciar Agora',
            onClick: async () => {
              await relaunch()
            },
          },
          duration: Infinity, // Keep the toast until user interacts
        })
      } else if (status === 'ERROR') {
        toast.error('Falha no download da atualização.', {
          description: String(error),
        })
      }
    })

    return () => {
      unlisten.then((f) => f())
    }
  }, [])

  return null
}
