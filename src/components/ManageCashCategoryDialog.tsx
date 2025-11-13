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
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CashCategory } from '@/types'

const cashCategorySchema = z.object({
  nome: z
    .string()
    .min(2, 'O nome da categoria deve ter pelo menos 2 caracteres.'),
})

type CashCategoryFormValues = z.infer<typeof cashCategorySchema>

type ManageCashCategoryDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CashCategory) => void
  category?: CashCategory | null
}

export const ManageCashCategoryDialog = ({
  isOpen,
  onClose,
  onSave,
  category,
}: ManageCashCategoryDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CashCategoryFormValues>({
    resolver: zodResolver(cashCategorySchema),
  })

  useEffect(() => {
    if (isOpen) {
      reset({ nome: category?.nome || '' })
    }
  }, [category, isOpen, reset])

  const handleSave = (data: CashCategoryFormValues) => {
    onSave({ ...data, id: category?.id || '' })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Editar Categoria de Caixa' : 'Nova Categoria de Caixa'}
          </DialogTitle>
          <DialogDescription>
            Forneça um nome para a categoria de entrada de caixa.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4 py-4">
          <div className="space-y-1">
            <Label htmlFor="nome">Nome da Categoria</Label>
            <Input id="nome" {...register('nome')} />
            {errors.nome && (
              <p className="text-sm text-destructive">{errors.nome.message}</p>
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
