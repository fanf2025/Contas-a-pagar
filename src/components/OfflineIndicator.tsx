import { useSyncStore } from '@/stores/useSyncStore'
import { Wifi, WifiOff, RefreshCw, AlertTriangle } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export const OfflineIndicator = () => {
  const { isOnline, status } = useSyncStore()

  if (!isOnline) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
              <WifiOff className="h-4 w-4" />
              <span className="text-xs hidden sm:inline">Offline</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Você está offline. As alterações serão salvas localmente.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  switch (status) {
    case 'syncing':
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 text-primary">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-xs hidden sm:inline">Sincronizando</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Seus dados estão sendo sincronizados com a nuvem.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    case 'conflict':
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 text-warning">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs hidden sm:inline">Conflito</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Conflito de dados detectado. Resolva para continuar.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    case 'error':
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 text-destructive">
                <Wifi className="h-4 w-4" />
                <span className="text-xs hidden sm:inline">Erro de Sinc.</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Falha na última sincronização. Verifique sua conexão.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    default:
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 text-success">
                <Wifi className="h-4 w-4" />
                <span className="text-xs hidden sm:inline">Online</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Você está conectado e seus dados estão sincronizados.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
  }
}
