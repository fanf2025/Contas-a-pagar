import { useEffect } from 'react'
import { toast } from 'sonner'
import { useAppStore } from '@/data/store'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { differenceInDays, parseISO } from 'date-fns'
import { BellRing } from 'lucide-react'

export const useNotifications = () => {
  const { lancamentos } = useAppStore()
  const { paymentRemindersEnabled } = useSettingsStore()

  useEffect(() => {
    if (paymentRemindersEnabled) {
      const upcomingPayments = lancamentos.filter((lancamento) => {
        if (lancamento.valorPago >= lancamento.valor || !lancamento.data) {
          return false
        }
        const dueDate = parseISO(lancamento.data)
        const daysUntilDue = differenceInDays(dueDate, new Date())
        return daysUntilDue >= 0 && daysUntilDue <= 7
      })

      if (upcomingPayments.length > 0) {
        toast.info(
          `Você tem ${
            upcomingPayments.length
          } conta(s) vencendo nos próximos 7 dias.`,
          {
            icon: <BellRing className="h-4 w-4" />,
            duration: 8000,
          },
        )
      }
    }
  }, [lancamentos, paymentRemindersEnabled])
}
