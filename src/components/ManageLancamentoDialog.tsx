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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Lancamento } from '@/types'
import { useAppStore } from '@/data/store'
import { cn } from '@/lib/utils'

const lancamentoSchema = z.object({
  dataVencimento: z.date({
    required_error: 'A data de vencimento é obrigatória.',
  }),
  categoria: z
    .string({ required_error: 'A categoria é obrigatória.' })
    .min(1, 'A categoria é obrigatória.'),
  fornecedor: z.string().optional(),
  numeroDocumento: z.string().min(1, 'O Nº do Documento é obrigatório.'),
  valor: z.coerce.number().positive('O valor deve ser um número positivo.'),
  recorrente: z.boolean().default(false),
  maisDeUmaParcela: z.boolean().default(false),
})

type LancamentoFormValues = z.infer<typeof lancamentoSchema>

type ManageLancamentoDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (
    data: Omit<
      Lancamento,
      | 'id'
      | 'mes'
      | 'ano'
      | 'tipo'
      | 'valorPago'
      | 'dataPagamento'
      | 'juros'
      | 'data'
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
  const { categorias, fornecedores } = useAppStore()

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
    if (isOpen) {
      if (lancamento) {
        reset({
          dataVencimento: new Date(lancamento.dataVencimento),
          categoria: lancamento.categoria,
          fornecedor: lancamento.fornecedor,
          numeroDocumento: lancamento.numeroDocumento,
          valor: lancamento.valor,
          recorrente: lancamento.recorrente,
          maisDeUmaParcela: lancamento.maisDeUmaParcela,
        })
      } else {
        reset({
          dataVencimento: undefined,
          categoria: undefined,
          fornecedor: undefined,
          numeroDocumento: '',
          valor: undefined,
          recorrente: false,
          maisDeUmaParcela: false,
        })
      }
    }
  }, [lancamento, isOpen, reset])

  const handleSave = (data: LancamentoFormValues) => {
    const defaultDescricao = `Lançamento ${data.numeroDocumento}`
    onSave({
      ...data,
      dataVencimento: format(data.dataVencimento, 'yyyy-MM-dd'),
      descricao: data.fornecedor || defaultDescricao,
      tipoPagamento: 'Boleto Bancário',
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
            <Label>Data de Vencimento</Label>
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
                        format(field.value, 'dd/MM/yyyy')
                      ) : (
                        <span>Selecione uma data</span>
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
            <Label htmlFor="numeroDocumento">Nº Doc.</Label>
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
            />
            {errors.valor && (
              <p className="text-sm text-destructive">{errors.valor.message}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Controller
              name="recorrente"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="recorrente"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="recorrente">Lançamento Recorrente</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Controller
              name="maisDeUmaParcela"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="maisDeUmaParcela"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="maisDeUmaParcela">Possui mais de uma parcela</Label>
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
