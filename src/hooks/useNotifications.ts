import { useEffect } from 'react'
import { useAppStore } from '@/data/store'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { differenceInDays, parseISO, isFuture, format } from 'date-fns'
import { toast } from 'sonner'

export const useNotifications = () => {
  const { lancamentos } = useAppStore()
  const { paymentRemindersEnabled } = useSettingsStore()

  useEffect(() => {
    if (!paymentRemindersEnabled) {
      return
    }

    const upcomingPayments = lancamentos.filter((lancamento) => {
      if (lancamento.dataPagamento) {
        return false
      }
      const dueDate = parseISO(lancamento.dataVencimento)
      if (!isFuture(dueDate)) {
        return false
      }
      const daysUntilDue = differenceInDays(dueDate, new Date())
      // Notify for bills due in 3 days or less
      return daysUntilDue >= 0 && daysUntilDue <= 3
    })

    if (upcomingPayments.length > 0) {
      upcomingPayments.forEach((p) => {
        toast.warning(`Vencimento Próximo: ${p.descricao}`, {
          id: `due-${p.id}`, // Use an ID to prevent duplicate toasts on re-render
          description: `Vence em ${format(
            parseISO(p.dataVencimento),
            'dd/MM/yyyy',
          )}. Valor: ${p.valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}`,
          duration: 10000,
        })
      })
    }
  }, [lancamentos, paymentRemindersEnabled])
}
