import { Menu, DollarSign } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Settings,
  FileText,
  ArrowDownCircle,
  Receipt,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/lancamentos', label: 'Lançamentos', icon: Receipt },
  { to: '/baixas', label: 'Baixas', icon: ArrowDownCircle },
  { to: '/relatorios', label: 'Relatórios', icon: FileText },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
]

type AppHeaderProps = {
  title: string
}

export const AppHeader = ({ title }: AppHeaderProps) => {
  return (
    <header className="page-header sticky top-0 z-30">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="p-0 w-72 bg-[#343a40] text-white border-r-0"
              >
                <div className="flex items-center gap-2 h-16 px-4 border-b border-gray-700">
                  <DollarSign className="h-8 w-8 text-primary" />
                  <span className="text-xl font-bold">Contas a Pagar</span>
                </div>
                <nav className="p-4 space-y-2">
                  {navItems.map(({ to, label, icon: Icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      end
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-md p-3 text-sm font-medium transition-colors',
                          'hover:bg-[#495057] hover:text-white',
                          isActive ? 'bg-primary text-white' : 'text-gray-300',
                        )
                      }
                    >
                      <Icon className="h-5 w-5" />
                      <span>{label}</span>
                    </NavLink>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          <h1 className="page-title">{title}</h1>
        </div>
      </div>
    </header>
  )
}
