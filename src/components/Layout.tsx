import { Outlet, useLocation } from 'react-router-dom'
import { AppSidebar } from '@/components/AppSidebar'
import { AppHeader } from '@/components/AppHeader'
import { NotificationHandler } from './NotificationHandler'
import { SyncHandler } from './SyncHandler'

const getPageTitle = (pathname: string): string => {
  if (pathname.startsWith('/lancamentos/caixa/')) {
    return 'Detalhe do Lançamento de Caixa'
  }

  switch (pathname) {
    case '/':
      return 'Dashboard'
    case '/lancamentos':
      return 'Lançamentos'
    case '/baixas':
      return 'Baixas'
    case '/metas':
      return 'Metas Financeiras'
    case '/relatorios':
      return 'Relatórios'
    case '/publicar':
      return 'Publicar Aplicação'
    case '/configuracoes':
      return 'Configurações'
    case '/perfil':
      return 'Meu Perfil'
    default:
      return 'Contas a Pagar'
  }
}

export default function Layout() {
  const location = useLocation()
  const title = getPageTitle(location.pathname)

  return (
    <div className="flex h-screen bg-background">
      <NotificationHandler />
      <SyncHandler />
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AppHeader title={title} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
