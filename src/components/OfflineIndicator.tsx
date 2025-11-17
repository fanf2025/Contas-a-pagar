import { useSyncStore } from '@/stores/useSyncStore'
import { Wifi, WifiOff } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export const OfflineIndicator = () => {
  const { isOnline } = useSyncStore()

  if (isOnline) {
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
            <p>Você está conectado à internet.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

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
