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
import { FormaPagamento } from '@/types'

const paymentMethodSchema = z.object({
  nome: z
    .string()
    .min(2, 'O nome da forma de pagamento deve ter pelo menos 2 caracteres.'),
})

type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>

type ManagePaymentMethodDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (data: FormaPagamento) => void
  paymentMethod?: FormaPagamento | null
}

export const ManagePaymentMethodDialog = ({
  isOpen,
  onClose,
  onSave,
  paymentMethod,
}: ManagePaymentMethodDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
  })

  useEffect(() => {
    if (isOpen) {
      reset({ nome: paymentMethod?.nome || '' })
    }
  }, [paymentMethod, isOpen, reset])

  const handleSave = (data: PaymentMethodFormValues) => {
    onSave({ ...data, id: paymentMethod?.id || '' })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {paymentMethod
              ? 'Editar Forma de Pagamento'
              : 'Nova Forma de Pagamento'}
          </DialogTitle>
          <DialogDescription>
            Forneça um nome para a forma de pagamento.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4 py-4">
          <div className="space-y-1">
            <Label htmlFor="nome">Nome da Forma de Pagamento</Label>
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
