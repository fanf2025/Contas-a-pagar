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
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Lancamento } from '@/types'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/data/store'

const baixaSchema = z.object({
  valorPago: z.coerce
    .number()
    .min(0.01, 'O valor do pagamento deve ser maior que zero.'),
  dataPagamento: z.date({
    required_error: 'A data de pagamento é obrigatória.',
  }),
  tipoPagamento: z.string({
    required_error: 'A forma de pagamento é obrigatória.',
  }),
})

export type BaixaFormValues = z.infer<typeof baixaSchema>

type ProcessarBaixaDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (
    lancamento: Lancamento,
    data: BaixaFormValues & { juros: number },
  ) => void
  lancamento: Lancamento | null
}

export const ProcessarBaixaDialog = ({
  isOpen,
  onClose,
  onSave,
  lancamento,
}: ProcessarBaixaDialogProps) => {
  const { formasPagamento } = useAppStore()

  const form = useForm<BaixaFormValues>({
    resolver: zodResolver(baixaSchema),
  })

  const { register, handleSubmit, control, reset, watch } = form
  const valorPago = watch('valorPago', 0)
  const juros = lancamento ? valorPago - lancamento.valor : 0

  useEffect(() => {
    if (lancamento) {
      reset({
        valorPago: lancamento.valor,
        dataPagamento: new Date(),
        tipoPagamento: lancamento.tipoPagamento,
      })
    }
  }, [lancamento, isOpen, reset])

  const handleSave = (data: BaixaFormValues) => {
    if (lancamento) {
      onSave(lancamento, { ...data, juros })
    }
    onClose()
  }

  if (!lancamento) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Processar Baixa de Pagamento</DialogTitle>
          <DialogDescription>
            {`Doc: ${lancamento.numeroDocumento} - ${lancamento.descricao}`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Valor Original</Label>
              <Input
                value={lancamento.valor.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="valorPago">Valor do Pagamento (R$)</Label>
              <Input
                id="valorPago"
                type="number"
                step="0.01"
                {...register('valorPago')}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Juros</Label>
              <Input
                value={juros.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
                disabled
                className={cn(
                  juros > 0
                    ? 'text-destructive'
                    : juros < 0
                      ? 'text-success'
                      : '',
                )}
              />
            </div>
            <div>
              <Label>Data do Pagamento</Label>
              <Controller
                name="dataPagamento"
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
            </div>
          </div>
          <div>
            <Label>Forma de Pagamento</Label>
            <Controller
              name="tipoPagamento"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {formasPagamento.map((f) => (
                      <SelectItem key={f.id} value={f.nome}>
                        {f.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Confirmar Pagamento</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
