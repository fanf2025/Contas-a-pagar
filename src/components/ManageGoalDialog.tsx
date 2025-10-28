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
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { FinancialGoal } from '@/types'
import { cn } from '@/lib/utils'

const goalSchema = z.object({
  name: z.string().min(3, 'O nome da meta é obrigatório.'),
  targetAmount: z.coerce
    .number()
    .min(1, 'O valor alvo deve ser maior que zero.'),
  targetDate: z.date({ required_error: 'A data alvo é obrigatória.' }),
})

type GoalFormValues = z.infer<typeof goalSchema>

type ManageGoalDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<FinancialGoal, 'id' | 'contributions'>) => void
  goal?: FinancialGoal | null
}

export const ManageGoalDialog = ({
  isOpen,
  onClose,
  onSave,
  goal,
}: ManageGoalDialogProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: goal?.name || '',
      targetAmount: goal?.targetAmount || 0,
      targetDate: goal ? new Date(goal.targetDate) : undefined,
    },
  })

  const handleSave = (data: GoalFormValues) => {
    onSave({ ...data, targetDate: format(data.targetDate, 'yyyy-MM-dd') })
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {goal ? 'Editar Meta' : 'Nova Meta Financeira'}
          </DialogTitle>
          <DialogDescription>
            Defina um objetivo e acompanhe seu progresso.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="name">Nome da Meta</Label>
            <Input id="name" {...register('name')} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="targetAmount">Valor Alvo (R$)</Label>
            <Input
              id="targetAmount"
              type="number"
              step="0.01"
              {...register('targetAmount')}
            />
            {errors.targetAmount && (
              <p className="text-sm text-destructive">
                {errors.targetAmount.message}
              </p>
            )}
          </div>
          <div>
            <Label>Data Alvo</Label>
            <Controller
              name="targetDate"
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
            {errors.targetDate && (
              <p className="text-sm text-destructive">
                {errors.targetDate.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Meta</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
