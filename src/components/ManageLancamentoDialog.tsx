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
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Lancamento } from '@/types'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/data/store'

const lancamentoSchema = z.object({
  descricao: z.string().min(3, 'A descrição é obrigatória.'),
  valor: z.coerce.number().min(0.01, 'O valor deve ser maior que zero.'),
  data: z.date({ required_error: 'A data do lançamento é obrigatória.' }),
  dataVencimento: z.date({
    required_error: 'A data de vencimento é obrigatória.',
  }),
  numeroDocumento: z.string().min(1, 'O Nº do Documento é obrigatório.'),
  categoria: z.string({ required_error: 'A categoria é obrigatória.' }),
  fornecedor: z.string().optional(),
  tipoPagamento: z.string({
    required_error: 'A forma de pagamento é obrigatória.',
  }),
})

type LancamentoFormValues = z.infer<typeof lancamentoSchema>

type ManageLancamentoDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (
    data: Omit<
      Lancamento,
      'id' | 'mes' | 'ano' | 'tipo' | 'valorPago' | 'dataPagamento' | 'juros'
    >,
  ) => void
  lancamento?: Lancamento | null
}

export const ManageLancamentoDialog = ({
  isOpen,
  onClose,
  onSave,
  lancamento,
}: ManageLancamentoDialogProps) => {
  const { categorias, fornecedores, formasPagamento } = useAppStore()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<LancamentoFormValues>({
    resolver: zodResolver(lancamentoSchema),
  })

  useEffect(() => {
    if (isOpen && lancamento) {
      reset({
        descricao: lancamento.descricao,
        valor: lancamento.valor,
        data: parseISO(lancamento.data),
        dataVencimento: parseISO(lancamento.dataVencimento),
        numeroDocumento: lancamento.numeroDocumento,
        categoria: lancamento.categoria,
        fornecedor: lancamento.fornecedor,
        tipoPagamento: lancamento.tipoPagamento,
      })
    } else if (isOpen && !lancamento) {
      reset({
        descricao: '',
        valor: undefined,
        data: new Date(),
        dataVencimento: undefined,
        numeroDocumento: '',
        categoria: undefined,
        fornecedor: undefined,
        tipoPagamento: undefined,
      })
    }
  }, [lancamento, isOpen, reset])

  const handleSave = (data: LancamentoFormValues) => {
    onSave({
      ...data,
      data: format(data.data, 'yyyy-MM-dd'),
      dataVencimento: format(data.dataVencimento, 'yyyy-MM-dd'),
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {lancamento ? 'Editar Lançamento' : 'Novo Lançamento'}
          </DialogTitle>
          <DialogDescription>
            Preencha os detalhes da despesa abaixo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4 py-4">
          <div className="space-y-1">
            <Label htmlFor="descricao">Descrição</Label>
            <Input id="descricao" {...register('descricao')} />
            {errors.descricao && (
              <p className="text-sm text-destructive">
                {errors.descricao.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="numeroDocumento">Nº Doc</Label>
            <Input id="numeroDocumento" {...register('numeroDocumento')} />
            {errors.numeroDocumento && (
              <p className="text-sm text-destructive">
                {errors.numeroDocumento.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="valor">Valor (R$)</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              {...register('valor')}
              onKeyDown={(e) =>
                ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()
              }
            />
            {errors.valor && (
              <p className="text-sm text-destructive">{errors.valor.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label>Data</Label>
            <Controller
              name="data"
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
            {errors.data && (
              <p className="text-sm text-destructive">{errors.data.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label>Vencimento</Label>
            <Controller
              name="dataVencimento"
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
            {errors.dataVencimento && (
              <p className="text-sm text-destructive">
                {errors.dataVencimento.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label>Categoria</Label>
            <Controller
              name="categoria"
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
                    {categorias.map((c) => (
                      <SelectItem key={c.id} value={c.nome}>
                        {c.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoria && (
              <p className="text-sm text-destructive">
                {errors.categoria.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label>Fornecedor</Label>
            <Controller
              name="fornecedor"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {fornecedores.map((f) => (
                      <SelectItem key={f.id} value={f.nome}>
                        {f.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-1">
            <Label>Pagamento</Label>
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
            {errors.tipoPagamento && (
              <p className="text-sm text-destructive">
                {errors.tipoPagamento.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
