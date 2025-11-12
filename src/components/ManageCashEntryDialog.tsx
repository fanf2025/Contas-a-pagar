import { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CashEntry } from '@/types'
import { cn } from '@/lib/utils'

const cashEntrySchema = z.object({
  date: z.date({ required_error: 'A data é obrigatória.' }),
  value: z.coerce.number().positive('O valor deve ser maior que zero.'),
  origin: z.string().min(3, 'A origem é obrigatória.'),
})

type CashEntryFormValues = z.infer<typeof cashEntrySchema>

type ManageCashEntryDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CashEntry) => void
  entry?: CashEntry | null
}

export const ManageCashEntryDialog = ({
  isOpen,
  onClose,
  onSave,
  entry,
}: ManageCashEntryDialogProps) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CashEntryFormValues>({
    resolver: zodResolver(cashEntrySchema),
  })

  useEffect(() => {
    if (isOpen && entry) {
      reset({
        date: parseISO(entry.date),
        value: entry.value,
        origin: entry.origin,
      })
    }
  }, [entry, isOpen, reset])

  const handleSave = (data: CashEntryFormValues) => {
    if (entry) {
      onSave({ ...data, id: entry.id, date: format(data.date, 'yyyy-MM-dd') })
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Lançamento de Caixa</DialogTitle>
          <DialogDescription>
            Atualize os detalhes da entrada de caixa.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4 py-4">
          <div className="space-y-1">
            <Label>Data</Label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, 'PPP', { locale: ptBR })
                      ) : (
                        <span>Escolha uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="value">Valor (R$)</Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              {...register('value')}
            />
            {errors.value && (
              <p className="text-sm text-destructive">{errors.value.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="origin">Origem</Label>
            <Input id="origin" {...register('origin')} />
            {errors.origin && (
              <p className="text-sm text-destructive">
                {errors.origin.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
