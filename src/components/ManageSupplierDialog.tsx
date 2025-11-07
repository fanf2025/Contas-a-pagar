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
import { Fornecedor } from '@/types'

const supplierSchema = z.object({
  nome: z
    .string()
    .min(2, 'O nome do fornecedor deve ter pelo menos 2 caracteres.'),
})

type SupplierFormValues = z.infer<typeof supplierSchema>

type ManageSupplierDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Fornecedor) => void
  supplier?: Fornecedor | null
}

export const ManageSupplierDialog = ({
  isOpen,
  onClose,
  onSave,
  supplier,
}: ManageSupplierDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
  })

  useEffect(() => {
    if (isOpen) {
      reset({ nome: supplier?.nome || '' })
    }
  }, [supplier, isOpen, reset])

  const handleSave = (data: SupplierFormValues) => {
    onSave({ ...data, id: supplier?.id || '' })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {supplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}
          </DialogTitle>
          <DialogDescription>
            Forneça um nome para o fornecedor.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4 py-4">
          <div className="space-y-1">
            <Label htmlFor="nome">Nome do Fornecedor</Label>
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
