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
import { format, addDays } from 'date-fns'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Lancamento } from '@/types'
import { useAppStore } from '@/data/store'

const lancamentoSchema = z.object({
  categoria: z.string({ required_error: 'A categoria é obrigatória.' }),
  fornecedor: z.string().optional(),
  numeroDocumento: z.string().min(1, 'O Nº do Documento é obrigatório.'),
  valor: z.coerce.number().min(0.01, 'O valor deve ser maior que zero.'),
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
        categoria: lancamento.categoria,
        fornecedor: lancamento.fornecedor,
        numeroDocumento: lancamento.numeroDocumento,
        valor: lancamento.valor,
      })
    } else if (isOpen && !lancamento) {
      reset({
        categoria: undefined,
        fornecedor: undefined,
        numeroDocumento: '',
        valor: undefined,
      })
    }
  }, [lancamento, isOpen, reset])

  const handleSave = (data: LancamentoFormValues) => {
    const today = new Date()
    const defaultDescricao = `Lançamento ${data.numeroDocumento}`
    const defaultTipoPagamento = formasPagamento[0]?.nome || 'Boleto Bancário'

    onSave({
      ...data,
      data: format(today, 'yyyy-MM-dd'),
      dataVencimento: format(addDays(today, 30), 'yyyy-MM-dd'),
      descricao: data.fornecedor || defaultDescricao,
      tipoPagamento: defaultTipoPagamento,
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
              onKeyDown={(e) =>
                ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()
              }
            />
            {errors.valor && (
              <p className="text-sm text-destructive">{errors.valor.message}</p>
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
