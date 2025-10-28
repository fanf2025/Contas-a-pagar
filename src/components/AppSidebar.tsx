import {
  DollarSign,
  LayoutDashboard,
  Settings,
  FileText,
  ArrowDownCircle,
  ChevronsLeft,
  ChevronsRight,
  Receipt,
  Target,
} from 'lucide-react'
import { NavLink, Link } from 'react-router-dom'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/lancamentos', label: 'Lançamentos', icon: Receipt },
  { to: '/baixas', label: 'Baixas', icon: ArrowDownCircle },
  { to: '/metas', label: 'Metas', icon: Target },
  { to: '/relatorios', label: 'Relatórios', icon: FileText },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
]

export const AppSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col bg-[#343a40] text-white transition-width duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-64',
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
        <Link to="/" className="flex items-center gap-2 overflow-hidden">
          <DollarSign className="h-8 w-8 text-primary flex-shrink-0" />
          <span
            className={cn(
              'text-xl font-bold whitespace-nowrap transition-opacity duration-200',
              isCollapsed ? 'opacity-0' : 'opacity-100',
            )}
          >
            Contas a Pagar
          </span>
        </Link>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md p-3 text-sm font-medium transition-colors',
                'hover:bg-[#495057] hover:text-white',
                isActive ? 'bg-primary text-white' : 'text-gray-300',
                isCollapsed && 'justify-center',
              )
            }
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span
              className={cn(
                'transition-opacity',
                isCollapsed ? 'hidden' : 'block',
              )}
            >
              {label}
            </span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <Button
          onClick={toggleSidebar}
          variant="ghost"
          className="w-full justify-center text-gray-300 hover:bg-[#495057] hover:text-white"
        >
          {isCollapsed ? (
            <ChevronsRight className="h-5 w-5" />
          ) : (
            <ChevronsLeft className="h-5 w-5" />
          )}
          <span className="sr-only">
            {isCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
          </span>
        </Button>
      </div>
    </aside>
  )
}
