import { Outlet, useLocation } from 'react-router-dom'
import { AppSidebar } from '@/components/AppSidebar'
import { AppHeader } from '@/components/AppHeader'

const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case '/':
      return 'Dashboard'
    case '/lancamentos':
      return 'Lançamentos'
    case '/baixas':
      return 'Baixas'
    case '/relatorios':
      return 'Relatórios'
    case '/configuracoes':
      return 'Configurações'
    default:
      return 'Contas a Pagar'
  }
}

export default function Layout() {
  const location = useLocation()
  const title = getPageTitle(location.pathname)

  return (
    <div className="flex h-screen bg-background">
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
