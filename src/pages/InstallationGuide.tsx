import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ExternalLink, AlertCircle, Download } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

// Extend Window interface for Tauri check
declare global {
  interface Window {
    __TAURI__?: object
  }
}

const InstallationGuidePage = () => {
  const [isRedirecting, setIsRedirecting] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConnectionRefused, setIsConnectionRefused] = useState(false)

  // Using the releases page to avoid 404 on /latest if no release is marked as latest
  const releasesUrl = 'https://github.com/skip-me/contas-a-pagar/releases'
  const latestVersion = '0.0.50'
  // Constructing the direct download URL based on standard Tauri naming conventions
  // Note: This assumes the release asset follows the pattern "Product Name_Version_Arch_Lang.msi"
  const directDownloadUrlWindows = `https://github.com/skip-me/contas-a-pagar/releases/download/v${latestVersion}/Contas%20a%20Pagar_${latestVersion}_x64_en-US.msi`

  useEffect(() => {
    const redirect = async () => {
      try {
        // Check connection to GitHub before attempting redirect
        try {
          await fetch(releasesUrl, { mode: 'no-cors' })
        } catch (networkError) {
          throw new Error('A conexão com o GitHub foi recusada.')
        }

        toast.info('Redirecionando...', {
          description:
            'Você está sendo redirecionado para a página de downloads oficial.',
        })

        // Delay to allow user to see the message
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Check if running in Tauri
        if (window.__TAURI__) {
          try {
            // Dynamically import Tauri shell to avoid build errors in web environment
            const { open } = await import(
              /* @vite-ignore */ '@tauri-apps/api/shell'
            )
            await open(releasesUrl)
            setIsRedirecting(false)
            toast.success('Página de downloads aberta no navegador.')
          } catch (tauriError) {
            console.error('Tauri shell open failed:', tauriError)
            // Fallback to window.location if Tauri shell fails (though unlikely in Tauri)
            window.location.href = releasesUrl
          }
        } else {
          // Web environment
          window.location.href = releasesUrl
        }
      } catch (err) {
        console.error('Redirection failed:', err)
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Não foi possível redirecionar automaticamente.'

        setError(errorMessage)
        setIsRedirecting(false)

        if (errorMessage === 'A conexão com o GitHub foi recusada.') {
          setIsConnectionRefused(true)
        }

        toast.error('Erro no redirecionamento', {
          description: errorMessage,
        })
      }
    }

    redirect()
  }, [])

  return (
    <div className="page-content flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md text-center animate-fade-in">
        <CardHeader>
          <CardTitle>Downloads</CardTitle>
          <CardDescription>
            {isConnectionRefused
              ? `Versão ${latestVersion} disponível para download.`
              : 'Acesse a página oficial para baixar a versão mais recente.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isRedirecting ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">
                Aguarde, redirecionando...
              </p>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {error && (
                <Alert variant="destructive" className="text-left">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Atenção</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isConnectionRefused ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Como a conexão automática falhou, você pode tentar baixar o
                    instalador diretamente:
                  </p>
                  <Button asChild className="w-full" size="lg">
                    <a
                      href={directDownloadUrlWindows}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Baixar Instalador (Windows)
                    </a>
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Versão: {latestVersion}
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    {error
                      ? 'Verifique sua conexão e tente novamente.'
                      : 'Se você não foi redirecionado automaticamente, clique no botão abaixo.'}
                  </p>
                  <Button asChild className="w-full" size="lg">
                    <a
                      href={releasesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Ir para Downloads
                    </a>
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default InstallationGuidePage
