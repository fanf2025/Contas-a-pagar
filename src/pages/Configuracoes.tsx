import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { CategoryManager } from '@/components/CategoryManager'
import { SupplierManager } from '@/components/SupplierManager'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

const ConfiguracoesPage = () => {
  const {
    paymentRemindersEnabled,
    newTransactionImportsEnabled,
    togglePaymentReminders,
    toggleNewTransactionImports,
  } = useSettingsStore()

  return (
    <div className="page-content">
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <CategoryManager />
        <SupplierManager />
        <Card>
          <CardHeader>
            <CardTitle>Formas de Pagamento</CardTitle>
            <CardDescription>Gerencie as formas de pagamento.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Forma de
              Pagamento
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>
              Personalize os alertas que você recebe.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label>Lembretes de Pagamento</Label>
                <p className="text-sm text-muted-foreground">
                  Receba alertas sobre contas próximas do vencimento.
                </p>
              </div>
              <Switch
                checked={paymentRemindersEnabled}
                onCheckedChange={togglePaymentReminders}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label>Importação de Transações</Label>
                <p className="text-sm text-muted-foreground">
                  Seja notificado quando novas transações forem importadas.
                </p>
              </div>
              <Switch
                checked={newTransactionImportsEnabled}
                onCheckedChange={toggleNewTransactionImports}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ConfiguracoesPage
