import { useEffect } from 'react'
import { toast } from 'sonner'

// Extend the Window interface to make TypeScript aware of the Tauri-specific object.
declare global {
  interface Window {
    __TAURI__?: object
  }
}

export const UpdateHandler = () => {
  useEffect(() => {
    // Guard clause to ensure this logic only runs within a Tauri environment.
    if (!window.__TAURI__) {
      console.log('Not running in a Tauri environment, skipping update check.')
      return
    }

    const setupTauriUpdater = async () => {
      try {
        // Dynamically import Tauri APIs to prevent build-time resolution errors.
        const { checkUpdate, installUpdate, onUpdaterEvent } = await import(
          '@tauri-apps/api/updater'
        )
        const { relaunch } = await import('@tauri-apps/api/process')

        const checkForUpdates = async () => {
          try {
            const { shouldUpdate, manifest } = await checkUpdate()

            if (shouldUpdate) {
              toast.info('Nova atualização disponível!', {
                description: `Versão ${manifest?.version} está sendo baixada em segundo plano.`,
                duration: 10000,
              })
              // Start downloading the update in the background.
              await installUpdate()
            }
          } catch (error) {
            console.error('Update check failed:', error)
            // Avoid notifying the user about background check failures.
          }
        }

        // Initial check for updates when the component mounts.
        checkForUpdates()

        // Listen for updater events, such as download completion or errors.
        const unlisten = await onUpdaterEvent(({ error, status }) => {
          if (status === 'DOWNLOADED') {
            toast.success('Atualização pronta para instalar!', {
              description: 'Reinicie a aplicação para aplicar a nova versão.',
              action: {
                label: 'Reiniciar Agora',
                onClick: async () => {
                  await relaunch()
                },
              },
              duration: Infinity, // Keep toast visible until user action.
            })
          } else if (status === 'ERROR') {
            toast.error('Falha no download da atualização.', {
              description: String(error),
            })
          }
        })

        // Return the cleanup function to be called on component unmount.
        return () => {
          unlisten()
        }
      } catch (error) {
        console.error('Failed to set up Tauri updater:', error)
      }
    }

    const cleanupPromise = setupTauriUpdater()

    // The main cleanup function for the useEffect hook.
    return () => {
      cleanupPromise.then((cleanup) => {
        if (cleanup) {
          cleanup()
        }
      })
    }
  }, [])

  return null
}
