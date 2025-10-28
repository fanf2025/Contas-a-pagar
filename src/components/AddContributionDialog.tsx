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
import { GoalContribution } from '@/types'
import { format } from 'date-fns'

const contributionSchema = z.object({
  amount: z.coerce
    .number()
    .min(0.01, 'A contribuição deve ser maior que zero.'),
})

type ContributionFormValues = z.infer<typeof contributionSchema>

type AddContributionDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<GoalContribution, 'id' | 'date'>) => void
  goalId: string
}

export const AddContributionDialog = ({
  isOpen,
  onClose,
  onSave,
  goalId,
}: AddContributionDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContributionFormValues>({
    resolver: zodResolver(contributionSchema),
  })

  const handleSave = (data: ContributionFormValues) => {
    onSave({ ...data, goalId })
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Contribuição</DialogTitle>
          <DialogDescription>
            Registre um novo aporte para sua meta financeira.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="amount">Valor da Contribuição (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register('amount')}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">
                {errors.amount.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Adicionar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
