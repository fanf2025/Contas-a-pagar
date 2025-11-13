import { useAppStore } from '@/data/store'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'
import { differenceInDays, parseISO, isFuture } from 'date-fns'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'

export const DueDateAlerts = () => {
  const { lancamentos } = useAppStore()

  const upcomingPayments = lancamentos.filter((lancamento) => {
    if (lancamento.dataPagamento) {
      return false
    }
    const dueDate = parseISO(lancamento.dataVencimento)
    if (!isFuture(dueDate)) {
      return false
    }
    const daysUntilDue = differenceInDays(dueDate, new Date())
    return daysUntilDue >= 0 && daysUntilDue <= 7
  })

  if (upcomingPayments.length === 0) {
    return null
  }

  return (
    <Alert variant="destructive" className="mb-6 animate-fade-in">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Atenção: Vencimentos Próximos!</AlertTitle>
      <AlertDescription>
        <div className="flex justify-between items-center">
          <div>
            Você tem {upcomingPayments.length} conta
            {upcomingPayments.length > 1 ? 's' : ''} vencendo nos próximos 7
            dias.
          </div>
          <Button asChild size="sm">
            <Link to="/baixas">Ver Contas</Link>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
