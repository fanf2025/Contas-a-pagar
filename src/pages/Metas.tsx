import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useAppStore } from '@/data/store'
import { FinancialGoal } from '@/types'
import { GoalCard } from '@/components/GoalCard'
import { ManageGoalDialog } from '@/components/ManageGoalDialog'
import { AddContributionDialog } from '@/components/AddContributionDialog'
import { format } from 'date-fns'

const MetasPage = () => {
  const {
    financialGoals,
    addFinancialGoal,
    updateFinancialGoal,
    deleteFinancialGoal,
    addGoalContribution,
  } = useAppStore()

  const [isManageGoalOpen, setIsManageGoalOpen] = useState(false)
  const [isAddContributionOpen, setIsAddContributionOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null)
  const [contributionGoalId, setContributionGoalId] = useState<string | null>(
    null,
  )

  const handleOpenManageGoal = (goal: FinancialGoal | null = null) => {
    setSelectedGoal(goal)
    setIsManageGoalOpen(true)
  }

  const handleCloseManageGoal = () => {
    setSelectedGoal(null)
    setIsManageGoalOpen(false)
  }

  const handleSaveGoal = (
    data: Omit<FinancialGoal, 'id' | 'contributions'>,
  ) => {
    if (selectedGoal) {
      updateFinancialGoal({ ...data, id: selectedGoal.id })
    } else {
      addFinancialGoal(data)
    }
  }

  const handleOpenAddContribution = (goalId: string) => {
    setContributionGoalId(goalId)
    setIsAddContributionOpen(true)
  }

  const handleCloseAddContribution = () => {
    setContributionGoalId(null)
    setIsAddContributionOpen(false)
  }

  const handleSaveContribution = (data: Omit<any, 'id' | 'date'>) => {
    if (contributionGoalId) {
      addGoalContribution({
        ...data,
        goalId: contributionGoalId,
        date: format(new Date(), 'yyyy-MM-dd'),
      })
    }
  }

  return (
    <div className="page-content">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Metas Financeiras</h2>
        <Button onClick={() => handleOpenManageGoal()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Nova Meta
        </Button>
      </div>

      {financialGoals.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {financialGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleOpenManageGoal}
              onDelete={deleteFinancialGoal}
              onAddContribution={handleOpenAddContribution}
            />
          ))}
        </div>
      ) : (
        <div className="bg-card p-6 rounded-lg shadow text-center text-muted-foreground">
          <p>Nenhuma meta financeira definida ainda.</p>
          <p>Clique em "Nova Meta" para começar a planejar seu futuro!</p>
        </div>
      )}

      <ManageGoalDialog
        isOpen={isManageGoalOpen}
        onClose={handleCloseManageGoal}
        onSave={handleSaveGoal}
        goal={selectedGoal}
      />

      {contributionGoalId && (
        <AddContributionDialog
          isOpen={isAddContributionOpen}
          onClose={handleCloseAddContribution}
          onSave={handleSaveContribution}
          goalId={contributionGoalId}
        />
      )}
    </div>
  )
}

export default MetasPage
