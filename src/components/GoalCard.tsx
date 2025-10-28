import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { FinancialGoal } from '@/types'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Edit, Trash2, PlusCircle } from 'lucide-react'

type GoalCardProps = {
  goal: FinancialGoal
  onEdit: (goal: FinancialGoal) => void
  onDelete: (id: string) => void
  onAddContribution: (goalId: string) => void
}

export const GoalCard = ({
  goal,
  onEdit,
  onDelete,
  onAddContribution,
}: GoalCardProps) => {
  const currentAmount = goal.contributions.reduce(
    (acc, curr) => acc + curr.amount,
    0,
  )
  const progress = (currentAmount / goal.targetAmount) * 100

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{goal.name}</CardTitle>
            <CardDescription>
              Meta: {format(parseISO(goal.targetDate), 'dd/MM/yyyy')}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(goal)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(goal.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>
              {currentAmount.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
            <span className="text-muted-foreground">
              {goal.targetAmount.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
          <Progress value={progress} />
          <p className="text-right text-sm text-muted-foreground">
            {progress.toFixed(1)}%
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => onAddContribution(goal.id)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Contribuição
        </Button>
      </CardFooter>
    </Card>
  )
}
